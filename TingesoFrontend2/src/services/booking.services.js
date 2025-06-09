import httpClient from "../http-common";

const create = data => {
    return httpClient.post("/reservas/", data);
}

const getAll = () => {
    return httpClient.get('/reservas/');
}

const get = id => {
    return httpClient.get(`/reservas/${id}`);
}

const update = data => {
    return httpClient.put("/reservas/", data);
}

const remove = id => {
    return httpClient.delete(`/reservas/${id}`);
}

export default { create , get , remove , getAll, update};