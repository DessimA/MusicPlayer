import styles from './Login.module.css'

export default function Login({ onLogin, errorMessage }) {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>MusicPlayer</h1>
      <p className={styles.subtitle}>Listen to your YouTube playlists</p>
      {errorMessage && (
        <p className={styles.errorMessage}>{errorMessage}</p>
      )}
      <button className={styles.loginButton} onClick={onLogin}>
        Sign in with Google
      </button>
    </div>
  )
}
