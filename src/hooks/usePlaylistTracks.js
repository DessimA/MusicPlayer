import { useState, useEffect } from 'react'
import apiClient from '../api/client'

function normalizeItem(item) {
  const snippet = item.snippet
  return {
    id: snippet.resourceId.videoId,
    videoId: snippet.resourceId.videoId,
    name: snippet.title,
    artist: snippet.channelTitle,
    thumbnail: snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '',
  }
}

export default function usePlaylistTracks(playlistId) {
  const [tracks, setTracks] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    let cancelled = false

    if (!playlistId) {
      setTracks([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    apiClient
      .get('playlistItems', {
        params: {
          part: 'snippet',
          playlistId,
          maxResults: 50,
        },
      })
      .then((response) => {
        if (cancelled) return
        const items = (response.data.items || []).map(normalizeItem)
        setTracks(items)
        setIsLoading(false)
      })
      .catch((error) => {
        if (cancelled) return
        if (error.response?.status === 401) {
          setErrorMessage('Session expired. Please login again.')
        } else {
          setErrorMessage('Failed to load tracks. Please try again.')
        }
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [playlistId])

  return { tracks, isLoading, errorMessage }
}
