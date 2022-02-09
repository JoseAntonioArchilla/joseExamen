
// https://firebase.google.com/docs/web/setup#available-libraries

import { useState } from "react";
import Barra from "./Barra";
import Alojamiento from "./Alojamiento";
import Login from "./Login";
import SubirAlojamiento from "./SubirAlojamiento";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const App = () => {

  const auth = getAuth();
  const [ventana, setVentana] = useState(auth.currentUser ? "Alojamiento" : "Login")
  onAuthStateChanged(auth, (user) => {
    if (user && ventana == "Login") {
      const uid = user.uid;
      setVentana("Alojamiento")
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
          ventana === "Alojamiento" ? <Alojamiento Mias={false}></Alojamiento> :
              ventana === "SubirAlojamiento" ? <SubirAlojamiento setVentana={setVentana}></SubirAlojamiento> :
                "No se ha encontrado la pestaña"
      }
    </>
  );
}

export default App