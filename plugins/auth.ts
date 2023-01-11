export default defineNuxtPlugin(() => {
    addRouteMiddleware('auth', () => {
        const { $auth } = useNuxtApp()

        if (!$auth?.currentUser?.uid) {
            return navigateTo('/login')
        }
    })

    addRouteMiddleware('admin_panel', () => {
        const { $auth } = useNuxtApp()
        const rank = useRank()
        // @ts-ignore
        const hasAccessToAdminPanel = rank?.value?.permissions['admin.panel'] || false
        // @ts-ignore
        if (!$auth?.currentUser?.uid || !hasAccessToAdminPanel) {
            return navigateTo('/login?r=/admin')
        }
    })
})
