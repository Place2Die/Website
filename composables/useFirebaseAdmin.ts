import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

export const setUserMinecraft = async (uid, minecraft) => {
    const db = getFirestore()

    const user = doc(db, 'users', uid)

    return await updateDoc(user, {
        mc: minecraft
    })
}

export const setUserDiscord = async (uid, discord) => {
    const db = getFirestore()

    const user = doc(db, 'users', uid)

    return await updateDoc(user, {
        discord
    })
}

export const sendResetPasswordEmailToUser = async (uid) => {
    const db = getFirestore()

    const user = doc(db, 'users', uid)

    const docSnap = await getDoc(user)

    if (docSnap.exists()) {
        const email = docSnap.data().email
        await sendPasswordResetEmail(getAuth(), email)
    } else {
        // doc.data() will be undefined in this case
        return null
    }
}
