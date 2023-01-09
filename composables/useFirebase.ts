import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, fetchSignInMethodsForEmail} from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

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
            console.log(errorCode, errorMessage);
            return { code: errorCode, error_message: errorMessage };
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
            console.log(errorCode, errorMessage);
            return { code: errorCode, error_message: errorMessage };
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
                // @ts-ignore
                getRankFile(doc.data().rank).then((rankFile) => {
                    // @ts-ignore
                    rank.value = rankFile;
                });
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
    if(firestoreUser.value) {
        // @ts-ignore
        rank.value = await getRankFile(firestoreUser.value.rank);
    } else {
        // @ts-ignore
        rank.value = null;
    }

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

export const doesEmailExist = async (email) => {
    const auth = getAuth();
    const result = await fetchSignInMethodsForEmail(auth, email);
    return result.length > 0;
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

export const updateRankOfUser = async (uid, rank) => {
    const db = getFirestore();

    const user = doc(db, "users", uid);

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
        email: auth.currentUser.email,
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

export const getRankFromUID = async (uid) => {
    const db = getFirestore();

    const user = doc(db, "users", uid);

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

    if(!rankName) return {};

    const rank = doc(db, "ranks", rankName);

    const docSnap = await getDoc(rank);

    if (docSnap.exists()) {
        // @ts-ignore
        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        // @ts-ignore
        return {};
    }
}

export const isAllowed = async (permission) : Promise<boolean> => {
    const rank = await getRank();
    const rankFile = await getRankFile(rank);
    return rankFile.permissions[permission] === true || false;
}

export const getUserFile = async () => {
    const db = getFirestore();
    const auth = getAuth();
    const userFile = useFirestoreUser();

    if(!auth.currentUser) return null;

    const user = doc(db, "users", auth.currentUser.uid);

    const docSnap = await getDoc(user);

    if (docSnap.exists()) {
        // @ts-ignore
        userFile.value = docSnap.data();
        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        userFile.value = null;
        return null;
    }
}

export const getAllUsers = async () => {

    const db = getFirestore();
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const users = [];
    snapshot.forEach((doc) => {
        users.push(doc.data());
    });
    for (let i = 0; i < users.length; i++) {
        users[i].rank = await getRankFile(users[i].rank);
    }
    return users;

}

export const getAllRanks = async () => {
    const db = getFirestore();
    const ranksRef = collection(db, 'ranks');
    const snapshot = await getDocs(ranksRef);
    const ranks = [];
    snapshot.forEach((doc) => {
        ranks.push(doc.data());
    });
    return ranks;
}