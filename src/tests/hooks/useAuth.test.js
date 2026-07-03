import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'

const mockStorage = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = value }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
})

vi.mock('../../api/auth', () => ({
  redirectToGoogleLogin: vi.fn(),
  exchangeAuthorizationCode: vi.fn().mockResolvedValue({ access_token: 'mock-token' }),
  refreshAccessToken: vi.fn(),
  logout: vi.fn(),
}))

vi.mock('../../api/client', () => ({
  setAuthorizationToken: vi.fn(),
}))

describe('useAuth', () => {
  beforeEach(() => {
    mockStorage.clear()
    vi.clearAllMocks()
  })

  it('returns null accessToken when no token stored', async () => {
    const { default: useAuth } = await import('../../hooks/useAuth')
    const { result } = renderHook(() => useAuth())
    expect(result.current.accessToken).toBeNull()
  })

  it('reads token from localStorage', async () => {
    mockStorage.getItem.mockReturnValue('stored-token')
    const { default: useAuth } = await import('../../hooks/useAuth')
    const { result } = renderHook(() => useAuth())
    expect(result.current.accessToken).toBe('stored-token')
  })
})
