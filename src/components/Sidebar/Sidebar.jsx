import { useState, useEffect } from 'react'
import { FaPlay, FaSignOutAlt } from 'react-icons/fa'
import { IoLibrary } from 'react-icons/io5'
import apiClient from '../../api/client'
import SidebarButton from './SidebarButton'
import styles from './Sidebar.module.css'

export default function Sidebar({ onLogout }) {
  const [profileImage, setProfileImage] = useState(
    'https://freesvg.org/img/abstract-user-flat-4.png',
  )

  useEffect(() => {
    apiClient
      .get('https://www.googleapis.com/oauth2/v2/userinfo')
      .then((response) => {
        if (response.data.picture) {
          setProfileImage(response.data.picture)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <aside className={styles.container}>
      <img
        src={profileImage}
        className={styles.profileImage}
        alt="Profile"
      />
      <div className={styles.navItems}>
        <SidebarButton title="Player" to="/player" icon={<FaPlay />} />
        <SidebarButton title="Library" to="/" icon={<IoLibrary />} />
      </div>
      <SidebarButton
        title="Sign Out"
        to=""
        icon={<FaSignOutAlt />}
        onClick={onLogout}
      />
    </aside>
  )
}
