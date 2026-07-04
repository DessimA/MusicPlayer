import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import useAuth from '../../hooks/useAuth'
import Login from '../Login/Login'
import Sidebar from '../../components/Sidebar/Sidebar'
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation'
import Modal from '../../components/ui/Modal/Modal'
import Footer from '../../components/Footer/Footer'
import Library from '../Library/Library'
import Player from '../Player/Player'
import styles from './Home.module.css'

export default function Home() {
  const { accessToken, authError, login, logout } = useAuth()
  const [infoOpen, setInfoOpen] = useState(true)

  if (!accessToken) {
    return <Login onLogin={login} errorMessage={authError} />
  }

  return (
    <Router>
      <div className={styles.mainBody}>
        <Sidebar onLogout={logout} onInfo={() => setInfoOpen(true)} />
        <div className={styles.contentColumn}>
          <main className={styles.content}>
            <Routes>
              <Route path="/" element={<Library />} />
              <Route path="/player" element={<Player />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <BottomNavigation onLogout={logout} onInfo={() => setInfoOpen(true)} />
      </div>

      <Modal open={infoOpen} onClose={() => setInfoOpen(false)} title="About MusicPlayer">
        <p>
          MusicPlayer is an open-source web application that transforms your YouTube
          playlists into a seamless music listening experience.
        </p>
        <h3>How it works</h3>
        <ul>
          <li>Sign in with your Google account (OAuth PKCE).</li>
          <li>Browse your YouTube playlists in the Library.</li>
          <li>Select a playlist and enjoy full audio playback.</li>
          <li>Minimize the video to save screen space while music continues.</li>
          <li>Search within your playlist to find tracks quickly.</li>
        </ul>
        <h3>Features</h3>
        <ul>
          <li>Full audio playback via YouTube IFrame Player API.</li>
          <li>Video minimize with background audio.</li>
          <li>Searchable queue.</li>
          <li>Responsive design for desktop and mobile.</li>
          <li>Docker support for development and production.</li>
        </ul>
        <h3>Technologies</h3>
        <p>React · Vite · CSS Modules · YouTube Data API v3 · Google OAuth PKCE · Docker</p>
        <div className={styles.modalLinks}>
          <a href="https://github.com/DessimA" target="_blank" rel="noopener noreferrer">
            <FaGithub size={18} /> GitHub
          </a>
          <a href="https://linkedin.com/in/dessima" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={18} /> LinkedIn
          </a>
        </div>
      </Modal>
    </Router>
  )
}
