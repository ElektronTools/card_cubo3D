'use client'

import { useState } from 'react'

const buttonOffsets = [
  '',
  'sm:translate-x-10 sm:-translate-y-2',
  'sm:-translate-x-8 sm:translate-y-3',
  'sm:translate-x-12 sm:translate-y-6',
  'sm:-translate-x-12 sm:-translate-y-4',
]

const playfulMessages = [
  'Prometo hacer esta historia muy bonita.',
  'Ese boton se puso nervioso.',
  'Creo que el universo ya eligio su respuesta.',
  'Miralo bien... quiere que digas que si.',
  'Te juro que vale la pena intentarlo juntos.',
]

const noLabels = ['No', 'Segura?', 'Piensalo', 'Ay no', 'Mejor si']

export default function IntroScreen({ onYes }: { onYes: () => void }) {
  const [teaseLevel, setTeaseLevel] = useState(0)

  const advanceNoButton = () => {
    setTeaseLevel((current) => (current + 1) % buttonOffsets.length)
  }

  return (
    <div className="mx-auto glass-panel w-full max-w-5xl overflow-hidden rounded-[1.75rem] p-4 shadow-[0_30px_100px_rgba(126,34,79,0.25)] sm:rounded-[2rem] sm:p-8 lg:p-10">
      <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 text-center lg:text-left">
          <div className="space-y-4">
            <h1 className="text-balance text-[2rem] font-semibold leading-tight sm:text-5xl lg:text-6xl">
              ¿Quieres ser mi novia?            </h1>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4 lg:justify-start">
            <button
              type="button"
              onPointerUp={onYes}
              className="relative z-30 w-full touch-manipulation rounded-full bg-[linear-gradient(135deg,#e11d48,#fb7185,#f59e0b)] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_45px_rgba(225,29,72,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(225,29,72,0.42)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-300/60 sm:w-auto sm:px-8 sm:text-lg"
            >
              Si
            </button>

            <button
              type="button"
              onMouseEnter={advanceNoButton}
              onClick={advanceNoButton}
              className={`relative z-30 w-full touch-manipulation rounded-full border border-rose-200 bg-white/80 px-6 py-4 text-sm font-medium text-rose-500 shadow-sm transition duration-300 hover:border-rose-300 hover:bg-white sm:w-auto sm:px-7 sm:text-base ${buttonOffsets[teaseLevel]} focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200`}
            >
              {noLabels[teaseLevel]}
            </button>
          </div>

          <p className="min-h-7 text-xs font-medium uppercase tracking-[0.14em] text-rose-500 sm:text-sm sm:tracking-[0.16em]">
            {playfulMessages[teaseLevel]}
          </p>
        </div>
      </div>
    </div>
  )
}
