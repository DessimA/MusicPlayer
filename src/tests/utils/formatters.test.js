import { describe, it, expect } from 'vitest'
import { formatDuration } from '../../utils/formatters'

describe('formatDuration', () => {
  it('formats zero seconds', () => {
    expect(formatDuration(0)).toBe('0:00')
  })

  it('formats 30 seconds', () => {
    expect(formatDuration(30)).toBe('0:30')
  })

  it('formats 1 minute 15 seconds', () => {
    expect(formatDuration(75)).toBe('1:15')
  })

  it('formats null as 0:00', () => {
    expect(formatDuration(null)).toBe('0:00')
  })

  it('formats undefined as 0:00', () => {
    expect(formatDuration(undefined)).toBe('0:00')
  })
})
