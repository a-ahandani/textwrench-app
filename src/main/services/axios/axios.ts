import axios, { AxiosError } from 'axios'
import { store } from '../../store'

const baseURL = import.meta.env.VITE_API_SERVER

export const twService = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

twService.interceptors.request.use(
  (config) => {
    const token = store?.get('token')
    config.headers['Authorization'] = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const handleError = (error: unknown): never => {
  throw new Error(
    (
      error as AxiosError<{
        message: string
      }>
    )?.response?.data?.message || 'An unknown error occurred'
  )
}
