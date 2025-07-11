import axios, { AxiosError } from 'axios'
import { store } from './store'
import { getMainWindow } from './window'
import { updateStore } from '../services/update-store'
import log from 'electron-log'
import { IPC_EVENTS } from '@shared/ipc-events'
import { BASE_URL } from '@shared/constants'

export const twService = axios.create({
  baseURL: BASE_URL,
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

twService.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error?.response?.status === 401) {
      log.warn('UNAUTHORIZED REQUEST', error.response.status)
      const mainWindow = getMainWindow()
      updateStore('token', null)
      mainWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
    }
    return Promise.reject(error)
  }
)

export const handleError = (error: unknown): never => {
  log.error('ERROR', error)
  throw new Error(
    (
      error as AxiosError<{
        message: string
      }>
    )?.response?.data?.message || 'An unknown error occurred'
  )
}
