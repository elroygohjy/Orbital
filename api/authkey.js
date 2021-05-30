import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import {
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID
} from "@env"

const firebaseConfig = {
        apiKey: "AIzaSyDtztq7h-nCbddcKZZZRC__-pr8c52lkG0",
        authDomain: "hello-2fc57.firebaseapp.com",
        projectId: "hello-2fc57",
        storageBucket: "hello-2fc57.appspot.com",
        messagingSenderId: 289124598644,
        appId: "1:289124598644:web:9f5211d9a87dee5ee42221"
    }


const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

export default firebaseApp

