import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Login from '../Login/Login'
import Sidebar from '../../components/Sidebar/Sidebar'
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation'
import Library from '../Library/Library'
import Player from '../Player/Player'
import styles from './Home.module.css'

export default function Home() {
  const { accessToken, authError, login, logout } = useAuth()

  if (!accessToken) {
    return <Login onLogin={login} errorMessage={authError} />
  }

  return (
    <Router>
      <div className={styles.mainBody}>
        <Sidebar onLogout={logout} />
        <main className={styles.content}>
          <Routes>
            <Route path="/" element={<Library />} />
            <Route path="/player" element={<Player />} />
          </Routes>
        </main>
        <BottomNavigation onLogout={logout} />
      </div>
    </Router>
  )
}
