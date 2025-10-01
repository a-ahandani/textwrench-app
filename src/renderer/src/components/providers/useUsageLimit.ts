import { useContext } from 'react'
import { UsageLimitContext, UsageLimitContextType } from './UsageLimitContext'

export function useUsageLimit(): UsageLimitContextType {
  const ctx = useContext(UsageLimitContext)
  if (!ctx) throw new Error('useUsageLimit must be used inside UsageLimitProvider')
  return ctx
}
