import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiMinimize2, FiSearch } from 'react-icons/fi'
import usePlaylistTracks from '../../hooks/usePlaylistTracks'
import useAudioPlayer from '../../hooks/useAudioPlayer'
import AudioPlayer from '../../components/AudioPlayer/AudioPlayer'
import Queue from '../../components/Queue/Queue'
import Spinner from '../../components/ui/Spinner/Spinner'
import ErrorMessage from '../../components/ui/ErrorMessage/ErrorMessage'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import styles from './Player.module.css'

export default function Player() {
  const location = useLocation()
  const navigate = useNavigate()
  const playlistId = location.state?.id || null
  const playlistName = location.state?.name || ''
  const [currentIndex, setCurrentIndex] = useState(0)
  const [videoMinimized, setVideoMinimized] = useState(false)
  const [queueMinimized, setQueueMinimized] = useState(false)
  const [queueSearch, setQueueSearch] = useState('')
  const { tracks, isLoading, errorMessage: tracksError } = usePlaylistTracks(playlistId)
  const audioPlayer = useAudioPlayer(tracks, currentIndex, setCurrentIndex)

  useEffect(() => {
    setCurrentIndex(0)
    setVideoMinimized(false)
    setQueueSearch('')
  }, [playlistId])

  const filteredTracks = tracks
    ? tracks.filter((t) =>
        t.name.toLowerCase().includes(queueSearch.toLowerCase()),
      )
    : []

  let content
  if (!playlistId) {
    content = (
      <EmptyState
        title="No playlist selected"
        subtitle="Select a playlist from the Library to start listening."
      />
    )
  } else if (isLoading) {
    content = <Spinner />
  } else if (tracksError) {
    content = <ErrorMessage message={tracksError} />
  } else if (!tracks || tracks.length === 0) {
    content = (
      <EmptyState
        title="No videos in this playlist"
        subtitle="Add videos to your YouTube playlist and they will appear here."
      />
    )
  } else {
    content = (
      <div className={styles.layout}>
        <div className={styles.header}>
          <button
            className={styles.backButton}
            onClick={() => navigate('/')}
            aria-label="Back to Library"
          >
            <FiChevronLeft size={24} />
          </button>
          <div className={styles.headerInfo}>
            <h2 className={styles.playlistName}>{playlistName || 'Playlist'}</h2>
            <span className={styles.trackCount}>
              {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
            </span>
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.leftPanel}>
            <div className={styles.videoSection}>
              <div className={`${styles.videoWrapper} ${videoMinimized ? styles.videoWrapperMinimized : ''}`}>
                <div id="youtube-player" className={styles.videoPlayer} />
              </div>
              {!videoMinimized && (
                <button
                  className={styles.hideVideoBtn}
                  onClick={() => setVideoMinimized(true)}
                  title="Audio only"
                  aria-label="Hide video"
                >
                  <FiMinimize2 size={14} />
                </button>
              )}
            </div>
            {videoMinimized && (
              <button
                className={styles.showVideoBtn}
                onClick={() => setVideoMinimized(false)}
              >
                <FiMaximize2 size={14} />
                Show video
              </button>
            )}
            <div className={styles.controls}>
              <AudioPlayer
                currentTrack={audioPlayer.currentTrack}
                isPlaying={audioPlayer.isPlaying}
                togglePlayPause={audioPlayer.togglePlayPause}
                goToNextTrack={audioPlayer.goToNextTrack}
                goToPreviousTrack={audioPlayer.goToPreviousTrack}
                trackProgress={audioPlayer.trackProgress}
                progressPercentage={audioPlayer.progressPercentage}
                duration={audioPlayer.duration}
                hasPreview={audioPlayer.hasPreview}
              />
            </div>
          </div>

          <div className={`${styles.rightPanel} ${queueMinimized ? styles.rightPanelMinimized : ''}`}>
            <button
              className={styles.queueToggle}
              onClick={() => setQueueMinimized((v) => !v)}
              aria-label={queueMinimized ? 'Show playlist' : 'Hide playlist'}
              title={queueMinimized ? 'Show playlist' : 'Hide playlist'}
            >
              <FiChevronRight
                size={16}
                className={queueMinimized ? styles.queueToggleIconClosed : ''}
              />
              {!queueMinimized && <span>Playlist</span>}
            </button>
            {!queueMinimized && (
              <>
                <div className={styles.searchWrapper}>
                  <FiSearch className={styles.searchIcon} size={16} />
                  <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Search in playlist..."
                    value={queueSearch}
                    onChange={(e) => setQueueSearch(e.target.value)}
                  />
                  {queueSearch && (
                    <button
                      className={styles.searchClear}
                      onClick={() => setQueueSearch('')}
                      aria-label="Clear search"
                    >
                      &times;
                    </button>
                  )}
                </div>
                <Queue
                  tracks={filteredTracks}
                  currentIndex={currentIndex}
                  setCurrentIndex={(index) => setCurrentIndex(index)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {content}
    </div>
  )
}
