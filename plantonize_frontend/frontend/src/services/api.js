import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // depois colocamos env
});

export default api;
