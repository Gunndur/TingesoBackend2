import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/user/');
}

const create = (data) => {
    return httpClient.post('/user/', data);
}

export default { getAll , create };