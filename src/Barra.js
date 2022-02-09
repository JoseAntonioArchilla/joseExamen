import { getAuth } from "firebase/auth"

const Barra = ({ setVentana }) => {
	return (
		<div>
			<p>Usuario {getAuth().currentUser.uid} con email { getAuth().currentUser.email}</p>
			<button onClick={async () => {
				await getAuth().signOut()
				setVentana("Login")
			}} >Cerrar sesión</button>
			<button onClick={() => {
				setVentana("Tienda")
			}} >Tienda</button>
			<button onClick={() => {
				setVentana("SubirArticulo")
			}} >Subir Articulo</button>
		</div>
	)
}

export default Barra