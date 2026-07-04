import { FiGithub, FiLinkedin } from 'react-icons/fi'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.text}>
        Developed by{' '}
        <a
          href="https://github.com/DessimA"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          <FiGithub size={14} />
          DessimA
        </a>
        <span className={styles.separator}>|</span>
        <a
          href="https://linkedin.com/in/dessima"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          <FiLinkedin size={14} />
          /in/dessima
        </a>
      </span>
    </footer>
  )
}
