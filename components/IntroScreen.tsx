'use client'

import { useState, useEffect, useRef } from 'react'

const buttonOffsets = [
  '',
  'sm:translate-x-10 sm:-translate-y-2',
  'sm:-translate-x-8 sm:translate-y-3',
  'sm:translate-x-12 sm:translate-y-6',
  'sm:-translate-x-12 sm:-translate-y-4',
]

const playfulMessages = [
  '',
  'No 💔',
  'Piénsalo otra vez 😢',
  'Ese botón se puso nervioso.',
  'Miralo bien… quiere que digas que sí.',
  'Última oportunidad 😳',
]

const noLabels = ['No', 'Segura?', 'Piénsalo', 'Ay no', 'Mejor sí']

export default function IntroScreen({ onYes }: { onYes: () => void }) {
  const [teaseLevel, setTeaseLevel] = useState(0)
  const [mounted, setMounted] = useState(false)
  const starsRef = useRef<{ left: number; top: number; size: number; dur: number; delay: number; op: number }[]>([])

  useEffect(() => {
    starsRef.current = Array.from({ length: 50 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 1.8 + 0.7,
      dur: 2 + Math.random() * 4,
      delay: Math.random() * 5,
      op: 0.3 + Math.random() * 0.6,
    }))
    setMounted(true)
  }, [])

  const advanceNoButton = () => {
    setTeaseLevel((c) => Math.min(c + 1, buttonOffsets.length - 1))
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Lato:wght@300;400&display=swap');

        .intro-root {
          position: relative;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          border-radius: 2rem;
          overflow: hidden;
          background: rgba(8, 4, 16, 0.35);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 0.5px solid rgba(255, 160, 180, 0.18);
          padding: 2.5rem 1.5rem;
        }

        @media (min-width: 640px) {
          .intro-root { padding: 3.5rem 3rem; border-radius: 2.25rem; }
        }
        @media (min-width: 1024px) {
          .intro-root { padding: 4rem 3.5rem; }
        }

        /* Orbes internos */
        .intro-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .intro-orb-1 {
          width: 300px; height: 300px;
          top: -100px; right: -80px;
          background: radial-gradient(circle, rgba(210,70,110,0.18) 0%, transparent 70%);
          animation: intro-orb-pulse 5s ease-in-out infinite alternate;
        }
        .intro-orb-2 {
          width: 220px; height: 220px;
          bottom: -80px; left: -60px;
          background: radial-gradient(circle, rgba(120,60,200,0.14) 0%, transparent 70%);
          animation: intro-orb-pulse 6s ease-in-out infinite alternate-reverse;
        }
        @keyframes intro-orb-pulse {
          from { opacity: 0.5; transform: scale(1); }
          to   { opacity: 1;   transform: scale(1.2); }
        }

        /* Estrellas */
        .intro-star {
          position: absolute;
          background: white;
          border-radius: 50%;
          pointer-events: none;
          animation: intro-twinkle var(--dur) ease-in-out infinite var(--dly);
          opacity: 0;
          z-index: 0;
        }
        @keyframes intro-twinkle {
          0%, 100% { opacity: 0; }
          50%       { opacity: var(--op); }
        }

        /* Contenido */
        .intro-inner {
          position: relative;
          z-index: 2;
          display: grid;
          gap: 2rem;
          align-items: center;
        }
        @media (min-width: 1024px) {
          .intro-inner { grid-template-columns: 1.1fr 0.9fr; }
        }

        .intro-left { text-align: center; }
        @media (min-width: 1024px) { .intro-left { text-align: left; } }

        /* Badge */
        .intro-badge {
          display: inline-block;
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 10px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: rgba(255, 185, 170, 0.65);
          border: 0.5px solid rgba(220, 110, 130, 0.3);
          padding: 5px 20px;
          border-radius: 100px;
          background: rgba(210, 70, 110, 0.08);
          margin-bottom: 1.2rem;
          animation: intro-fade-up 0.8s ease both 0.1s;
        }

        /* Título */
        .intro-title {
          font-family: 'Cinzel', serif;
          font-weight: 600;
          font-size: clamp(2rem, 6vw, 3.6rem);
          line-height: 1.1;
          letter-spacing: 1px;
          background: linear-gradient(135deg, #fcd5db 0%, #ffecd2 38%, #f8a5c2 68%, #dbb8e8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: intro-fade-up 0.8s ease both 0.3s, intro-glow 3.5s ease-in-out infinite alternate;
          margin: 0 0 0.3rem;
        }
        @keyframes intro-glow {
          from { filter: drop-shadow(0 0 12px rgba(255,140,170,0.35)); }
          to   { filter: drop-shadow(0 0 32px rgba(255,170,200,0.75)); }
        }

        /* Divisor */
        .intro-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 1rem 0 1.5rem;
          animation: intro-fade-up 0.8s ease both 0.45s;
          justify-content: center;
        }
        @media (min-width: 1024px) { .intro-divider { justify-content: flex-start; } }
        .intro-divider-line {
          height: 0.5px;
          width: 50px;
          background: linear-gradient(90deg, transparent, rgba(255,160,160,0.4));
        }
        .intro-divider-line.r { background: linear-gradient(90deg, rgba(255,160,160,0.4), transparent); }
        .intro-divider-heart {
          font-size: 11px;
          color: rgba(255,140,160,0.7);
          animation: intro-beat 1.8s ease-in-out infinite;
        }
        @keyframes intro-beat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.5); }
          55% { transform: scale(1); }
          75% { transform: scale(1.2); }
        }

        /* Botones */
        .intro-btns {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 0.75rem;
          animation: intro-fade-up 0.8s ease both 0.6s;
        }
        @media (min-width: 640px) {
          .intro-btns {
            flex-direction: row;
            align-items: center;
            justify-content: center;
          }
        }
        @media (min-width: 1024px) {
          .intro-btns { justify-content: flex-start; }
        }

        .btn-yes {
          position: relative;
          z-index: 30;
          font-family: 'Cinzel', serif;
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 2px;
          color: white;
          background: linear-gradient(135deg, #d94f7a, #c44fbe);
          border: none;
          border-radius: 100px;
          padding: 14px 40px;
          cursor: pointer;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          box-shadow: 0 8px 32px rgba(210,70,130,0.45), inset 0 0 0 1px rgba(255,255,255,0.2);
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .btn-yes:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 40px rgba(210,70,130,0.6), inset 0 0 0 1px rgba(255,255,255,0.3);
        }
        .btn-yes:active { transform: scale(0.97); }

        .btn-no {
          position: relative;
          z-index: 30;
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          font-size: 0.85rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,200,190,0.7);
          background: rgba(255,255,255,0.05);
          border: 0.5px solid rgba(255,160,180,0.22);
          border-radius: 100px;
          padding: 12px 28px;
          cursor: pointer;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          backdrop-filter: blur(8px);
          transition: background 0.3s, color 0.3s, border-color 0.3s, transform 0.25s;
          white-space: nowrap;
        }
        .btn-no:hover {
          background: rgba(80,20,40,0.25);
          color: rgba(255,220,210,0.9);
          border-color: rgba(200,80,110,0.4);
        }

        /* Mensaje tease */
        .intro-tease {
          min-height: 1.6rem;
          margin-top: 1rem;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(13px, 2.5vw, 16px);
          letter-spacing: 1.5px;
          color: rgba(255, 185, 170, 0.7);
          animation: intro-fade-up 0.8s ease both 0.75s;
          transition: opacity 0.3s;
        }

        /* Lado derecho — decoración */
        .intro-right {
          display: none;
          position: relative;
          align-items: center;
          justify-content: center;
          animation: intro-fade-up 0.9s ease both 0.5s;
        }
        @media (min-width: 1024px) { .intro-right { display: flex; } }

        .intro-deco-ring {
          position: absolute;
          border-radius: 50%;
          border: 0.5px solid rgba(255,150,180,0.12);
          animation: intro-ring 3.5s ease-in-out infinite;
        }
        .intro-deco-ring-1 { width: 160px; height: 160px; }
        .intro-deco-ring-2 { width: 210px; height: 210px; animation-delay: 1.2s; border-color: rgba(180,100,210,0.09); }
        .intro-deco-ring-3 { width: 260px; height: 260px; animation-delay: 2.4s; border-color: rgba(255,150,180,0.06); }
        @keyframes intro-ring {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 0.85; transform: scale(1.06); }
        }

        .intro-deco-emoji {
          font-size: 5rem;
          animation: intro-float 4s ease-in-out infinite;
          filter: drop-shadow(0 0 24px rgba(255,120,160,0.5));
          z-index: 1;
        }
        @keyframes intro-float {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50%       { transform: translateY(-14px) rotate(4deg); }
        }

        @keyframes intro-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="intro-root">
        {/* Orbes */}
        <div className="intro-orb intro-orb-1" />
        <div className="intro-orb intro-orb-2" />

        {/* Estrellas */}
        {mounted && starsRef.current.map((s, i) => (
          <div
            key={i}
            className="intro-star"
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

        <div className="intro-inner">
          {/* Izquierda */}
          <div className="intro-left">

            <h1 className="intro-title">¿Quieres ser<br />mi novia?</h1>

            <div className="intro-divider">
              <div className="intro-divider-line" />
              <span className="intro-divider-heart">♥</span>
              <div className="intro-divider-line r" />
            </div>

            <div className="intro-btns">
              <button type="button" onPointerUp={onYes} className="btn-yes">
                Sí ♥
              </button>
              <button
                type="button"
                onMouseEnter={advanceNoButton}
                onClick={advanceNoButton}
                className={`btn-no ${buttonOffsets[teaseLevel]}`}
              >
                {noLabels[teaseLevel]}
              </button>
            </div>

            <p className="intro-tease">{playfulMessages[teaseLevel]}</p>
          </div>

          {/* Derecha — decoración */}
          <div className="intro-right">
            <div className="intro-deco-ring intro-deco-ring-1" />
            <div className="intro-deco-ring intro-deco-ring-2" />
            <div className="intro-deco-ring intro-deco-ring-3" />
            <span className="intro-deco-emoji">💍</span>
          </div>
        </div>
      </div>
    </>
  )
}
