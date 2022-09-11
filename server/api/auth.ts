export default defineEventHandler(async (event) => {
    const req = event.req;

    if(req.method !== 'POST') return { status: 405, body: 'Method Not Allowed' };
    
    const body = await useBody(event)

    const { user } = body;

    req.user = user;

    return { status: 200, updated: true};
})