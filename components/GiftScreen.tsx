'use client'

import { useState, useRef } from 'react'
import Cube3D from '@/components/Cube3D'
import MusicPlayer from '@/components/MusicPlayer'

type Memory = {
  title: string
  description: string
  accent: string
  emoji: string
}

type FloatingHeart = {
  id: number
  left: number
}

export default function GiftScreen({
  autoplayBlocked,
  currentTime,
  duration,
  isPlaying,
  memories,
  onSeek,
  onTogglePlayback,
  promises,
  onReturn,
}: {
  autoplayBlocked: boolean
  currentTime: number
  duration: number
  isPlaying: boolean
  memories: Memory[]
  onSeek: (nextTime: number) => void
  onTogglePlayback: () => Promise<void>
  promises: string[]
  onReturn: () => void
}) {
  const [selectedMemory, setSelectedMemory] = useState(0)
  const [openLetter, setOpenLetter] = useState(false)
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([])
  const heartCounterRef = useRef(0)

  const createFloatingHearts = () => {
    const newHearts: FloatingHeart[] = []
    for (let i = 0; i < 15; i++) {
      newHearts.push({
        id: heartCounterRef.current++,
        left: Math.random() * 100,
      })
    }
    setFloatingHearts((prev) => [...prev, ...newHearts])

    newHearts.forEach((heart) => {
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== heart.id))
      }, 3000)
    })
  }

  const handlePlayClick = async () => {
    createFloatingHearts()
    await onTogglePlayback()
  }

  return (
    <div className="relative w-full h-full min-h-[100dvh] flex flex-col">
      {floatingHearts.map((heart) => (
        <span
          key={heart.id}
          className="floating-heart-up fixed text-2xl text-rose-300/70 sm:text-3xl"
          style={{
            left: `${heart.left}%`,
            bottom: '0',
          }}
        >
          ❤
        </span>
      ))}
      
      <div className="relative flex-1 overflow-hidden rounded-b-[1.8rem] sm:rounded-b-[2rem] p-2 sm:p-4 flex flex-col items-center justify-center gap-4 sm:gap-6">
        <h2 className="text-center text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] drop-shadow-[0_0_20px_rgba(255,192,203,0.5)] tracking-wide letter-spacing-2">
          With love for Adriana
        </h2>
        <div className="relative h-full w-full flex items-center justify-center">
          <Cube3D />
        </div>
      </div>

      <div className="w-full px-2 py-2 sm:px-6 sm:py-6">
        <MusicPlayer
          autoplayBlocked={autoplayBlocked}
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          onSeek={onSeek}
          onTogglePlayback={handlePlayClick}
        />
        <button
          type="button"
          onPointerUp={onReturn}
          className="relative z-30 mx-auto block mt-2 touch-manipulation rounded-full border-2 border-white bg-white/30 backdrop-blur-sm px-4 py-2 text-xs font-bold text-white transition hover:bg-white/40 hover:border-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] sm:mt-4 sm:px-5 sm:py-3 sm:text-sm sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
         >
          ← Volver al inicio
        </button>
      </div>

      <footer className="w-full py-3 sm:py-4 text-center">
        <p className="text-white/80 text-xs sm:text-sm font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">Made with 💖 by devLAAT🚀</p>
      </footer>
    </div>
  )
}
