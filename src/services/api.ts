import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NODEMAILER_URL}/api`,
});

export default api;
