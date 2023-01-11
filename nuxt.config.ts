import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    app: {
        head: {
            title: 'Place2Die',
            script: [
                {
                    src: 'https://kit.fontawesome.com/91d11c3d0b.js'
                }
            ]
        }
    },
    runtimeConfig: {
        // The private keys which are only available within server-side
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        // Keys within public, will be also exposed to the client-side
        public: {
            FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
            FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID
        }
    }
})
