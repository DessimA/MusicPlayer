import axios from 'axios'
import { YOUTUBE_API_BASE } from './endpoints'

const apiClient = axios.create({
  baseURL: YOUTUBE_API_BASE,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      const endpoint = error.config?.url || 'unknown'
      if (status === 401 || status === 403) {
        const message =
          data?.error?.message || data?.error_description || JSON.stringify(data)
        console.warn(
          `YouTube API ${status} on ${endpoint}: ${message}`,
        )
      }
    }
    return Promise.reject(error)
  },
)

export function setAuthorizationToken(token) {
  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
}

export function clearAuthorizationToken() {
  delete apiClient.defaults.headers.common.Authorization
}

export default apiClient
