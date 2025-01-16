import { useEffect } from 'react'
import { useStore } from './useStore'
import { UserProfile } from 'src/shared/types/store'

export const useProfile = () => {
  const { login, logout, getProfile } = window.api
  const { value: token } = useStore<UserProfile>({
    key: 'token'
  })
  const { value: profile, isLoading } = useStore<UserProfile>({
    key: 'profile'
  })

  const isLoggedIn = !!profile?.ID

  useEffect(() => {
    if (token && !isLoggedIn) {
      getProfile()
    }
  }, [token])

  return {
    token,
    profile,
    isLoading,
    login,
    logout,
    isLoggedIn
  }
}
