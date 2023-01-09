export default defineEventHandler(async (event) => {
    event.req.user = parseCookies(event).user;
})