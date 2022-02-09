import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, runTransaction, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const Tienda = () => {
	const [tesoros, setTesoros] = useState([])
	const [administrador, setAdministrador] = useState(false)
	const [finalizar, setFinalizar] = useState({estado:false, ganador:""})
	const cargarArticulos = () => {
		setTesoros([])
		const db = getFirestore()
		getDocs(collection(db, "tesoros")).then(snapshot => {
			snapshot.docs
			.forEach((doc) => { 
				getDocs(query(collection(db, "encontrados"), where("identificador", "==", doc.id), where("email", "==", getAuth().currentUser.email))).then(encontrados => {
					let encontrado = encontrados.docs[0] != null
					
					setTesoros(old => [...old, {...doc.data(), id: doc.id, ref: doc.ref, encontrado: encontrado, administrador: administrador}])
				}).catch(e => console.error(e))
			})
		}).catch(e => console.error(e))
	}

	const encontrar = (id_tesoro) => {
		const db = getFirestore()
		addDoc(collection(db, "encontrados"), {
			email: getAuth().currentUser.email,
			timestamp: (new Date()).getUTCDay(),
			identificador: id_tesoro,
		}).then((docRef) => {
			cargarArticulos()
		}).catch((e) => console.error(e))
	}

	console.log("tesoros ", tesoros)

	const comprobarAdministrador = () => {
		const db = getFirestore()
		getDocs(query(collection(db, "administrador"), where("email", "==", getAuth().currentUser.email))).then(administradores => {
			let esAdministrador = administradores.docs[0] != null
			setAdministrador(esAdministrador)
		}).catch(e => console.error(e))
	}

	const comprobarFin = () => {
		const map1 = new Map();
		const db = getFirestore()
		getDocs(collection(db, "encontrados")).then(snapshot => {
			snapshot.docs
				.forEach((doc) =>{
					const data = doc.data()
					const num = map1.get(data.email)
					if (num != undefined && num == 5){
						setFinalizar({ estado: true, ganador: data.email })
					}
					map1.set(data.email, num ? num +1 : 1)
				})
		}).catch(e => console.error(e))
	}

	useEffect(comprobarFin,[tesoros])
	console.log("email", getAuth().currentUser.email)

	const empezarCaza = () => {
		const db = getFirestore()
		db
		.collection('encontrados')
		.get()
		.toPromise()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				doc.ref.delete();
			});
		});	
		cargarArticulos()
	}

	useEffect(cargarArticulos,[])
	useEffect(comprobarAdministrador,[])
	return (
		<>
			
			{
				tesoros.map((elem, idx) => {
					return (
						<div key={idx}>
							<p>Pista: {elem.pista}</p>
							<img src={elem.imagen} style={{ height: "200px" }}	></img><p></p>
							{
								elem.encontrado == false && finalizar == false &&
									<button onClick={() => encontrar(elem.id)}>Encontrar tesoro</button>
							}
							{
								elem.encontrado == true &&
								<p>Has encontrado este tesoro</p>
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

export default Tienda