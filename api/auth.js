//import firebase from "./authkey"
import firebase from 'firebase'
import * as Google from 'expo-google-app-auth';
import {REACT_APP_ANDROID_CLIENT_ID} from "@env"
import firebaseApp from "./authkey";
import * as AppAuth from 'expo-app-auth';

const auth = firebase.auth()

export const signIn =  async ({email, password}, onSuccess, onError) => {
    try {
        const { user } = await auth.signInWithEmailAndPassword(email, password)
        return onSuccess(user)
    } catch (error) {
        return onError(error)
    }

}

export const createAccount = async ({name, email, password}, onSuccess, onError) => {
    try {
        const { user } = await auth.createUserWithEmailAndPassword(email, password)
        // await user.updateProfile({displayName: name})
        return onSuccess(user)
    } catch (error) {
        return onError(error)
    }
}

export const signOut = async (onSuccess, onError) => {
    try {
        await auth.signOut()
        return onSuccess()
    } catch (error) {
        return onError(error)
    }
}

export const signInGoogle = async (onSuccess, onError) => {
    try {   
       
        const result = await Google.logInAsync ({
            androidClientId: REACT_APP_ANDROID_CLIENT_ID,
            androidStandaloneAppClientId: "289124598644-l03nsa4n5oekdo8hrmqt9dflmpm4at41.apps.googleusercontent.com",
            scopes: ["profile", "email"],
            redirectUrl: `${AppAuth.OAuthRedirect}:/oauth2redirect/google`
        });

        if (result.type === 'success') {
            const { idToken, accessToken } = result;
            const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
            auth
                .signInWithCredential(credential)
                .catch(error => {
                    console.log("Firebase credentials error:", error);
                });
        } else {
            return onError("Google authentication error")
        }
        
        return onSuccess()
    } catch (error) {
        return onError(error)
    }
}