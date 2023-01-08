import axios from 'axios'

export const get3DHeadFromUsername = async (username) => {
    const uuid = await getUUUIDFromUsername(username);
    const response = await fetch(`https://crafatar.com/renders/head/${uuid}?overlay`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return url;
}

export const getUUUIDFromUsername = async (username) => {
    const response = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`);
    return response.data.id;
}
