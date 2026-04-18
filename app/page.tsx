'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import AcceptScreen from '@/components/AcceptScreen'
import GiftScreen from '@/components/GiftScreen'
import IntroScreen from '@/components/IntroScreen'
import SplashScreen from '@/components/SplashScreen'

// ─── Tipos que GiftScreen espera ─────────────────────────────────────────────
// Memory debe tener: title, description, accent, emoji
// promises debe ser: string[]

const memories = [
  {
    title: 'La primera vez',
    description: 'Cuando te vi por primera vez y supe que eras especial…',
    accent: '#e07090',
    emoji: '✨',
  },
  {
    title: 'Nuestra risa',
    description: 'Ese día que nos reímos sin parar de nada y de todo…',
    accent: '#b060d0',
    emoji: '🌸',
  },
  {
    title: 'Lo que sentí',
    description: 'El momento exacto en que supe que te quería de verdad.',
    accent: '#d94f7a',
    emoji: '💖',
  },
]

const promises: string[] = [
  'Siempre estar contigo cuando me necesites.',
  'Hacerte reír todos los días sin excepción.',
  'Cuidarte con todo lo que tengo y soy.',
]
// ─────────────────────────────────────────────────────────────────────────────

const HEARTS = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 17) % 100}%`,
  delay: `${i * 0.45}s`,
  duration: `${10 + (i % 5)}s`,
  symbol: i % 3 === 0 ? '❤' : i % 3 === 1 ? '✦' : '❀',
}))

export default function Page() {
  const [splashDone, setSplashDone] = useState(false)
  const [stage, setStage] = useState<'intro' | 'accepted' | 'gift'>('intro')
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)

  // ── Audio: metadata y eventos ────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const syncMetadata = () => setDuration(audio.duration || 0)
    const syncTime     = () => setCurrentTime(audio.currentTime)
    const handleEnded  = () => setIsPlaying(false)
    audio.addEventListener('loadedmetadata', syncMetadata)
    audio.addEventListener('timeupdate',     syncTime)
    audio.addEventListener('ended',          handleEnded)
    return () => {
      audio.removeEventListener('loadedmetadata', syncMetadata)
      audio.removeEventListener('timeupdate',     syncTime)
      audio.removeEventListener('ended',          handleEnded)
    }
  }, [])

  // ── Autoplay + desbloqueo en primer toque ────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    let unlocked = false
    const tryPlay = async () => {
      if (unlocked) return
      try {
        await audio.play()
        unlocked = true
        setIsPlaying(true)
        setAutoplayBlocked(false)
        window.removeEventListener('pointerdown', tryPlay)
        window.removeEventListener('keydown',     tryPlay)
      } catch {
        setAutoplayBlocked(true)
      }
    }
    void tryPlay()
    window.addEventListener('pointerdown', tryPlay, { passive: true })
    window.addEventListener('keydown',     tryPlay)
    return () => {
      window.removeEventListener('pointerdown', tryPlay)
      window.removeEventListener('keydown',     tryPlay)
    }
  }, [])

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      try {
        await audio.play()
        setIsPlaying(true)
        setAutoplayBlocked(false)
      } catch {
        setAutoplayBlocked(true)
      }
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }, [])

  const seekPlayback = useCallback((nextTime: number) => {
    const audio = audioRef.current
    setCurrentTime(nextTime)
    if (audio) audio.currentTime = nextTime
  }, [])

  // ── onDone estable para SplashScreen ────────────────────────────────────
  const handleSplashDone = useCallback(() => setSplashDone(true), [])

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[url('/img/fondo.jpeg')] bg-cover bg-center bg-fixed text-slate-900">

      {/* Audio global */}
      <audio ref={audioRef} preload="auto" src="/music/risa.mp3" />

      {/* Splash encima de todo — no bloquea el render del contenido */}
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}

      {/* Corazones flotantes decorativos */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        {HEARTS.map((h, i) => (
          <span
            key={i}
            className="floating-heart absolute text-xl text-rose-300/70"
            style={{
              left:              h.left,
              animationDelay:    h.delay,
              animationDuration: h.duration,
            }}
          >
            {h.symbol}
          </span>
        ))}
      </div>

      {/* Overlay de luz */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.35),transparent_40%,rgba(255,255,255,0.18))]" />

      {/* Contenido — SIEMPRE renderizado; el splash va encima con z-index */}
      <section className="relative z-10 flex min-h-[100dvh] items-center justify-center px-3 py-6 sm:px-6 sm:py-10">
        {stage === 'intro' && (
          <IntroScreen onYes={() => setStage('accepted')} />
        )}
        {stage === 'accepted' && (
          <AcceptScreen onNext={() => setStage('gift')} />
        )}
        {stage === 'gift' && (
          <GiftScreen
            autoplayBlocked={autoplayBlocked}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            memories={memories}
            onSeek={seekPlayback}
            onTogglePlayback={togglePlayback}
            promises={promises}
            onReturn={() => setStage('intro')}
          />
        )}
      </section>
    </main>
  )
}
