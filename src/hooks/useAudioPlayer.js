import { useState, useEffect, useRef, useCallback } from 'react'

let apiLoadPromise = null

function loadYouTubeAPI() {
  if (apiLoadPromise) return apiLoadPromise
  if (window.YT?.Player) {
    apiLoadPromise = Promise.resolve()
    return apiLoadPromise
  }
  apiLoadPromise = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = resolve
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(script)
  })
  return apiLoadPromise
}

export default function useAudioPlayer(tracks, currentIndex, setCurrentIndex) {
  const playerRef = useRef(null)
  const tracksRef = useRef(tracks)
  const [isPlaying, setIsPlaying] = useState(false)
  const [trackProgress, setTrackProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [apiReady, setApiReady] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)
  const intervalRef = useRef(null)
  const hiddenIntervalRef = useRef(null)
  const wasPlayingRef = useRef(false)
  const currentTrack = tracks?.[currentIndex] || null

  useEffect(() => {
    tracksRef.current = tracks
  }, [tracks])

  useEffect(() => {
    loadYouTubeAPI().then(() => setApiReady(true))
  }, [])

  useEffect(() => {
    if (!apiReady || playerRef.current || !tracks || tracks.length === 0) return
    playerRef.current = new YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: '',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          setPlayerReady(true)
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            setIsPlaying(true)
          } else if (event.data === YT.PlayerState.PAUSED) {
            setIsPlaying(false)
          } else if (event.data === YT.PlayerState.ENDED) {
            setIsPlaying(false)
            setCurrentIndex((prev) => {
              if (tracksRef.current && prev < tracksRef.current.length - 1) {
                return prev + 1
              }
              return prev
            })
          }
        },
      },
    })
  }, [apiReady, tracks])

  useEffect(() => {
    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!playerRef.current?.loadVideoById || !currentTrack?.videoId || !playerReady) return
    setTrackProgress(0)
    setDuration(0)
    playerRef.current.loadVideoById(currentTrack.videoId)
  }, [currentIndex, currentTrack?.videoId, playerReady])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        setTrackProgress(playerRef.current.getCurrentTime())
        setDuration(playerRef.current.getDuration())
      }
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [currentIndex])

  useEffect(() => {
    wasPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'visible' && wasPlayingRef.current && playerRef.current?.playVideo) {
        playerRef.current.playVideo()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const togglePlayPause = useCallback(() => {
    if (!playerRef.current || !playerReady) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }, [isPlaying, playerReady])

  const goToNextTrack = useCallback(() => {
    if (tracks && currentIndex < tracks.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }, [currentIndex, tracks?.length])

  const goToPreviousTrack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }, [currentIndex])

  const progressPercentage = duration > 0 ? (trackProgress / duration) * 100 : 0
  const hasPreview = !!currentTrack?.videoId

  return {
    isPlaying,
    togglePlayPause,
    goToNextTrack,
    goToPreviousTrack,
    trackProgress,
    progressPercentage,
    duration,
    currentTrack,
    hasPreview,
    playerReady,
  }
}
