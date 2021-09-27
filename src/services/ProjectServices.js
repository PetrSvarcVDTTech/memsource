import axios from 'axios'

const apiClient = axios.create({
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getProjects() {
    return apiClient.get('/projects')
  },
  getProject(id) {
    return apiClient.get('/projects/' + id)
  },
  postProject(newProject) {
    return apiClient.post('/projects', newProject)
  },
  putProject(id, project) {
    return apiClient.put('/projects/' + id, project)
  },
  deleteProject(id) {
    return apiClient.delete('/projects/' + id)
  }
}
