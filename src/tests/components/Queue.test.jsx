import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Queue from '../../components/Queue/Queue'

const mockTracks = [
  { id: '1', name: 'Song A' },
  { id: '2', name: 'Song B' },
  { id: '3', name: 'Song C' },
]

describe('Queue', () => {
  it('renders track list with numbers', () => {
    render(
      <BrowserRouter>
        <Queue tracks={mockTracks} currentIndex={0} setCurrentIndex={vi.fn()} />
      </BrowserRouter>,
    )
    expect(screen.getByText('Song A')).toBeInTheDocument()
  })

  it('renders all track names', () => {
    render(
      <BrowserRouter>
        <Queue tracks={mockTracks} currentIndex={0} setCurrentIndex={vi.fn()} />
      </BrowserRouter>,
    )
    expect(screen.getByText('Song A')).toBeInTheDocument()
    expect(screen.getByText('Song B')).toBeInTheDocument()
  })

  it('calls setCurrentIndex on track click', () => {
    const setIndex = vi.fn()
    render(
      <BrowserRouter>
        <Queue tracks={mockTracks} currentIndex={0} setCurrentIndex={setIndex} />
      </BrowserRouter>,
    )
    fireEvent.click(screen.getByText('Song B'))
    expect(setIndex).toHaveBeenCalledWith(1)
  })

  it('returns null for empty tracks', () => {
    const { container } = render(
      <BrowserRouter>
        <Queue tracks={[]} currentIndex={0} setCurrentIndex={vi.fn()} />
      </BrowserRouter>,
    )
    expect(container.innerHTML).toBe('')
  })
})
