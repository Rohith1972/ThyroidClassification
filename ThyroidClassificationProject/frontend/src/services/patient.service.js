import api from "./api";

const getAllPatients = (page = 0, size = 10) => {
    return api.get(`/patients?page=${page}&size=${size}`);
};

const getPatient = (id) => {
    return api.get(`/patients/${id}`);
};

const createPatient = (data) => {
    return api.post("/patients", data);
};

const updatePatient = (id, data) => {
    return api.put(`/patients/${id}`, data);
};

const deletePatient = (id) => {
    return api.delete(`/patients/${id}`);
};

const searchPatients = (name, page = 0, size = 10) => {
    return api.get(`/patients/search?name=${name}&page=${page}&size=${size}`);
};

const getAIServices = () => {
    return api.get("/patients/ai-services");
};

const PatientService = {
    getAll: getAllPatients,
    getAllPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients,
    getAIServices
};

export default PatientService;
