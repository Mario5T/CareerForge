import api from './api';

export async function sendMessage(message) {
  const res = await api.post('/chatbot/message', { message });
  return res.data?.data;
}

export async function matchJobs(params = {}) {
  const res = await api.get('/chatbot/matchJobs', { params });
  return res.data?.data;
}

export async function jobDetails(jobId) {
  const res = await api.get(`/chatbot/jobDetails/${jobId}`);
  return res.data?.data;
}

export async function userApplications() {
  const res = await api.get('/chatbot/userApplications');
  return res.data?.data;
}

export async function applicationStats() {
  const res = await api.get('/chatbot/applicationStats');
  return res.data?.data;
}
