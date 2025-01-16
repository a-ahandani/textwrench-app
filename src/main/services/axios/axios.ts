import axios from 'axios'
import { store } from '../../store'

const baseURL = import.meta.env.VITE_API_SERVER

const token = store?.get('token')
export const twService = axios.create({
  baseURL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
})
