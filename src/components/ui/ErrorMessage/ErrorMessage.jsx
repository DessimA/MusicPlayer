import styles from './ErrorMessage.module.css'

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null

  return (
    <div className={styles.container}>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.retryButton} onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  )
}
