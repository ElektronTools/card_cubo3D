'use client'

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import Image from 'next/image'

const faces = [
  { src: '/img/image1.png', alt: 'Recuerdo 1', label: 'Pure love' },
  { src: '/img/image2.jpg', alt: 'Recuerdo 2', label: 'Lukass' },
  { src: '/img/image3.jpg', alt: 'Recuerdo 3', label: 'Thorfinn' },
  { src: '/img/image4.jpg', alt: 'Recuerdo 4', label: 'Cloti' },
  { src: '/img/image5.jpg', alt: 'Recuerdo 5', label: 'Las wawas' },
  { src: '/img/image6.jpg', alt: 'Recuerdo 6', label: 'Con el Luu💖' },
]

const getImageUrl = (src: string) => {
  const timestamp = new Date().toISOString().split('T')[0]
  return `${src}?t=${timestamp}`
}

const AUTO_SPEED       = 0.0225   // grados/ms en auto-rotación
const DRAG_SPEED       = 0.4      // sensibilidad al arrastrar
const FRICTION         = 0.93     // factor de desaceleración por frame (0-1)
const MIN_VELOCITY     = 0.01     // velocidad mínima antes de considerar "parado"
const X_LIMIT          = 35       // límite de inclinación vertical en grados

export default function Cube3D() {
  const cubeRef          = useRef<HTMLDivElement>(null)
  const frameRef         = useRef<number | null>(null)
  const lastTimeRef      = useRef<number | null>(null)
  const rotXRef          = useRef(-18)
  const rotYRef          = useRef(0)
  const velXRef          = useRef(0)   // velocidad de inercia vertical
  const velYRef          = useRef(0)   // velocidad de inercia horizontal
  const isDraggingRef    = useRef(false)
  const pointerIdRef     = useRef<number | null>(null)
  const lastPosRef       = useRef({ x: 0, y: 0 })
  const lastDeltaRef     = useRef({ x: 0, y: 0 })  // último delta para inercia
  const lastMoveTimeRef  = useRef(0)

  const [isDragging, setIsDragging]   = useState(false)
  const [glowActive, setGlowActive]   = useState(false)

  const syncRotation = () => {
    if (!cubeRef.current) return
    cubeRef.current.style.transform =
      `rotateX(${rotXRef.current}deg) rotateY(${rotYRef.current}deg)`
  }

  useEffect(() => {
    syncRotation()

    const animate = (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time
      const delta = time - lastTimeRef.current
      lastTimeRef.current = time

      if (isDraggingRef.current) {
        // mientras arrastra no hacemos nada en el loop
      } else {
        const hasInertia =
          Math.abs(velYRef.current) > MIN_VELOCITY ||
          Math.abs(velXRef.current) > MIN_VELOCITY

        if (hasInertia) {
          // aplicar inercia + fricción
          rotYRef.current += velYRef.current
          rotXRef.current -= velXRef.current
          // clamp inclinación
          rotXRef.current = Math.max(-X_LIMIT, Math.min(X_LIMIT, rotXRef.current))
          velYRef.current *= FRICTION
          velXRef.current *= FRICTION
          // apagar si demasiado lento
          if (Math.abs(velYRef.current) < MIN_VELOCITY) velYRef.current = 0
          if (Math.abs(velXRef.current) < MIN_VELOCITY) velXRef.current = 0
        } else {
          // auto-rotación suave
          rotYRef.current += delta * AUTO_SPEED
        }
        syncRotation()
      }

      frameRef.current = window.requestAnimationFrame(animate)
    }

    frameRef.current = window.requestAnimationFrame(animate)
    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointerIdRef.current   = e.pointerId
    lastPosRef.current     = { x: e.clientX, y: e.clientY }
    lastDeltaRef.current   = { x: 0, y: 0 }
    isDraggingRef.current  = true
    velXRef.current        = 0
    velYRef.current        = 0
    lastTimeRef.current    = null
    setIsDragging(true)
    setGlowActive(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || pointerIdRef.current !== e.pointerId) return

    const dx = e.clientX - lastPosRef.current.x
    const dy = e.clientY - lastPosRef.current.y

    lastPosRef.current   = { x: e.clientX, y: e.clientY }
    lastDeltaRef.current = { x: dx, y: dy }
    lastMoveTimeRef.current = performance.now()

    rotYRef.current += dx * DRAG_SPEED
    rotXRef.current -= dy * DRAG_SPEED
    rotXRef.current = Math.max(-X_LIMIT, Math.min(X_LIMIT, rotXRef.current))
    syncRotation()
  }

  const stopDragging = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }

    // sólo transferir inercia si el último movimiento fue reciente (<120ms)
    const timeSinceMove = performance.now() - lastMoveTimeRef.current
    if (timeSinceMove < 120) {
      velYRef.current = lastDeltaRef.current.x * DRAG_SPEED * 0.6
      velXRef.current = lastDeltaRef.current.y * DRAG_SPEED * 0.6
    }

    pointerIdRef.current  = null
    isDraggingRef.current = false
    lastTimeRef.current   = null
    setIsDragging(false)

    // apagar glow después de un momento
    setTimeout(() => setGlowActive(false), 600)
  }

  return (
    <>
      <style>{`
        .cube3d-wrapper {
          perspective: 1200px;
          width: 220px;
          height: 220px;
          cursor: grab;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          position: relative;
        }

        @media (max-width: 640px) {
          .cube3d-wrapper { width: 250px; height: 250px; }
        }

        .cube3d-wrapper.dragging {
          cursor: grabbing;
        }

        /* Anillo de glow que aparece al tocar */
        .cube3d-glow-ring {
          position: absolute;
          inset: -18px;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 140, 180, 0);
          pointer-events: none;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
          z-index: 10;
        }
        .cube3d-glow-ring.active {
          border-color: rgba(255, 140, 180, 0.35);
          box-shadow: 0 0 32px rgba(210, 80, 130, 0.25), inset 0 0 24px rgba(210, 80, 130, 0.1);
          transform: scale(1.04);
        }

        /* Hint de arrastre */
        .cube3d-hint {
          position: absolute;
          bottom: -26px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255, 185, 170, 0.45);
          white-space: nowrap;
          pointer-events: none;
          transition: opacity 0.4s;
          animation: cube-hint-pulse 2.5s ease-in-out infinite;
        }
        .cube3d-hint.hidden { opacity: 0; }

        @keyframes cube-hint-pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.75; }
        }

        .cube3d-container {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          will-change: transform;
          transition: filter 0.3s;
        }
        .cube3d-wrapper.dragging .cube3d-container {
          filter: drop-shadow(0 24px 48px rgba(244, 114, 182, 0.28));
        }

        /* Caras */
        .cube3d-face {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 220px;
          height: 220px;
          border: 1px solid rgba(255, 255, 255, 0.45);
          border-radius: 1.75rem;
          padding: 0;
          backface-visibility: hidden;
          overflow: hidden;
          transition: border-color 0.3s;
        }
        .cube3d-wrapper.dragging .cube3d-face {
          border-color: rgba(255, 160, 180, 0.6);
        }

        @media (max-width: 640px) {
          .cube3d-face { width: 250px; height: 250px; border-radius: 1.5rem; font-size: 0.7rem; }
        }

        .cube3d-face-1 { transform: translateZ(110px); }
        .cube3d-face-2 { transform: rotateY(180deg) translateZ(110px); }
        .cube3d-face-3 { transform: rotateY(-90deg) translateZ(110px); }
        .cube3d-face-4 { transform: rotateY(90deg)  translateZ(110px); }
        .cube3d-face-5 { transform: rotateX(90deg)  translateZ(110px); }
        .cube3d-face-6 { transform: rotateX(-90deg) translateZ(110px); }

        @media (max-width: 640px) {
          .cube3d-face-1 { transform: translateZ(125px); }
          .cube3d-face-2 { transform: rotateY(180deg) translateZ(125px); }
          .cube3d-face-3 { transform: rotateY(-90deg) translateZ(125px); }
          .cube3d-face-4 { transform: rotateY(90deg)  translateZ(125px); }
          .cube3d-face-5 { transform: rotateX(90deg)  translateZ(125px); }
          .cube3d-face-6 { transform: rotateX(-90deg) translateZ(125px); }
        }

        /* Label de cara */
        .cube3d-label {
          position: absolute;
          bottom: 10px;
          left: 10px;
          right: 10px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 6px 12px;
          text-align: center;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: white;
          border: 0.5px solid rgba(255,255,255,0.25);
          transition: background 0.3s;
        }
        .cube3d-wrapper.dragging .cube3d-label {
          background: rgba(210, 80, 130, 0.22);
        }

        .cube3d-gradient {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(180deg, transparent 28%, rgba(15,23,42,0.1) 55%, rgba(15,23,42,0.62) 100%);
          pointer-events: none;
        }
      `}</style>

      <div className="mx-auto flex flex-col items-center justify-center gap-3 py-6">
        <div
          className={`cube3d-wrapper ${isDragging ? 'dragging' : ''}`}
          onPointerCancel={stopDragging}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
        >
          {/* Anillo de glow */}
          <div className={`cube3d-glow-ring ${glowActive ? 'active' : ''}`} />

          {/* Hint */}
          <div className={`cube3d-hint ${isDragging ? 'hidden' : ''}`}>
            arrastra · gira
          </div>

          <div ref={cubeRef} className="cube3d-container">
            {faces.map((face, index) => (
              <div key={face.src} className={`cube3d-face cube3d-face-${index + 1}`}>
                <Image
                  src={getImageUrl(face.src)}
                  alt={face.alt}
                  fill
                  sizes="(max-width: 640px) 250px, 220px"
                  className="rounded-[inherit] object-cover"
                  unoptimized
                />
                <div className="cube3d-gradient" />
                <span className="cube3d-label">{face.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
