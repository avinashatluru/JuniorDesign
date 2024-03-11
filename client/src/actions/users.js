import axios from 'axios';

const baseUrl = 'http://localhost:5050/api/attendees';

const getAllUsers = () => {
  return axios.get(baseUrl);
};

const createUser = (newUser) => {
  return axios.post(baseUrl, newUser);
};

const deleteUser = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export {
  getAllUsers,
  createUser,
  deleteUser
};
