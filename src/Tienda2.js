import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, runTransaction, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const Tienda2 = () => {
    const [tesoros, setTesoros] = useState([])
    const [administrador, setAdministrador] = useState(false)
    const [finalizar, setFinalizar] = useState({ estado: false, ganador: "" })
    const cargarArticulos = () => {
        setTesoros([])
        const db = getFirestore()
        getDocs(collection(db, "tesoros")).then(snapshot => {
            snapshot.docs
                .forEach((doc) => {
                    setTesoros(old => [...old, { ...doc.data(), id: doc.id, ref: doc.ref, administrador: administrador }])
                })
        }).catch(e => console.error(e))
    }

    const encontrar = (tesoro) => {
        const db = getFirestore()
        runTransaction(db, async (transaction) => {
            transaction.update(tesoro.ref, { encontrados: [...(tesoro.encontado ? tesoro.encontrado : []) ,{email: getAuth().currentUser.email, timestamp: (new Date()).getMilliseconds()}]})
        }).then(cargarArticulos).catch(e => console.error(e))
    }

    const comprobarAdministrador = () => {
        const db = getFirestore()
        getDocs(query(collection(db, "administrador"), where("email", "==", getAuth().currentUser.email))).then(administradores => {
            let esAdministrador = administradores.docs[0] != null
            setAdministrador(esAdministrador)
        }).catch(e => console.error(e))
    }

    const comprobarFin = () => {
        const map1 = new Map();
        tesoros.forEach((tesoro) =>{
            tesoro.encontrado &&
            tesoro.encontrados.forEach((encontrado) => {
                const num = map1.get(encontrado.email)
                if (num != undefined && num == 5) {
                    setFinalizar({ estado: true, ganador: encontrado.email })
                }
                map1.set(encontrado.email, num ? num + 1 : 1)
            }) 
        })
    }

    useEffect(comprobarFin, [tesoros])

    const empezarCaza = () => {
        const db = getFirestore()
        tesoros.forEach((tesoro) => {
            runTransaction(db, async (transaction) => {
                transaction.update(tesoro.ref, { encontrados: [] })
            }).then(cargarArticulos).catch(e => console.error(e))
        })
    }

    useEffect(cargarArticulos, [])
    useEffect(comprobarAdministrador, [])
    return (
        <>

            {
                tesoros.map((elem, idx) => {
                    return (
                        <div key={idx}>
                            <p>Pista: {elem.pista}</p>
                            <img src={elem.imagen} style={{ height: "200px" }}	></img><p></p>
                            {
                                
                                elem.encontrados == null || elem.encontrados.find(aux =>aux.email == getAuth().currentUser.email) == undefined && finalizar.estado == false ?
                                    <button onClick={() => encontrar(elem)}>Encontrar tesoro</button> :"Has encontrado este tesoro"
                            }
                           
                        </div>
                    )
                })
            }
            {
                finalizar.estado && <p>La caza ha terminado. Ya no se registraran los nuevos encuentros. Ganador {finalizar.ganador}</p>
            }
            {
                administrador && <button onClick={() => empezarCaza()}>Empezar caza!</button>
            }
        </>
    )
}

export default Tienda2