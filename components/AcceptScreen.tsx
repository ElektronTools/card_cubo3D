'use client'

import { useEffect, useRef, useState } from 'react'

type LaunchHeart = {
  id: number
  left: number
  delay: number
  scale: number
}

export default function AcceptScreen({ onNext }: { onNext: () => void }) {
  const [launchHearts, setLaunchHearts] = useState<LaunchHeart[]>([])
  const heartCounterRef = useRef(0)
  const transitionTimeoutRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current)
      }
    },
    [],
  )

  const launchFloatingHearts = () => {
    if (launchHearts.length > 0) {
      return
    }

    const nextHearts: LaunchHeart[] = Array.from({ length: 20 }, (_, index) => ({
      id: heartCounterRef.current + index,
      left: Math.random() * 100,
      delay: Math.random() * 0.55,
      scale: 0.8 + Math.random() * 0.9,
    }))

    heartCounterRef.current += nextHearts.length
    setLaunchHearts(nextHearts)

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current)
    }

    transitionTimeoutRef.current = window.setTimeout(() => {
      onNext()
      setLaunchHearts([])
    }, 850)
  }

  return (
    <div className="mx-auto glass-panel w-full max-w-4xl rounded-[1.75rem] p-4 text-center shadow-[0_30px_100px_rgba(157,23,77,0.2)] sm:rounded-[2.25rem] sm:p-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-3xl shadow-lg shadow-rose-200/50 sm:h-20 sm:w-20 sm:text-4xl">
          💖
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">Respuesta confirmada</p>
          <h2 className="text-balance text-[2rem] font-semibold leading-tight sm:text-5xl">
            Sabia que dirias que si!
          </h2>
        </div>

        <button
          type="button"
          onPointerUp={launchFloatingHearts}
          className="relative z-30 w-full touch-manipulation rounded-full bg-[linear-gradient(135deg,#be185d,#ec4899,#fb7185)] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_50px_rgba(190,24,93,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(190,24,93,0.42)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-300/60 sm:w-auto sm:px-8 sm:text-lg"
        >
          Abrir este detalle para ti
        </button>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-screen overflow-hidden">
        {launchHearts.map((heart) => (
          <span
            key={heart.id}
            className="floating-heart-up absolute text-2xl text-rose-400/80 sm:text-3xl"
            style={{
              left: `${heart.left}%`,
              bottom: '-1.5rem',
              animationDelay: `${heart.delay}s`,
              transform: `scale(${heart.scale})`,
            }}
          >
            ❤
          </span>
        ))}
      </div>
    </div>
  )
}
