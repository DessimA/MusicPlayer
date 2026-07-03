import { formatDuration } from '../../utils/formatters'
import Controls from './Controls'
import ProgressCircle from './ProgressCircle'
import WaveAnimation from './WaveAnimation'
import styles from './AudioPlayer.module.css'

export default function AudioPlayer({
  currentTrack,
  isPlaying,
  togglePlayPause,
  goToNextTrack,
  goToPreviousTrack,
  trackProgress,
  progressPercentage,
  duration,
  hasPreview,
}) {
  if (!currentTrack) {
    return (
      <div className={`${styles.body}`}>
        <p className={styles.noTrack}>Select a track to play</p>
      </div>
    )
  }

  return (
    <div className={`${styles.body}`}>
      <div className={styles.leftBody}>
        <ProgressCircle
          percentage={progressPercentage}
          isPlaying={isPlaying}
          image={currentTrack?.thumbnail}
          size={300}
          color="#ffffff"
        />
      </div>
      <div className={styles.rightBody}>
        <p className={styles.songTitle}>{currentTrack?.name}</p>
        <p className={styles.songArtist}>{currentTrack?.artist}</p>
        <div className={styles.rightBottom}>
          <div className={styles.songDuration}>
            <p className={styles.duration}>
              {formatDuration(Math.round(trackProgress))}
            </p>
            <WaveAnimation isPlaying={isPlaying} />
            <p className={styles.duration}>{formatDuration(Math.round(duration))}</p>
          </div>
          <Controls
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            goToNextTrack={goToNextTrack}
            goToPreviousTrack={goToPreviousTrack}
            hasPreview={hasPreview}
          />
        </div>
      </div>
    </div>
  )
}
