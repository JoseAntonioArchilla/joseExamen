import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { initializeApp } from "firebase/app";
//import { getFirestore } from "firebase/firestore";
//import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDwetOGxmzhl3dyHLFlwLAkCyFAOPSSPRQ",
  authDomain: "examen-6e3b8.firebaseapp.com",
  projectId: "examen-6e3b8",
  storageBucket: "examen-6e3b8.appspot.com",
  messagingSenderId: "975268629501",
  appId: "1:975268629501:web:105f98492fc32177376794"
};
initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);