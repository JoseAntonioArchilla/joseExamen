
// https://firebase.google.com/docs/web/setup#available-libraries

import { useState } from "react";
import Barra from "./Barra";
import Tienda from "./Tienda";
import Tienda2 from "./Tienda2";
import Login from "./Login";
import SubirArticulo from "./SubirArticulo";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const App = () => {

  const auth = getAuth();
  const [ventana, setVentana] = useState(auth.currentUser ? "Tienda" : "Login")
  onAuthStateChanged(auth, (user) => {
    if (user && ventana == "Login") {
      const uid = user.uid;
      setVentana("Tienda")
      // ...
    } else {
      // User is signed out
      // ...
    }
  });

  return (
    <>
      {
        (ventana !== "Login") && <Barra setVentana={setVentana} ></Barra>
      }

      {
        ventana === "Login" ? <Login setVentana={setVentana}></Login> :
          ventana === "Tienda" ? <Tienda2 Mias={false}></Tienda2> :
              ventana === "SubirArticulo" ? <SubirArticulo setVentana={setVentana}></SubirArticulo> :
                "No se ha encontrado la pestaña"
      }
    </>
  );
}

export default App