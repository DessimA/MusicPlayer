import { AUTH_ENDPOINT, TOKEN_ENDPOINT, SCOPES } from './endpoints'
import { setAuthorizationToken, clearAuthorizationToken } from './client'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET
const REDIRECT_URI = window.location.origin
const REQUIRED_SCOPES = SCOPES.slice()

const VERIFIER_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function generateRandomString(length) {
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (value) => VERIFIER_CHARS[value % VERIFIER_CHARS.length]).join('')
}

function generateCodeVerifier() {
  return generateRandomString(64)
}

function generateState() {
  return generateRandomString(16)
}

async function computeCodeChallenge(verifier) {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function storage() {
  return localStorage
}

export async function redirectToGoogleLogin() {
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await computeCodeChallenge(codeVerifier)
  const state = generateState()

  storage().setItem('code_verifier', codeVerifier)
  storage().setItem('oauth_state', state)

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state,
    scope: SCOPES.join(' '),
    access_type: 'offline',
  })

  window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`
}

function validateTokenScopes(grantedScopes) {
  const grantedList = grantedScopes ? grantedScopes.split(' ') : []

  for (const required of REQUIRED_SCOPES) {
    if (!grantedList.includes(required)) {
      throw new Error(
        `Missing required scope: "${required}". ` +
        `Granted scopes: ${grantedScopes || 'none'}. ` +
        'Please re-authorize the application.',
      )
    }
  }
}

export async function exchangeAuthorizationCode(code) {
  const codeVerifier = storage().getItem('code_verifier')

  if (!codeVerifier) {
    throw new Error(
      'Code verifier not found. This can happen if the page was refreshed during login. Please try again.',
    )
  }

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  })

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error_description ||
        errorData.error ||
        `Token exchange failed with status ${response.status}`,
    )
  }

  const data = await response.json()

  validateTokenScopes(data.scope)

  storage().removeItem('code_verifier')
  storage().removeItem('oauth_state')
  storage().setItem('access_token', data.access_token)

  if (data.refresh_token) {
    storage().setItem('refresh_token', data.refresh_token)
  }

  setAuthorizationToken(data.access_token)
  return data
}

export async function refreshAccessToken() {
  const refreshToken = storage().getItem('refresh_token')

  if (!refreshToken) {
    throw new Error('No refresh token available. Please login again.')
  }

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error_description ||
        errorData.error ||
        `Token refresh failed with status ${response.status}`,
    )
  }

  const data = await response.json()
  storage().setItem('access_token', data.access_token)
  setAuthorizationToken(data.access_token)
  return data
}

export function logout() {
  storage().removeItem('access_token')
  storage().removeItem('refresh_token')
  storage().removeItem('code_verifier')
  storage().removeItem('oauth_state')
  clearAuthorizationToken()
  window.location.href = '/'
}

export function clearAllStorage() {
  const keysToRemove = [
    'access_token',
    'refresh_token',
    'code_verifier',
    'oauth_state',
  ]
  for (const key of keysToRemove) {
    storage().removeItem(key)
  }
  clearAuthorizationToken()
}
