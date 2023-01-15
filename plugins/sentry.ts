import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const router = useRouter()

    Sentry.init({
        Vue: nuxtApp.vueApp,
        dsn: config.SENTRY_DSN,
        integrations: [
            new BrowserTracing({
                routingInstrumentation: Sentry.vueRouterInstrumentation(router)
            })
        ],
        tracesSampleRate: 1.0
    })
    nuxtApp.vueApp.config.errorHandler = (error, _vm, info) => {
        Sentry.captureException(error, {
            contexts: {
                info: {
                    info
                }
            }
        })
    }
    nuxtApp.vueApp.config.warnHandler = (msg, _vm, trace) => {
        Sentry.captureMessage(msg, {
            contexts: {
                info: {
                    trace
                }
            }
        })
    }
    nuxtApp.provide('sentry', Sentry)
})
