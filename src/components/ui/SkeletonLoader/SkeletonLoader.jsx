import styles from './SkeletonLoader.module.css'

export default function SkeletonLoader({ count = 6, variant = 'card' }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={`${styles.skeleton} ${styles[variant]}`}>
          <div className={styles.shimmer} />
        </div>
      ))}
    </div>
  )
}
