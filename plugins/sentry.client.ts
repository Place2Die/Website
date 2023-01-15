import * as Sentry from '@sentry/vue'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    Sentry.init({
        Vue: nuxtApp.vueApp,
        dsn: config.SENTRY_DSN,
        logErrors: true,
        attachProps: true,
        debug: true,
        environment: process.env.NODE_ENV,
        release: config.VERSION,
        autoSessionTracking: true
    })

    nuxtApp.vueApp.config.errorHandler = (err, _vm, _info) => {
        Sentry.captureException(err)
    }

    nuxtApp.vueApp.config.warnHandler = (msg, _vm, _trace) => {
        Sentry.captureMessage(msg)
    }

    nuxtApp.provide('sentry', Sentry)
    nuxtApp.vueApp.provide('sentry', Sentry)
})
