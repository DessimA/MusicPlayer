import styles from './Queue.module.css'

export default function Queue({ tracks, currentIndex, setCurrentIndex }) {
  if (!tracks || tracks.length === 0) return null

  return (
    <div className={styles.body}>
      <div className={styles.list}>
        {tracks.map((item, index) => (
          <div
            key={item.id || index}
            className={`${styles.item} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => setCurrentIndex(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setCurrentIndex(index)
            }}
          >
            <span className={styles.index}>{index + 1}</span>
            <div className={styles.info}>
              <p className={styles.trackName}>{item.name}</p>
              {item.artist && <p className={styles.artist}>{item.artist}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
