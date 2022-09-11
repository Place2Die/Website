import { User } from "firebase/auth";

export const useFirebaseUser = () => useState("firebaseUser", () => {})
export const useFirestoreUser = () => useState("firestoreUser", () => {})
export const useRank = () => useState("rank", () => {})