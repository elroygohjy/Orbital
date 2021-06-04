import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import {
    REACT_APP_API_KEY,
    REACT_APP_AUTH_DOMAIN,
    REACT_APP_PROJECT_ID,
    REACT_APP_STORAGE_BUCKET,
    REACT_APP_MESSAGING_SENDER_ID,
    REACT_APP_APP_ID
} from "@env"

const firebaseConfig = {
        apiKey: REACT_APP_API_KEY,
        authDomain: REACT_APP_AUTH_DOMAIN,
        projectId: REACT_APP_PROJECT_ID,
        storageBucket: REACT_APP_STORAGE_BUCKET,
        messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
        appId: REACT_APP_APP_ID
    }

const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

export default firebaseApp

