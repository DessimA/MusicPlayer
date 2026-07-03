import { FaPause } from 'react-icons/fa'
import { IoPlaySkipBack, IoPlaySkipForward, IoPlay } from 'react-icons/io5'
import styles from './AudioPlayer.module.css'

export default function Controls({
  isPlaying,
  togglePlayPause,
  goToNextTrack,
  goToPreviousTrack,
  hasPreview,
}) {
  return (
    <div className={styles.controlsWrapper}>
      <button
        className={styles.controlBtn}
        onClick={goToPreviousTrack}
        aria-label="Previous track"
      >
        <IoPlaySkipBack size={18} />
      </button>
      <button
        className={`${styles.playBtn} ${isPlaying ? styles.playBtnActive : ''}`}
        onClick={hasPreview ? togglePlayPause : undefined}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        disabled={!hasPreview}
      >
        {isPlaying ? <FaPause size={16} /> : <IoPlay size={16} />}
      </button>
      <button
        className={styles.controlBtn}
        onClick={goToNextTrack}
        aria-label="Next track"
      >
        <IoPlaySkipForward size={18} />
      </button>
    </div>
  )
}
