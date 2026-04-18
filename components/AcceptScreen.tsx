'use client'

import { useEffect, useState } from 'react'

export default function AcceptScreen({ onNext }: { onNext: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [hearts, setHearts] = useState<any[]>([])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleCount((current) => {
        if (current >= 3) {
          window.clearInterval(interval)
          return current
        }

        return current + 1
      })
    }, 450)

    return () => window.clearInterval(interval)
  }, [])

  const moments = [
    'Celebrar cada si como si fuera un pequeño milagro.',
    'Convertir los días normales en recuerdos favoritos.',
    'Guardar este instante como el primer capítulo.',
  ]

  // Función para agregar corazones al presionar el botón
  const handleOpenDetail = () => {
    onNext()

    // Generar corazones
    const newHearts = Array.from({ length: 10 }).map((_, index) => (
      <div
        key={index}
        className="heart"
        style={{
          left: `${Math.random() * 100}vw`,
          animationDelay: `${Math.random() * 2}s`, // Random delay for each heart
        }}
      >
        ❤️
      </div>
    ))

    setHearts(newHearts)
  }

  return (
    <div className="mx-auto w-full max-w-4xl rounded-[1.75rem] p-4 text-center sm:rounded-[2.25rem] sm:p-10 bg-white/20 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-transparent text-3xl shadow-lg shadow-rose-200/50 sm:h-20 sm:w-20 sm:text-4xl">
          💖
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-500">Respuesta confirmada</p>
          <h2 className="text-balance text-[2rem] font-semibold leading-tight sm:text-5xl">
            ¡Sabía que dirías que sí!
          </h2>
        </div>

        <button
          type="button"
          onPointerUp={handleOpenDetail}
          className="relative z-30 w-full touch-manipulation rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-400 px-6 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(236,72,153,0.4),0_0_0_2px_rgba(255,255,255,0.2)_inset] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(236,72,153,0.5),0_0_0_2px_rgba(255,255,255,0.3)_inset] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/80 sm:w-auto sm:px-8 sm:text-lg"
        >
          Abrir este detalle para ti
        </button>
      </div>

      {/* Contenedor de los corazones flotantes */}
      <div id="hearts-container" className="fixed inset-0 pointer-events-none z-50">
        {hearts}
      </div>
    </div>
  )
}