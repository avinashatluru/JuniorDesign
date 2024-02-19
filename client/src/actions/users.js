import axios from 'axios';

const baseUrl = 'http://localhost:5050/users';

const getAllUsers = () => {
  return axios.get(baseUrl);
};

const createUser = (newUser) => {
  return axios.post(baseUrl, newUser);
};

const deleteUser = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default {
  getAllUsers,
  createUser,
  deleteUser
};
