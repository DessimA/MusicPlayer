import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SongCard from '../../components/SongCard/SongCard'

const mockTrack = {
  id: 'video-1',
  videoId: 'abc123',
  name: 'Test Song',
  artist: 'Test Artist',
  thumbnail: 'https://example.com/thumb.jpg',
}

describe('SongCard', () => {
  it('renders track name in title', () => {
    render(<SongCard track={mockTrack} />)
    expect(screen.getByText(/Test Song - Test Artist/)).toBeInTheDocument()
  })

  it('renders track image with correct src', () => {
    render(<SongCard track={mockTrack} />)
    const image = screen.getByAltText('Test Song')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/thumb.jpg')
  })

  it('returns null without track', () => {
    const { container } = render(<SongCard />)
    expect(container.innerHTML).toBe('')
  })
})
