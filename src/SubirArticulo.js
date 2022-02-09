import { getAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const SubirArticulo = ({ setVentana }) => {

	const [imageLinks, setImageLinks] = useState([])
	const [descripcion, setDescripcion] = useState("")
	const [precio, setPrecio] = useState(0)

	const upload = (e) => {
		const db = getFirestore()
		addDoc(collection(db, "Articulos"), {
			vendedor: getAuth().currentUser.email,
			descripcion: descripcion,
			precio: precio,
			imagenes: imageLinks,
			comprador: ""
		}).then((docRef) => {
			setVentana("Tienda")
			console.log("Articulo publicado correctamente con el id: ", docRef.id)
		}).catch((e) => console.error(e))
	}

	return (
		<>
			<input type="text" placeholder="Descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></input>
			<input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)}></input>
			
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

export default SubirArticulo