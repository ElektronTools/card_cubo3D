'use client'

import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

type FloatingHeart = {
  id: number
  left: number
  size: number
  delay: number
  char: string
}

const chars = ['♥', '♥', '♥', '✦', '✿', '♥']

export default function AcceptScreen({ onNext }: { onNext: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([])
  const [burst, setBurst] = useState(false)
  const [mounted, setMounted] = useState(false)
  const starsRef = useRef<{ left: number; top: number; size: number; dur: number; delay: number; op: number }[]>([])
  const counterRef = useRef(0)


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



  const spawnHearts = () => {
    const newHearts: FloatingHeart[] = Array.from({ length: 22 }, (_, i) => ({
      id: counterRef.current++,
      left: Math.random() * 90 + 5,
      size: 14 + Math.random() * 18,
      delay: i * 55,
      char: chars[Math.floor(Math.random() * chars.length)],
    }))
    setFloatingHearts((prev) => [...prev, ...newHearts])
    newHearts.forEach((h) => {
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((x) => x.id !== h.id))
      }, 3800 + h.delay)
    })
  }

  const handleNext = () => {
    setBurst(true)
    spawnHearts()
    setTimeout(onNext, 1000)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Lato:wght@300;400&display=swap');

        .accept-root {
          position: relative;
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
          border-radius: 2rem;
          overflow: hidden;
          background: rgba(8, 4, 16, 0.35);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 0.5px solid rgba(255, 160, 180, 0.18);
          padding: 2.5rem 1.5rem;
          text-align: center;
        }
        @media (min-width: 640px) {
          .accept-root { padding: 3.5rem 3rem; border-radius: 2.25rem; }
        }

        /* Orbes */
        .accept-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .accept-orb-1 {
          width: 280px; height: 280px;
          top: -90px; left: -80px;
          background: radial-gradient(circle, rgba(210,70,110,0.2) 0%, transparent 70%);
          animation: accept-orb 5s ease-in-out infinite alternate;
        }
        .accept-orb-2 {
          width: 220px; height: 220px;
          bottom: -70px; right: -60px;
          background: radial-gradient(circle, rgba(110,50,200,0.16) 0%, transparent 70%);
          animation: accept-orb 6s ease-in-out infinite alternate-reverse;
        }
        @keyframes accept-orb {
          from { opacity: 0.5; transform: scale(1); }
          to   { opacity: 1;   transform: scale(1.2); }
        }

        /* Estrellas */
        .accept-star {
          position: absolute;
          background: white;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          animation: accept-twinkle var(--dur) ease-in-out infinite var(--dly);
          opacity: 0;
        }
        @keyframes accept-twinkle {
          0%, 100% { opacity: 0; }
          50%       { opacity: var(--op); }
        }

        /* Corazones flotantes */
        .accept-heart {
          position: fixed;
          bottom: 60px;
          color: rgba(255, 130, 155, 0.75);
          pointer-events: none;
          z-index: 9999;
          animation: accept-rise 3.4s ease-out forwards;
          animation-delay: var(--hd);
          opacity: 0;
        }
        @keyframes accept-rise {
          0%   { opacity: 0;   transform: translateY(0)    scale(0.5) rotate(-8deg); }
          12%  { opacity: 0.9; transform: translateY(-28px) scale(1)   rotate(6deg); }
          80%  { opacity: 0.5; transform: translateY(-200px) scale(0.8) rotate(-4deg); }
          100% { opacity: 0;   transform: translateY(-260px) scale(0.4) rotate(8deg); }
        }

        /* Contenido */
        .accept-inner {
          position: relative;
          z-index: 2;
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.4rem;
        }

        /* Icono animado */
        .accept-icon-wrap {
          position: relative;
          width: 80px; height: 80px;
          display: flex; align-items: center; justify-content: center;
          animation: accept-fade-up 0.8s ease both 0.1s;
        }
        .accept-icon-ring {
          position: absolute;
          border-radius: 50%;
          border: 0.5px solid rgba(255,150,180,0.2);
          animation: accept-icon-pulse 2.5s ease-in-out infinite;
        }
        .accept-icon-ring-1 { width: 80px; height: 80px; }
        .accept-icon-ring-2 { width: 100px; height: 100px; animation-delay: 0.8s; border-color: rgba(180,100,210,0.12); }
        @keyframes accept-icon-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 0.9; transform: scale(1.08); }
        }
        .accept-icon-emoji {
          font-size: 2.4rem;
          z-index: 1;
          animation: accept-beat 1.8s ease-in-out infinite;
          filter: drop-shadow(0 0 16px rgba(255,100,140,0.6));
        }
        @keyframes accept-beat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.18); }
          55% { transform: scale(0.96); }
          75% { transform: scale(1.1); }
        }

        /* Badge */
        .accept-badge {
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
          animation: accept-fade-up 0.8s ease both 0.25s;
        }

        /* Título */
        .accept-title {
          font-family: 'Cinzel', serif;
          font-weight: 600;
          font-size: clamp(1.8rem, 5.5vw, 3.2rem);
          line-height: 1.1;
          letter-spacing: 2px;
          background: linear-gradient(135deg, #fcd5db 0%, #ffecd2 38%, #f8a5c2 68%, #dbb8e8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          animation: accept-fade-up 0.8s ease both 0.35s, accept-glow 3.5s ease-in-out infinite alternate;
        }
        @keyframes accept-glow {
          from { filter: drop-shadow(0 0 12px rgba(255,140,170,0.35)); }
          to   { filter: drop-shadow(0 0 32px rgba(255,170,200,0.75)); }
        }

        /* Divisor */
        .accept-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          animation: accept-fade-up 0.8s ease both 0.45s;
        }
        .accept-divider-line {
          width: 50px; height: 0.5px;
          background: linear-gradient(90deg, transparent, rgba(255,160,160,0.4));
        }
        .accept-divider-line.r {
          background: linear-gradient(90deg, rgba(255,160,160,0.4), transparent);
        }
        .accept-divider-heart {
          font-size: 11px;
          color: rgba(255,140,160,0.7);
          animation: accept-hbeat 1.7s ease-in-out infinite;
        }
        @keyframes accept-hbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.5); }
          55% { transform: scale(1); }
          75% { transform: scale(1.2); }
        }

        /* Momentos */
        .accept-moments {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          animation: accept-fade-up 0.8s ease both 0.5s;
        }

        .accept-moment {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(255,255,255,0.03);
          border: 0.5px solid rgba(255,160,180,0.12);
          border-radius: 14px;
          padding: 13px 16px;
          text-align: left;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .accept-moment.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .accept-moment-dot {
          flex-shrink: 0;
          margin-top: 4px;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e07090, #b060d0);
          box-shadow: 0 0 8px rgba(200,80,140,0.5);
        }

        .accept-moment-text {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(14px, 2.5vw, 17px);
          line-height: 1.5;
          color: rgba(255, 210, 200, 0.85);
          letter-spacing: 0.3px;
        }

        /* Botón */
        .accept-btn {
          font-family: 'Cinzel', serif;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 2px;
          color: white;
          background: linear-gradient(135deg, #d94f7a, #c44fbe);
          border: none;
          border-radius: 100px;
          padding: 15px 44px;
          cursor: pointer;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          box-shadow: 0 8px 32px rgba(210,70,130,0.45), inset 0 0 0 1px rgba(255,255,255,0.2);
          transition: transform 0.25s, box-shadow 0.25s;
          animation: accept-fade-up 0.8s ease both 0.75s;
        }
        .accept-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 40px rgba(210,70,130,0.6), inset 0 0 0 1px rgba(255,255,255,0.3);
        }
        .accept-btn:active { transform: scale(0.97); }
        .accept-btn.burst { animation: accept-burst 0.4s ease forwards; }
        @keyframes accept-burst {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.12); }
          100% { transform: scale(0.95); opacity: 0.7; }
        }

        @keyframes accept-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Corazones flotantes — portal a document.body para escapar de overflow:hidden */}
      {mounted && floatingHearts.length > 0 && createPortal(
        <>
          {floatingHearts.map((h) => (
            <span
              key={h.id}
              className="accept-heart"
              style={{
                left: `${h.left}%`,
                fontSize: `${h.size}px`,
                ['--hd' as string]: `${h.delay}ms`,
              }}
            >
              {h.char}
            </span>
          ))}
        </>,
        document.body
      )}

      <div className="accept-root">
        <div className="accept-orb accept-orb-1" />
        <div className="accept-orb accept-orb-2" />

        {mounted && starsRef.current.map((s, i) => (
          <div
            key={i}
            className="accept-star"
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

        <div className="accept-inner">
          {/* Icono */}
          <div className="accept-icon-wrap">
            <div className="accept-icon-ring accept-icon-ring-1" />
            <div className="accept-icon-ring accept-icon-ring-2" />
            <span className="accept-icon-emoji">💖</span>
          </div>

          {/* Badge */}
          <div className="accept-badge">Respuesta confirmada</div>

          {/* Título */}
          <h2 className="accept-title">¡Sabía que<br />dirías que sí!</h2>

          {/* Divisor */}
          <div className="accept-divider">
            <div className="accept-divider-line" />
            <span className="accept-divider-heart">♥</span>
            <div className="accept-divider-line r" />
          </div>


          {/* Botón */}
          <button
            type="button"
            onPointerUp={handleNext}
            className={`accept-btn ${burst ? 'burst' : ''}`}
          >
            Abre este detalle para ti ♥
          </button>
        </div>
      </div>
    </>
  )
}
