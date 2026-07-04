import { useLocation, useNavigate } from 'react-router-dom'
import { FaPlay, FaSignOutAlt, FaInfoCircle } from 'react-icons/fa'
import { IoLibrary } from 'react-icons/io5'
import styles from './BottomNavigation.module.css'

export default function BottomNavigation({ onLogout, onInfo }) {
  const location = useLocation()
  const navigate = useNavigate()

  const links = [
    { title: 'Player', to: '/player', icon: <FaPlay size={22} /> },
    { title: 'Library', to: '/', icon: <IoLibrary size={22} /> },
    { title: 'Info', to: '', icon: <FaInfoCircle size={22} />, action: onInfo },
    { title: 'Sign Out', to: '', icon: <FaSignOutAlt size={22} />, action: onLogout },
  ]

  function handleClick(link) {
    if (link.action) {
      link.action()
    } else {
      navigate(link.to)
    }
  }

  return (
    <nav className={styles.container}>
      {links.map((link) => {
        const isActive = location.pathname === link.to && link.to !== ''
        return (
          <button
            key={link.title}
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            onClick={() => handleClick(link)}
            aria-label={link.title}
          >
            {link.icon}
            <span className={styles.label}>{link.title}</span>
          </button>
        )
      })}
    </nav>
  )
}
