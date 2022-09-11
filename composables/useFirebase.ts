import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { doc, getDoc, getFirestore, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

export const createUser = async (email, password) => {
    const auth = getAuth();
    const credentials = await createUserWithEmailAndPassword(auth, email, password)
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            return { code: errorCode, error_message: errorMessage };
        });
    
    if(credentials) {
        sendVerificationEmail();
        
        //Create user document in firestore
        createUserFile();
    }
    return credentials;
}

export const signInUser = async (email, password) => {
    const auth = getAuth();
    auth.useDeviceLanguage();
    const credentials = await signInWithEmailAndPassword(auth, email, password)
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    return credentials;
}

export const signInGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const credentials = await signInWithPopup(auth, provider)
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    return credentials;

}

export const initUser = async () => {
    const auth = getAuth();
    const firebaseUser = useFirebaseUser();
    const firestoreUser = useFirestoreUser();
    const rank = useRank();
    // @ts-ignore
    firebaseUser.value = auth.currentUser;

    let unsubscribe;

    const userCookie = useCookie('user')
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            
            unsubscribe = onSnapshot(doc(getFirestore(), "users", user.uid), (doc) => {
                // @ts-ignore
                firestoreUser.value = doc.data();
                useRank.value = getRankFile(doc.data().rank);
            });
        } else {
            // User is signed out
            if(unsubscribe) unsubscribe();
            unsubscribe = null;
            firestoreUser.value = null;
        }
        // @ts-ignore
        firebaseUser.value = user;
        // @ts-ignore
        userCookie.value = user;

        $fetch('/api/auth', {
            method: 'POST',
            body: { user }
        })
    });

    // @ts-ignore
    firestoreUser.value = await getUserFile();
    // @ts-ignore
    rank.value = await getRankFile(firestoreUser.value.rank);
}

export const signOutUser = async () => {
    const auth = getAuth();
    const result = await auth.signOut();
    const rank = useRank();
    rank.value = null;
    const userFile = useFirestoreUser();
    userFile.value = null;

    return result;
}

export const updateProfile = async (displayName, photoURL) => {
    const auth = getAuth();
    return await updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: photoURL
    })
}

export const sendVerificationEmail = async () => {
    const auth = getAuth();
    return await sendEmailVerification(auth.currentUser)
}

export const updateDiscord = async (discord) => {
    const db = getFirestore();
    const auth = getAuth();

    if(!auth.currentUser) return;

    const user = doc(db, "users", auth.currentUser.uid);

    return await updateDoc(user, {
        discord: discord
    })
}

export const updateMinecraft = async (minecraft) => {
    const db = getFirestore();
    const auth = getAuth();

    if(!auth.currentUser) return;

    const user = doc(db, "users", auth.currentUser.uid);

    return await updateDoc(user, {
        mc: minecraft
    })
}

export const updateRank = async (rank) => {
    const db = getFirestore();
    const auth = getAuth();

    if(!auth.currentUser) return;

    const user = doc(db, "users", auth.currentUser.uid);

    return await updateDoc(user, {
        rank: rank
    })
}

export const createUserFile = async () => {
    const db = getFirestore();
    const auth = getAuth();

    if(!auth.currentUser) return;

    const user = doc(db, "users", auth.currentUser.uid);

    return await setDoc(user, {
        uid: auth.currentUser.uid,
        discord: "",
        mc: "",
        rank: "user"
    })

}

export const getRank = async () => {
    const db = getFirestore();
    const auth = getAuth();

    if(!auth.currentUser) return;

    const user = doc(db, "users", auth.currentUser.uid);

    const docSnap = await getDoc(user);

    if (docSnap.exists()) {
        return docSnap.data().rank;
    } else {
        // doc.data() will be undefined in this case
        return "user";
    }
}

export const getRankFile = async (rankName) => {
    const db = getFirestore();
    const rankF = useRank()

    if(!rankName) return {};

    const rank = doc(db, "ranks", rankName);

    const docSnap = await getDoc(rank);

    if (docSnap.exists()) {
        // @ts-ignore
        rankF.value = docSnap.data();
        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        // @ts-ignore
        rankF.value = {};
        return {};
    }
}

export const isAllowed = async (permission) => {
    const rank = await getRank();
    const rankFile = await getRankFile(rank);

    if(rankFile.permissions.includes(permission)) {
        return true;
    }
    return false;
}

export const getUserFile = async () => {
    const db = getFirestore();
    const auth = getAuth();
    const userFile = useFirestoreUser();

    if(!auth.currentUser) return;

    const user = doc(db, "users", auth.currentUser.uid);

    const docSnap = await getDoc(user);

    if (docSnap.exists()) {
        // @ts-ignore
        userFile.value = docSnap.data();
        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        userFile.value = null;
        return {};
    }
}