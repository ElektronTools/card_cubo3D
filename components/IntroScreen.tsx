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

const noScales = [1, 0.88, 0.76, 0.62, 0.48]

type Star = { left: number; top: number; size: number; dur: number; delay: number; op: number }

export default function IntroScreen({ onYes }: { onYes: () => void }) {
  const [teaseLevel, setTeaseLevel] = useState(0)
  const [noVisible, setNoVisible] = useState(true)
  const [teaseKey, setTeaseKey] = useState(0)
  const [mounted, setMounted] = useState(false)
  const starsRef = useRef<Star[]>([])

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
    setTeaseLevel((prev) => {
      const next = Math.min(prev + 1, noLabels.length - 1)
      if (next === noLabels.length - 1) {
        setTimeout(() => setNoVisible(false), 900)
      }
      return next
    })
    setTeaseKey((k) => k + 1)
  }

  const currentScale = noScales[Math.min(teaseLevel, noScales.length - 1)]
  const currentOffset = buttonOffsets[Math.min(teaseLevel, buttonOffsets.length - 1)]
  const currentMessage = playfulMessages[Math.min(teaseLevel, playfulMessages.length - 1)]

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

        .intro-btns-wrap {
          animation: intro-fade-up 0.8s ease both 0.6s;
          min-height: 64px;
        }

        .intro-btns {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 0.75rem;
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
          font-size: 1.15rem;
          letter-spacing: 3px;
          color: white;
          background: linear-gradient(135deg, #d94f7a, #c44fbe);
          border: none;
          border-radius: 100px;
          padding: 18px 52px;
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

        .btn-no-wrapper {
          position: relative;
          z-index: 30;
          transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.55s ease;
          transform-origin: center;
        }
        .btn-no-wrapper.hiding {
          opacity: 0 !important;
          transform: scale(0.1) !important;
          pointer-events: none;
        }

        .btn-no {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,200,190,0.7);
          background: rgba(255,255,255,0.05);
          border: 0.5px solid rgba(255,160,180,0.22);
          border-radius: 100px;
          cursor: pointer;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          backdrop-filter: blur(8px);
          transition: background 0.3s, color 0.3s, border-color 0.3s, font-size 0.4s ease, padding 0.4s ease;
          white-space: nowrap;
          display: block;
          width: 100%;
        }
        .btn-no:hover {
          background: rgba(80,20,40,0.25);
          color: rgba(255,220,210,0.9);
          border-color: rgba(200,80,110,0.4);
        }

        .intro-tease-wrap {
          min-height: 2rem;
          margin-top: 1rem;
          animation: intro-fade-up 0.8s ease both 0.75s;
        }
        .intro-tease {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(13px, 2.5vw, 16px);
          letter-spacing: 1.5px;
          color: rgba(255, 185, 170, 0.85);
          animation: tease-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          margin: 0;
        }
        @keyframes tease-pop {
          0%   { opacity: 0; transform: translateY(8px) scale(0.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

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
        <div className="intro-orb intro-orb-1" />
        <div className="intro-orb intro-orb-2" />

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
          <div className="intro-left">
            <h1 className="intro-title">¿Quieres ser<br />mi novia?</h1>

            <div className="intro-divider">
              <div className="intro-divider-line" />
              <span className="intro-divider-heart">♥</span>
              <div className="intro-divider-line r" />
            </div>

            <div className="intro-btns-wrap">
              <div className="intro-btns">
                <button type="button" onPointerUp={onYes} className="btn-yes">
                  Sí ♥
                </button>

                <div
                  className={`btn-no-wrapper ${currentOffset} ${!noVisible ? 'hiding' : ''}`}
                  style={{ transform: `scale(${currentScale})` }}
                >
                  <button
                    type="button"
                    onMouseEnter={advanceNoButton}
                    onClick={advanceNoButton}
                    className="btn-no"
                    style={{
                      fontSize: `${0.85 * currentScale + 0.1}rem`,
                      padding: `${12 * currentScale + 2}px ${28 * currentScale + 4}px`,
                    }}
                  >
                    {noLabels[teaseLevel] ?? noLabels[noLabels.length - 1]}
                  </button>
                </div>
              </div>
            </div>

            <div className="intro-tease-wrap">
              {currentMessage && (
                <p key={teaseKey} className="intro-tease">
                  {currentMessage}
                </p>
              )}
            </div>
          </div>

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