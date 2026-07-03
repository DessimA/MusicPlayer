import { useState, useEffect, useCallback } from 'react'
import {
  redirectToGoogleLogin,
  exchangeAuthorizationCode,
  logout as performLogout,
  clearAllStorage,
} from '../api/auth'
import { setAuthorizationToken } from '../api/client'

export default function useAuth() {
  const [accessToken, setAccessToken] = useState(null)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const authorizationCode = urlParams.get('code')
    const returnedState = urlParams.get('state')
    const errorParam = urlParams.get('error')

    if (errorParam) {
      setAuthError(`Google authorization denied: ${errorParam}`)
      clearAllStorage()
      return
    }

    if (authorizationCode) {
      const storedState = localStorage.getItem('oauth_state')

      if (returnedState && returnedState !== storedState) {
        setAuthError('State mismatch. Possible security issue. Please try again.')
        clearAllStorage()
        return
      }

      const cleanUrl = window.location.origin + '/'
      window.history.replaceState({}, document.title, cleanUrl)

      exchangeAuthorizationCode(authorizationCode)
        .then((data) => {
          setAccessToken(data.access_token)
        })
        .catch((error) => {
          clearAllStorage()
          setAuthError(error.message)
          setAccessToken(null)
        })
      return
    }

    const storedToken = localStorage.getItem('access_token')
    if (storedToken) {
      setAccessToken(storedToken)
      setAuthorizationToken(storedToken)
    }
  }, [])

  const login = useCallback(() => {
    clearAllStorage()
    setAuthError(null)
    redirectToGoogleLogin()
  }, [])

  const logout = useCallback(() => {
    performLogout()
    setAccessToken(null)
    setAuthError(null)
  }, [])

  return { accessToken, authError, login, logout }
}
