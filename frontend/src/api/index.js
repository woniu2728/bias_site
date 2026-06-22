import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

export function primeCsrfProtection() {
  return api.get('/system/status')
}

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/admin/login/'
    }
    return Promise.reject(error)
  }
)

export default api
