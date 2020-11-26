import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PULIC_NODEMAILER_URL}/api`,
});

export default api;
