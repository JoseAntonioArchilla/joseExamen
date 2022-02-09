import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where, runTransaction, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const Alojamiento = () => {
	const [alojamientos, setAlojamientos] = useState([])
	const cargarAlojamientos = () => {
		setAlojamientos([])
		const db = getFirestore()
		getDocs(collection(db, "Sofas")).then(snapshot => {
			snapshot.docs
			.forEach((doc) => { 
				console.log(doc.data())
				setAlojamientos(old => [...old, { direccion: doc.data().direccion, fotos: doc.data().fotos, id: doc.id, ref: doc.ref}])
				/*getDocs(query(collection(db, "Reservas"), where("sofa", "==", doc.id))).then(reservas => {
					reservas.docs.forEach((reservaDoc) => {
						setAlojamientos(old => [...old, {  direccion: doc.data().direccion, fotos: doc.data().direccion, id: doc.id, ref: doc.ref, ...reservaDoc.data() }])
					})
				}).catch(e => console.error(e))*/
			})
		}).catch(e => console.error(e))
	}

	console.log("alojamientos ", alojamientos)


	useEffect(cargarAlojamientos,[])
	return (
		<>
			
			{
				alojamientos.map((elem, idx) => {
					return (
						<div key={idx}>
							<p>Direccion: {elem.direccion}</p>
							<p>Anfitrion: {elem.anfitrion}</p>
							<p>Huesped: {elem.huesped}</p>

							<div style={{ display: "grid", gridTemplateColumns: "auto auto auto" }}>
								{
								
									elem.fotos.map((url, idx) => {
										return <img key={idx} src={url} style={{ height: "200px" }}></img>
									})
								}
							</div>
						</div>
					)
				})
			}
		</>
	)
}

export default Alojamiento