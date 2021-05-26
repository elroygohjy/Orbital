import firebase from "./authkey"

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
        await user.updateProfile({displayName: name})
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
        return onError()
    }
}
