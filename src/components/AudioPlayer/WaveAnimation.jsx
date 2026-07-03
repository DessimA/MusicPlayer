import styles from './AudioPlayer.module.css'

const BOXES = [
  'box1', 'box2', 'box3', 'box4', 'box5', 'box6', 'box7',
  'box2', 'box3', 'box4', 'box5', 'box6', 'box7',
]

export default function WaveAnimation({ isPlaying }) {
  return (
    <div className={styles.boxContainer}>
      {BOXES.map((boxClass, index) => (
        <div
          key={`${boxClass}-${index}`}
          className={`${styles.box} ${styles[boxClass]} ${isPlaying ? styles.active : ''}`}
        />
      ))}
    </div>
  )
}
