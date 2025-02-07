import axios, { AxiosError } from 'axios'
import { store } from '../../store'
import { IPC_EVENTS } from '../../../shared/ipc-events'
import { getMainWindow } from '../window/window'
import { updateStore } from '../../store/helpers'

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
    console.log('AXIOS====>', token)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

twService.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      console.log('UNAUTHORIZED REQUEST', error.response.status)
      const mainWindow = getMainWindow()
      updateStore('token', null)
      mainWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
    }
    return Promise.reject(error.response.status)
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
