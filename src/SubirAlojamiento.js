import { getAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const SubirAlojamiento = ({ setVentana }) => {

	const [imageLinks, setImageLinks] = useState([])
	const [direccion, setDireccion] = useState("")
	const [lat, setLat] = useState(0)
	const [lon, setLon] = useState(0)

	const upload = (e) => {
		const db = getFirestore()
		addDoc(collection(db, "Sofas"), {
			anfitrion: getAuth().currentUser.email,
			direccion: direccion,
			lat: lat,
			lon: lon,
			fotos: imageLinks
		}).then((docRef) => {
			setVentana("Alojamiento")
			console.log("alojamiento publicado correctamente con el id: ", docRef.id)
		}).catch((e) => console.error(e))
	}

	return (
		<>
			<p>Direccion del alojamiento</p>
			<input type="text" placeholder="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)}></input>
			<p>Latitud del alojamiento</p>
			<input type="number" value={lat} onChange={(e) => setLat(e.target.value)}></input>
			<p>longitud del alojamiento</p>
			<input type="number" value={lon} onChange={(e) => setLon(e.target.value)}></input>
			
			<p>Para añadir imagenes, simplemente seleccionalas una por una 
				<input type="file" onChange={(e) => {
					const f = e.target.files[0]
					const storage = getStorage();
					const nombreDelArchivo = f.name+f.size+"_"+imageLinks.length; // Para generar un nombre unico

					const storageRef = ref(storage, nombreDelArchivo);

					uploadBytes(storageRef, f).then((snapshot) => {
						getDownloadURL(snapshot.ref).then((url) => {
							setImageLinks([...imageLinks, url])
						}).catch((e) => console.error(e))
					}).catch((e) => console.error(e));				
				}
				}></input>
			</p>
			<div style={{display:"grid", gridTemplateColumns:"auto auto auto"}}>
				{
					imageLinks.map((url, idx) => {
						return <img key={idx} src={url} style={{height: "200px"}}></img>
					})
				}
			</div>
			<button onClick={upload}>Subir</button>
		</>
	)
}

export default SubirAlojamiento