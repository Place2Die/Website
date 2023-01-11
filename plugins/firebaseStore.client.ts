import { initializeApp } from 'firebase/app'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    const firebaseConfig = {
        apiKey: config.FIREBASE_API_KEY,
        projectId: config.FIREBASE_PROJECT_ID
    }

    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)

    nuxtApp.vueApp.provide('db', db)
    nuxtApp.provide('db', db)
})
