import axios from "axios";
const baseUrl = '/api/notes';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
}

const getAll = () => {
  const request = axios.get(baseUrl);
  const nonExisting = {
    id: 10000,
    content: "This note is not saved to server",
    important: true,
  }
  return request.then((response) => response.data.concat(nonExisting)
  );
};

const create = async newObject => {
  // const request = axios.post(baseUrl, newObject);
  // return request.then((response) => response.data);
  const config = {
    headers: { Authorization: token }
  }

  console.log(baseUrl, newObject, config);

  try {
    const response = await axios.post(baseUrl, newObject, config);
    console.log("res:", response.data);
    return response.data;
  } catch (error) {
    console.error("Status:", error.response?.status);
    console.error("Server response:", error.response?.data);
    console.error("Request:", error.config?.data);
  }

  
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then(response => response.data);
};

export default {
  getAll,
  create,
  update,
  setToken
};
