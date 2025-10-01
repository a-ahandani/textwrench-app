import { createContext } from 'react'
import type { UsageLimitInfo } from './UsageLimitProvider'

export interface UsageLimitContextType {
  info: UsageLimitInfo | null
  dismiss: () => void
}

export const UsageLimitContext = createContext<UsageLimitContextType | undefined>(undefined)
