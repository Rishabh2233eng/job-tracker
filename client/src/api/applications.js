import api from './axios'

export const getApplications = async () => {
  const { data } = await api.get('/applications')
  return data.applications
}

export const createApplication = async (applicationData) => {
  const { data } = await api.post('/applications', applicationData)
  return data.application
}

export const updateApplication = async (id, applicationData) => {
  const { data } = await api.put(`/applications/${id}`, applicationData)
  return data.application
}

export const deleteApplication = async (id) => {
  await api.delete(`/applications/${id}`)
}