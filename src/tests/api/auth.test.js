import { describe, it, expect, vi, beforeEach } from 'vitest'

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

Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    },
    subtle: {
      digest: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
    },
  },
})

describe('auth module', () => {
  beforeEach(() => {
    mockStorage.clear()
    vi.clearAllMocks()
  })

  it('exports required functions', async () => {
    const auth = await import('../../api/auth')
    expect(auth.redirectToGoogleLogin).toBeInstanceOf(Function)
    expect(auth.exchangeAuthorizationCode).toBeInstanceOf(Function)
    expect(auth.refreshAccessToken).toBeInstanceOf(Function)
    expect(auth.logout).toBeInstanceOf(Function)
  })

  it('exchangeAuthorizationCode throws when verifier missing', async () => {
    mockStorage.getItem.mockReturnValue(null)
    const { exchangeAuthorizationCode } = await import('../../api/auth')
    await expect(exchangeAuthorizationCode('some-code')).rejects.toThrow(
      'Code verifier not found',
    )
  })
})
