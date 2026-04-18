'use client'

import { useEffect, useRef, useState } from 'react'

type Star = { left: number; top: number; size: number; dur: number; delay: number; op: number }

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true)
  const starsRef = useRef<Star[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    starsRef.current = Array.from({ length: 40 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 1.6 + 0.5,
      dur: 2 + Math.random() * 3,
      delay: Math.random() * 4,
      op: 0.2 + Math.random() * 0.5,
    }))
    setMounted(true)

    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 800)
    }, 6400)

    return () => clearTimeout(timer)
  }, [onDone])

  if (!visible) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap');

        .spl-overlay {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          background: rgba(4, 2, 10, 0.45);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          animation: spl-fade-out 0.8s ease forwards 6.4s;
        }
        @keyframes spl-fade-out {
          to { opacity: 0; pointer-events: none; }
        }

        .spl-card {
          position: relative;
          text-align: center;
          padding: 3.2rem 3.5rem;
          max-width: 440px;
          width: 90vw;
          border-radius: 1.75rem;
          background: rgba(18, 8, 28, 0.7);
          border: 0.5px solid rgba(255, 140, 170, 0.2);
          overflow: hidden;
          animation: spl-card-in 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both 0.2s;
        }
        @keyframes spl-card-in {
          from { opacity: 0; transform: scale(0.88) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .spl-orb {
          position: absolute; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(200,60,110,0.22) 0%, transparent 70%);
          width: 280px; height: 280px;
          top: -100px; left: 50%; transform: translateX(-50%);
          animation: spl-orb-pulse 3s ease-in-out infinite alternate;
        }
        @keyframes spl-orb-pulse {
          from { opacity: 0.5; transform: translateX(-50%) scale(1); }
          to   { opacity: 1;   transform: translateX(-50%) scale(1.25); }
        }

        .spl-star {
          position: absolute; background: white; border-radius: 50%;
          pointer-events: none;
          animation: spl-twinkle var(--dur) ease-in-out infinite var(--dly);
          opacity: 0;
        }
        @keyframes spl-twinkle {
          0%, 100% { opacity: 0; }
          50%       { opacity: var(--op, 0.5); }
        }

        .spl-line {
          position: relative; z-index: 2;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          letter-spacing: 2.5px;
          color: rgba(255, 210, 200, 0.88);
          margin: 0;
          opacity: 0;
        }
        .spl-line-1 {
          font-size: clamp(1.1rem, 4vw, 1.5rem);
          animation: spl-line-up 0.7s ease forwards 0.8s;
        }
        .spl-line-2 {
          font-size: clamp(1rem, 3.5vw, 1.3rem);
          margin-top: 1rem;
          color: rgba(255, 195, 195, 0.7);
          animation: spl-line-up 0.7s ease forwards 1.7s;
        }
        .spl-line-3 {
          font-size: clamp(1.05rem, 3.8vw, 1.4rem);
          margin-top: 1.1rem;
          animation: spl-line-up 0.7s ease forwards 2.6s;
        }
        @keyframes spl-line-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .spl-heart {
          display: inline-block;
          color: rgba(230, 90, 130, 0.9);
          animation: spl-beat 1.6s ease-in-out infinite;
        }
        @keyframes spl-beat {
          0%, 100% { transform: scale(1); }
          25%       { transform: scale(1.5); }
          55%       { transform: scale(1); }
          75%       { transform: scale(1.2); }
        }

        .spl-divider {
          position: relative; z-index: 2;
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin: 1.4rem auto 0;
          opacity: 0;
          animation: spl-line-up 0.7s ease forwards 3.5s;
        }
        .spl-divider-line {
          height: 0.5px; width: 40px;
          background: linear-gradient(90deg, transparent, rgba(255,130,160,0.35));
        }
        .spl-divider-line.r {
          background: linear-gradient(90deg, rgba(255,130,160,0.35), transparent);
        }
        .spl-divider-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: rgba(230, 100, 140, 0.6);
        }

        .spl-progress {
          position: absolute; bottom: 0; left: 0;
          height: 2px;
          background: linear-gradient(90deg, rgba(210,70,120,0.6), rgba(180,100,220,0.5));
          animation: spl-progress 6.4s linear both 0.2s;
        }
        @keyframes spl-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>

      <div className="spl-overlay">
        <div className="spl-card">
          <div className="spl-orb" />

          {mounted && starsRef.current.map((s, i) => (
            <div
              key={i}
              className="spl-star"
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

          <p className="spl-line spl-line-1">Oye…</p>
          <p className="spl-line spl-line-2">Hay algo que quiero decirte…</p>
          <p className="spl-line spl-line-3">
            y es importante <span className="spl-heart">♥</span>
          </p>

          <div className="spl-divider">
            <div className="spl-divider-line" />
            <div className="spl-divider-dot" />
            <div className="spl-divider-line r" />
          </div>

          <div className="spl-progress" />
        </div>
      </div>
    </>
  )
}