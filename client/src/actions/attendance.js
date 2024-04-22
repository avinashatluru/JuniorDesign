import axios from 'axios';

const baseUrl = 'http://localhost:5050/api/attendance';

const getAllAttendance = () => {
  return axios.get(baseUrl);
};

const createAttendance = (newAttendance) => {
  return axios.post(baseUrl, newAttendance);
};

const deleteAttendance = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const updatedAttendance = (id, newAttendance) => {
  return axios.put(`${baseUrl}/${id}`, newAttendance);
}

export {
  getAllAttendance,
  createAttendance,
  deleteAttendance,
  updatedAttendance
};
