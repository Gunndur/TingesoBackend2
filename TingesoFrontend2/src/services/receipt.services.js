import httpClient from "../http-common";

const get = id => {
    return httpClient.get(`/comprobantes/${id}`);
}

export default { get };