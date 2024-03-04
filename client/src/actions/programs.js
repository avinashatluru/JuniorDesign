import axios from 'axios';

const baseUrl = 'http://localhost:5050/api/programs';

const getAllPrograms = () => {
  return axios.get(baseUrl);
};

const createProgram = (newProgram) => {
  return axios.post(baseUrl, newProgram);
};

const deleteProgram = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export {
  getAllPrograms,
  createProgram,
  deleteProgram
};
