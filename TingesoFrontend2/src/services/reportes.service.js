import httpClient from "../http-common";

const getReporteFee = (fee) => {
    return httpClient.get(`/reportes/fee/${fee}`);
};

const getReporteGroup = (groupSize) => {
    return httpClient.get(`/reportes/grupo/${groupSize}`);
};

export default { getReporteFee, getReporteGroup };