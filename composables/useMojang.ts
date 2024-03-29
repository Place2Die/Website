import axios from 'axios'

export const get3DHeadFromUsername = async (username) => {
    const uuid = await getUUUIDFromUsername(username)
    const response = await fetch(`https://crafatar.com/renders/head/${uuid}?overlay`)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    return url
}

export const getUUUIDFromUsername = async (username) => {
    const response = await axios({
        method: 'get',
        url: `https://api.codetabs.com/v1/proxy/?quest=https://api.mojang.com/users/profiles/minecraft/${username}`,
        withCredentials: false,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.data.id
}
