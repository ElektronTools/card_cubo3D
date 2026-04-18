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
      
      <div className="relative flex-1 overflow-hidden rounded-b-[1.8rem] sm:rounded-b-[2rem] p-2 sm:p-4">
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
          className="relative z-30 mx-auto block mt-2 touch-manipulation rounded-full border border-rose-200 bg-transparent px-4 py-2 text-xs font-semibold text-rose-500 transition hover:border-rose-300 hover:bg-transparent sm:mt-4 sm:px-5 sm:py-3 sm:text-sm sm:w-auto"
         >
          ← Volver al inicio
        </button>
      </div>
    </div>
  )
}
