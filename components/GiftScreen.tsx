'use client'

import { useState, useRef, useEffect } from 'react'
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
  size: number
  delay: number
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
  const [mounted, setMounted] = useState(false)
  const heartCounterRef = useRef(0)
  const starsRef = useRef<{ left: number; top: number; size: number; dur: number; delay: number; op: number }[]>([])

  useEffect(() => {
    starsRef.current = Array.from({ length: 60 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 1.8 + 0.8,
      dur: 2 + Math.random() * 4,
      delay: Math.random() * 5,
      op: 0.4 + Math.random() * 0.6,
    }))
    setMounted(true)
  }, [])

  const createFloatingHearts = () => {
    const newHearts: FloatingHeart[] = Array.from({ length: 18 }, (_, i) => ({
      id: heartCounterRef.current++,
      left: Math.random() * 90 + 5,
      size: 14 + Math.random() * 14,
      delay: i * 60,
    }))
    setFloatingHearts((prev) => [...prev, ...newHearts])
    newHearts.forEach((heart) => {
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== heart.id))
      }, 3500 + heart.delay)
    })
  }

  const handlePlayClick = async () => {
    createFloatingHearts()
    await onTogglePlayback()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Lato:wght@300;400&display=swap');

        .gs-root {
          position: relative;
          width: 100%;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: rgba(8, 4, 16, 0.35);
        }

        /* ── Fondo con orbes de luz ── */
        .gs-orb {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .gs-orb-1 {
          width: 420px; height: 420px;
          top: -140px; left: -140px;
          background: radial-gradient(circle, rgba(210,70,110,0.22) 0%, transparent 70%);
          animation: orb-pulse 5s ease-in-out infinite alternate;
        }
        .gs-orb-2 {
          width: 360px; height: 360px;
          bottom: -100px; right: -100px;
          background: radial-gradient(circle, rgba(110,50,190,0.2) 0%, transparent 70%);
          animation: orb-pulse 6s ease-in-out infinite alternate-reverse;
        }
        .gs-orb-3 {
          width: 260px; height: 260px;
          top: 38%; left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(255,160,80,0.07) 0%, transparent 70%);
          animation: orb-pulse 4s ease-in-out infinite alternate;
        }
        @keyframes orb-pulse {
          from { opacity: 0.5; transform: scale(1); }
          to { opacity: 1; transform: scale(1.2); }
        }
        .gs-orb-3 { animation-name: orb-pulse-center; }
        @keyframes orb-pulse-center {
          from { opacity: 0.5; transform: translate(-50%,-50%) scale(1); }
          to { opacity: 1; transform: translate(-50%,-50%) scale(1.2); }
        }

        /* ── Estrellas ── */
        .gs-star {
          position: fixed;
          background: white;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          animation: star-twinkle var(--dur) ease-in-out infinite var(--dly);
          opacity: 0;
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: var(--op); }
        }

        /* ── Corazones flotantes ── */
        .gs-heart {
          position: fixed;
          bottom: 80px;
          color: rgba(255,130,155,0.7);
          pointer-events: none;
          z-index: 99;
          animation: heart-rise 3.2s ease-out forwards;
          animation-delay: var(--hd);
          opacity: 0;
        }
        @keyframes heart-rise {
          0%   { opacity: 0;   transform: translateY(0)   scale(0.6) rotate(-10deg); }
          15%  { opacity: 0.9; transform: translateY(-30px) scale(1)   rotate(5deg); }
          80%  { opacity: 0.6; transform: translateY(-180px) scale(0.8) rotate(-5deg); }
          100% { opacity: 0;   transform: translateY(-240px) scale(0.5) rotate(10deg); }
        }

        /* ── Contenido principal ── */
        .gs-main {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem 1rem;
          gap: 1rem;
        }

        /* ── Badge ── */
        .gs-badge {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 10px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: rgba(255,185,170,0.65);
          border: 0.5px solid rgba(220,110,130,0.3);
          padding: 5px 20px;
          border-radius: 100px;
          background: rgba(210,70,110,0.08);
          animation: fade-up 1s ease both 0.2s;
        }

        /* ── Título ── */
        .gs-title-block {
          text-align: center;
          animation: fade-up 1s ease both 0.5s;
        }
        .gs-subtitle-text {
          display: block;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(13px, 3vw, 17px);
          letter-spacing: 4px;
          color: rgba(255,200,185,0.6);
          margin-bottom: 6px;
        }
        .gs-name-text {
          display: block;
          font-family: 'Cinzel', serif;
          font-weight: 600;
          font-size: clamp(36px, 9vw, 62px);
          letter-spacing: 4px;
          line-height: 1.05;
          background: linear-gradient(135deg, #fcd5db 0%, #ffecd2 38%, #f8a5c2 68%, #dbb8e8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: glow-name 3.5s ease-in-out infinite alternate;
        }
        @keyframes glow-name {
          from { filter: drop-shadow(0 0 16px rgba(255,140,170,0.45)); }
          to   { filter: drop-shadow(0 0 44px rgba(255,170,200,0.85)); }
        }

        /* ── Divisor ── */
        .gs-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          animation: fade-up 1s ease both 0.7s;
        }
        .gs-divider-line {
          width: 55px;
          height: 0.5px;
          background: linear-gradient(90deg, transparent, rgba(255,160,160,0.45));
        }
        .gs-divider-line.right {
          background: linear-gradient(90deg, rgba(255,160,160,0.45), transparent);
        }
        .gs-divider-icon {
          font-size: 12px;
          color: rgba(255,140,160,0.7);
          animation: heartbeat 1.7s ease-in-out infinite;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25%  { transform: scale(1.45); }
          50%  { transform: scale(1); }
          75%  { transform: scale(1.2); }
        }

        /* ── Zona del cubo ── */
        .gs-cube-wrap {
          position: relative;
          width: 100%;
          flex: 1;
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fade-up 1s ease both 0.9s;
        }
        .gs-ring {
          position: absolute;
          border-radius: 50%;
          border: 0.5px solid rgba(255,150,180,0.12);
          animation: ring-breathe 3.5s ease-in-out infinite;
          pointer-events: none;
        }
        .gs-ring-1 { width: 170px; height: 170px; }
        .gs-ring-2 { width: 220px; height: 220px; animation-delay: 1.2s; border-color: rgba(170,100,210,0.09); }
        .gs-ring-3 { width: 270px; height: 270px; animation-delay: 2.4s; border-color: rgba(255,150,180,0.06); }
        @keyframes ring-breathe {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%  { opacity: 0.9; transform: scale(1.06); }
        }

        /* ── Panel inferior ── */
        .gs-bottom {
          position: relative;
          z-index: 2;
          padding: 0 1rem 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          animation: fade-up 1s ease both 1.1s;
        }

        /* ── Music player card ── */
        .gs-player-card {
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,160,180,0.18);
          border-radius: 18px;
          padding: 0;
          backdrop-filter: blur(16px);
          overflow: hidden;
        }

        /* ── Botón volver ── */
        .gs-return-btn {
          display: block;
          width: fit-content;
          margin: 0 auto;
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,200,190,0.65);
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,160,180,0.18);
          padding: 9px 24px;
          border-radius: 100px;
          cursor: pointer;
          transition: background 0.3s, color 0.3s, border-color 0.3s, transform 0.2s;
          backdrop-filter: blur(8px);
        }
        .gs-return-btn:hover {
          background: rgba(210,70,110,0.15);
          color: rgba(255,225,215,0.95);
          border-color: rgba(210,90,130,0.45);
          transform: translateY(-1px);
        }
        .gs-return-btn:active { transform: scale(0.97); }

        /* ── Footer ── */
        .gs-footer {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 0.4rem 1rem 1rem;
        }
        .gs-footer p {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 12px;
          letter-spacing: 2px;
          color: rgba(255,175,160,0.35);
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ── */
        @media (min-width: 640px) {
          .gs-main { padding: 3rem 2rem 1.2rem; gap: 1.2rem; }
          .gs-bottom { padding: 0 1.5rem 1rem; gap: 0.8rem; }
        }
      `}</style>

      <div className="gs-root">
        {/* Orbes de fondo */}
        <div className="gs-orb gs-orb-1" />
        <div className="gs-orb gs-orb-2" />
        <div className="gs-orb gs-orb-3" />

        {/* Estrellas */}
        {mounted && starsRef.current.map((s, i) => (
          <div
            key={i}
            className="gs-star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              ['--dur' as string]: `${s.dur}s`,
              ['--dly' as string]: `${s.delay}s`,
              ['--op' as string]: s.op,
            }}
          />
        ))}

        {/* Corazones flotantes */}
        {floatingHearts.map((heart) => (
          <span
            key={heart.id}
            className="gs-heart"
            style={{
              left: `${heart.left}%`,
              fontSize: `${heart.size}px`,
              ['--hd' as string]: `${heart.delay}ms`,
            }}
          >
            ♥
          </span>
        ))}

        {/* Contenido principal */}
        <div className="gs-main">

          <div className="gs-title-block">
            <span className="gs-subtitle-text">with love for</span>
            <span className="gs-name-text">Adriana</span>
          </div>

          <div className="gs-divider">
            <div className="gs-divider-line" />
            <span className="gs-divider-icon">♥</span>
            <div className="gs-divider-line right" />
          </div>

          <div className="gs-cube-wrap">
            <div className="gs-ring gs-ring-1" />
            <div className="gs-ring gs-ring-2" />
            <div className="gs-ring gs-ring-3" />
            <Cube3D />
          </div>
        </div>

        {/* Panel inferior */}
        <div className="gs-bottom">
          <div className="gs-player-card">
            <MusicPlayer
              autoplayBlocked={autoplayBlocked}
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              onSeek={onSeek}
              onTogglePlayback={handlePlayClick}
            />
          </div>

          <button
            type="button"
            onPointerUp={onReturn}
            className="gs-return-btn"
          >
            ← Volver al inicio
          </button>
        </div>

        <footer className="gs-footer">
          <p>by devLAAT 🚀</p>
        </footer>
      </div>
    </>
  )
}
