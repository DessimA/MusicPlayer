import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconContext } from 'react-icons'
import { AiFillPlayCircle } from 'react-icons/ai'
import apiClient from '../../api/client'
import Spinner from '../../components/ui/Spinner/Spinner'
import ErrorMessage from '../../components/ui/ErrorMessage/ErrorMessage'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import SkeletonLoader from '../../components/ui/SkeletonLoader/SkeletonLoader'
import styles from './Library.module.css'

function normalizePlaylist(item) {
  return {
    id: item.id,
    name: item.snippet.title,
    thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
    itemCount: item.contentDetails?.itemCount || 0,
  }
}

export default function Library() {
  const [playlists, setPlaylists] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const navigate = useNavigate()

  async function fetchPlaylists() {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await apiClient.get('playlists', {
        params: {
          part: 'snippet,contentDetails',
          mine: true,
          maxResults: 50,
        },
      })
      const items = (response.data.items || []).map(normalizePlaylist)
      setPlaylists(items)
    } catch {
      setErrorMessage('Failed to load your playlists. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPlaylists()
  }, [])

  function navigateToPlayer(playlistId) {
    navigate('/player', { state: { id: playlistId } })
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <SkeletonLoader count={8} variant="card" />
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className={styles.container}>
        <ErrorMessage message={errorMessage} onRetry={fetchPlaylists} />
      </div>
    )
  }

  if (!playlists || playlists.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="No playlists found"
          subtitle="Create a playlist on YouTube and it will appear here."
        />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {playlists.map((playlist) => (
          <div
            className={styles.card}
            key={playlist.id}
            onClick={() => navigateToPlayer(playlist.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                navigateToPlayer(playlist.id)
              }
            }}
          >
            <img
              src={playlist.thumbnail}
              className={styles.image}
              alt={`${playlist.name} cover`}
            />
            <p className={styles.title}>{playlist.name}</p>
            <p className={styles.subtitle}>
              {playlist.itemCount} {playlist.itemCount === 1 ? 'video' : 'videos'}
            </p>
            <div className={styles.fade}>
              <IconContext.Provider value={{ size: '50px', color: '#1ed760' }}>
                <AiFillPlayCircle />
              </IconContext.Provider>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
