import styles from './EmptyState.module.css'

export default function EmptyState({ title, subtitle }) {
  return (
    <div className={styles.container}>
      <p className={styles.title}>{title || 'Nothing here yet'}</p>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  )
}
