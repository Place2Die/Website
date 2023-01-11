export default defineEventHandler((event) => {
    event.req.user = parseCookies(event).user
})
