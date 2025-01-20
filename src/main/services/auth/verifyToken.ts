import { IPC_EVENTS } from '../../../shared/ipc-events'
import { twService } from '../axios/axios'
import { updateStore } from '../../store/helpers'
import { getMainWindow } from '../window/window'
import { store } from '../../store'

export async function verifyToken() {
  const mainWindow = getMainWindow()
  if (!mainWindow) return
  const token = twService.defaults.headers.common['Authorization'] || store.get('token')

  if (!token) return
  twService.defaults.headers.common['Authorization'] = `Bearer ${token}`

  try {
    const result = await twService.get('/protected/profile')
    mainWindow.webContents.send(IPC_EVENTS.LOGIN_FULFILLED, { token: 'verified' })
    console.log('Token verified:', result.data)
    return
  } catch (error) {
    updateStore('token', null)
    mainWindow.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
  }
}
