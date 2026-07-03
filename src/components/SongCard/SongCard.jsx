import styles from './SongCard.module.css'

export default function SongCard({ track }) {
  if (!track) return null

  return (
    <div className={styles.body}>
      <div className={styles.videoImage}>
        <img src={track.thumbnail} alt={track.name} className={styles.videoImageArt} />
      </div>
      <div className={styles.videoInfoCard}>
        <div className={styles.titleContainer}>
          <div className={styles.marquee}>
            <p>{`${track.name} - ${track.artist}`}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
