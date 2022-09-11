export default defineEventHandler(async (event) => {
    const userCookie = parseCookies(event).user;
    event.req.user = userCookie;
})