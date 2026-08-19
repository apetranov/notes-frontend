import axios from "axios";
const baseUrl = '/api/users';

const getAll = async () => {
    const response = await axios.get(baseUrl);
    // console.log("users:",response.data);
    return response.data;
}

const getByUsername = async (username) => {
    const all = await getAll();
    let user = null;
    for (let i = 0; i < all.length; i++) {
        if (all[i].username === username) {
            user = all[i];
            break;
        }
    }
    // console.log("user found:", user);
    return user;
}

export default { getAll, getByUsername };