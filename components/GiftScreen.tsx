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
    <div className="relative w-full space-y-4 sm:space-y-6">
      {floatingHearts.map((heart) => (
        <span
          key={heart.id}
          className="floating-heart-up absolute text-2xl text-rose-300/70 sm:text-3xl"
          style={{
            left: `${heart.left}%`,
            bottom: '0',
          }}
        >
          ❤
        </span>
      ))}
      <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6">

      <div className="glass-panel rounded-[1.8rem] p-4 shadow-[0_30px_120px_rgba(126,34,79,0.22)] sm:rounded-[2.25rem] sm:p-8 lg:p-10">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.8),rgba(255,241,242,0.68))] p-4 shadow-[0_16px_70px_rgba(244,114,182,0.18)] sm:rounded-[2rem] sm:p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.65),_transparent_50%)]" />
            <div className="relative">
              <Cube3D />
            </div>
          </div>
        </div>
        
      </div>

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
        className="relative z-30 mx-auto block touch-manipulation rounded-full border border-rose-200 bg-white/80 px-5 py-3 text-sm font-semibold text-rose-500 transition hover:border-rose-300 hover:bg-white sm:w-auto"
       >
        ← Volver al inicio
      </button>
      </div>
    </div>
  )
}
