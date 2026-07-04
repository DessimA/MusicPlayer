import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Library from '../../screens/Library/Library'

vi.mock('../../api/client', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('Library', () => {
  it('renders loading state initially', () => {
    const { container } = render(
      <BrowserRouter>
        <Library />
      </BrowserRouter>,
    )
    const skeletons = container.querySelectorAll('[class*="skeleton"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})
