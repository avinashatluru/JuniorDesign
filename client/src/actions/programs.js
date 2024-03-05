import axios from 'axios';

const baseUrl = 'http://localhost:5050/api/program';

const getAllPrograms = () => {
  return axios.get(baseUrl);
};

const createProgram = (newProgram) => {
  return axios.post(baseUrl, newProgram);
};

const addAttendees = (programId, attendeesToAdd) => {
  return axios.put(`${baseUrl}/${programId}/add-attendees`, { attendeesToAdd });
};

const deleteProgram = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export {
  getAllPrograms,
  createProgram,
  deleteProgram,
  addAttendees
};
