import { IconContext } from 'react-icons'
import { Link, useLocation } from 'react-router-dom'
import styles from './Sidebar.module.css'

export default function SidebarButton({ title, to, icon, onClick }) {
  const location = useLocation()
  const isActive = location.pathname === to && to !== ''

  function handleClick(event) {
    if (onClick) {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <Link to={onClick ? '#' : to} onClick={handleClick}>
      <div
        className={`${styles.buttonBody} ${isActive ? styles.active : ''}`}
      >
        <IconContext.Provider
          value={{ size: '24px', className: styles.buttonIcon }}
        >
          {icon}
          <p className={styles.buttonTitle}>{title}</p>
        </IconContext.Provider>
      </div>
    </Link>
  )
}
