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

export const getNotes = async (applicationId) => {
  const { data } = await api.get(`/applications/${applicationId}/notes`)
  return data.notes
}

export const createNote = async (applicationId, content) => {
  const { data } = await api.post(`/applications/${applicationId}/notes`, { content })
  return data.note
}

export const deleteNote = async (applicationId, noteId) => {
  await api.delete(`/applications/${applicationId}/notes/${noteId}`)
}