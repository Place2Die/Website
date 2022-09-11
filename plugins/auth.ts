export default defineNuxtPlugin(() => {
    addRouteMiddleware('auth', () => {
      const { $auth } = useNuxtApp()

      if(!$auth?.currentUser?.uid) {
        return navigateTo('/login')
      }
    }),

    addRouteMiddleware('admin_panel', () => {
      const { $auth } = useNuxtApp()
      const rank = useRank();

      // @ts-ignore
      if(!$auth?.currentUser?.uid || rank?.value?.permissions?.admin_panel !== true) {
        return navigateTo('/login?r=/admin')
      }
    })
  })