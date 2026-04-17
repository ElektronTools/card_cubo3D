'use client'

import { useEffect, useRef, useState } from 'react'
import AcceptScreen from '@/components/AcceptScreen'
import GiftScreen from '@/components/GiftScreen'
import IntroScreen from '@/components/IntroScreen'

const memories = [
  {
    title: 'Tu sonrisa favorita',
    description: 'La que me desarma en segundos y me arregla cualquier dia sin pedir permiso.',
    accent: 'from-rose-300 via-pink-200 to-orange-100',
    emoji: '✨',
  },
  {
    title: 'Nuestra vibra',
    description: 'Esa forma tan bonita de reir, hablar y sentir que todo se vuelve mas ligero contigo.',
    accent: 'from-fuchsia-300 via-pink-200 to-amber-100',
    emoji: '💞',
  },
  {
    title: 'Lo que imagino',
    description: 'Mas canciones, mas abrazos, mas salidas sencillas y mas recuerdos que solo tengan sentido para nosotros.',
    accent: 'from-orange-200 via-rose-100 to-pink-200',
    emoji: '🌙',
  },
]

const promises = [
  'Escucharte con calma, incluso en los dias raros.',
  'Hacerte sentir querida en los detalles pequenos.',
  'Seguir buscando formas nuevas de sacarte una sonrisa.',
  'Cuidar lo nuestro con ternura, paciencia y verdad.',
]

export default function Page() {
  const [stage, setStage] = useState<'intro' | 'accepted' | 'gift'>('intro')
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    const syncMetadata = () => setDuration(audio.duration || 0)
    const syncTime = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('loadedmetadata', syncMetadata)
    audio.addEventListener('timeupdate', syncTime)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', syncMetadata)
      audio.removeEventListener('timeupdate', syncTime)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    const tryAutoplay = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
        setAutoplayBlocked(false)
      } catch {
        setIsPlaying(false)
        setAutoplayBlocked(true)
      }
    }

    const unlockAudio = () => {
      void tryAutoplay()
    }

    void tryAutoplay()

    window.addEventListener('pointerdown', unlockAudio, { passive: true })
    window.addEventListener('touchstart', unlockAudio, { passive: true })
    window.addEventListener('keydown', unlockAudio)

    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('touchstart', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
  }, [])

  const togglePlayback = async () => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (audio.paused) {
      try {
        await audio.play()
        setIsPlaying(true)
        setAutoplayBlocked(false)
      } catch {
        setIsPlaying(false)
        setAutoplayBlocked(true)
      }

      return
    }

    audio.pause()
    setIsPlaying(false)
  }

  const seekPlayback = (nextTime: number) => {
    const audio = audioRef.current

    setCurrentTime(nextTime)

    if (audio) {
      audio.currentTime = nextTime
    }
  }

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(255,228,236,0.88)_35%,_rgba(255,214,224,0.76)_62%,_rgba(168,85,247,0.18)_100%)] text-slate-900">
      <audio ref={audioRef} preload="auto" src="/music/risa.mp3" />

      <div className="pointer-events-none absolute inset-0 opacity-80">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className="floating-heart absolute text-xl text-rose-300/70"
            style={{
              left: `${(index * 17) % 100}%`,
              animationDelay: `${index * 0.45}s`,
              animationDuration: `${10 + (index % 5)}s`,
            }}
          >
            {index % 3 === 0 ? '❤' : index % 3 === 1 ? '✦' : '❀'}
          </span>
        ))}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.35),transparent_40%,rgba(255,255,255,0.18))]" />

      <section className="relative z-10 flex min-h-[100dvh] items-center justify-center px-3 py-6 sm:px-6 sm:py-10">
        {stage === 'intro' && <IntroScreen onYes={() => setStage('accepted')} />}
        {stage === 'accepted' && <AcceptScreen onNext={() => setStage('gift')} />}
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
