'use client'

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import Image from 'next/image'

/* ─────────────────────────────────────────────
   DATOS
───────────────────────────────────────────── */
const faces = [
  { src: '/img/image1.png', alt: 'Recuerdo 1', label: 'Pure love' },
  { src: '/img/image2.jpg', alt: 'Recuerdo 2', label: 'Lukass' },
  { src: '/img/image3.jpg', alt: 'Recuerdo 3', label: 'Thorfinn' },
  { src: '/img/image4.jpg', alt: 'Recuerdo 4', label: 'Cloti' },
  { src: '/img/image5.jpg', alt: 'Recuerdo 5', label: 'Las wawas' },
  { src: '/img/image6.jpg', alt: 'Recuerdo 6', label: 'Con el Luu💖' },
]

const getImageUrl = (src: string) =>
  `${src}?t=${new Date().toISOString().split('T')[0]}`

/* ─────────────────────────────────────────────
   FÍSICA
───────────────────────────────────────────── */
const AUTO_SPEED       = 0.018   // °/ms en auto-rotación
const DRAG_SENSITIVITY = 0.38   // sensibilidad al arrastrar
const FRICTION         = 0.94   // fricción por frame
const AUTO_RESUME_K    = 0.012  // qué tan rápido vuelve la auto-rotación
const X_LIMIT          = 38     // ángulo máximo de inclinación vertical
const MIN_VEL          = 0.008  // velocidad mínima antes de parar inercia
const SPRING_X         = 0.035  // spring de retorno a X=0
const TILT_FACTOR      = 0.6    // hover tilt desktop

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const lerp  = (a: number, b: number, t: number)   => a + (b - a) * t

/* ─────────────────────────────────────────────
   COMPONENTE
───────────────────────────────────────────── */
export default function Cube3D() {
  const cubeRef    = useRef<HTMLDivElement>(null)
  const wrapRef    = useRef<HTMLDivElement>(null)
  const frameRef   = useRef<number | null>(null)

  /* física */
  const rotX       = useRef(-15)
  const rotY       = useRef(0)
  const velX       = useRef(0)
  const velY       = useRef(0)
  const autoVelY   = useRef(AUTO_SPEED * 16)

  /* drag */
  const dragging   = useRef(false)
  const ptrId      = useRef<number | null>(null)
  const lastPos    = useRef({ x: 0, y: 0 })
  const lastDelta  = useRef({ x: 0, y: 0 })
  const lastMoveT  = useRef(0)
  const lastFrameT = useRef<number | null>(null)

  /* hover tilt */
  const hoverTilt  = useRef({ x: 0, y: 0 })
  const targetTilt = useRef({ x: 0, y: 0 })

  /* glow */
  const glowRef    = useRef(0)

  /* UI */
  const [isDragging, setIsDragging]   = useState(false)
  const [activeFace, setActiveFace]   = useState(0)
  const [hintGone, setHintGone]       = useState(false)
  const [hintHidden, setHintHidden]   = useState(false)

  /* ── aplicar transform al DOM sin re-render ── */
  const applyTransform = useCallback(() => {
    if (!cubeRef.current) return
    cubeRef.current.style.transform =
      `rotateX(${rotX.current + hoverTilt.current.x}deg) rotateY(${rotY.current + hoverTilt.current.y}deg)`
  }, [])

  /* ── loop de animación ── */
  useEffect(() => {
    applyTransform()

    const loop = (time: number) => {
      const dt = lastFrameT.current === null
        ? 16
        : Math.min(time - lastFrameT.current, 50)
      lastFrameT.current = time

      if (!dragging.current) {
        const hasInertia =
          Math.abs(velY.current) > MIN_VEL || Math.abs(velX.current) > MIN_VEL

        if (hasInertia) {
          rotY.current += velY.current
          rotX.current -= velX.current
          rotX.current  = clamp(rotX.current, -X_LIMIT, X_LIMIT)
          velY.current *= FRICTION
          velX.current *= FRICTION
          if (Math.abs(velY.current) < MIN_VEL) velY.current = 0
          if (Math.abs(velX.current) < MIN_VEL) velX.current = 0
        } else {
          /* auto-rotación — velocidad se recupera suavemente */
          autoVelY.current = lerp(autoVelY.current, AUTO_SPEED * dt, AUTO_RESUME_K)
          rotY.current += autoVelY.current

          /* spring retorno a X=0 */
          rotX.current += -rotX.current * SPRING_X
        }

        /* hover tilt lerp */
        hoverTilt.current.x = lerp(hoverTilt.current.x, targetTilt.current.x, 0.07)
        hoverTilt.current.y = lerp(hoverTilt.current.y, targetTilt.current.y, 0.07)
      } else {
        hoverTilt.current.x = lerp(hoverTilt.current.x, 0, 0.18)
        hoverTilt.current.y = lerp(hoverTilt.current.y, 0, 0.18)
      }

      /* glow en CSS var (sin setState) */
      const speed = Math.abs(velY.current) + Math.abs(velX.current)
      const targetGlow = dragging.current ? 1 : clamp(speed / 2.5, 0, 1)
      glowRef.current  = lerp(glowRef.current, targetGlow, 0.09)
      wrapRef.current?.style.setProperty('--glow', `${glowRef.current.toFixed(3)}`)

      applyTransform()
      frameRef.current = requestAnimationFrame(loop)
    }

    frameRef.current = requestAnimationFrame(loop)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [applyTransform])

  /* ── cara activa ── */
  useEffect(() => {
    const id = setInterval(() => {
      const y = ((rotY.current % 360) + 360) % 360
      setActiveFace(Math.round(y / 60) % 6)
    }, 180)
    return () => clearInterval(id)
  }, [])

  /* ── handlers ── */
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    ptrId.current     = e.pointerId
    lastPos.current   = { x: e.clientX, y: e.clientY }
    lastDelta.current = { x: 0, y: 0 }
    dragging.current  = true
    velX.current = velY.current = 0
    autoVelY.current  = 0
    lastFrameT.current = null
    lastMoveT.current  = performance.now()
    setIsDragging(true)
    setHintHidden(true)
    setTimeout(() => setHintGone(true), 600)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current || ptrId.current !== e.pointerId) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current   = { x: e.clientX, y: e.clientY }
    lastDelta.current = { x: dx, y: dy }
    lastMoveT.current = performance.now()
    rotY.current += dx * DRAG_SENSITIVITY
    rotX.current  = clamp(rotX.current - dy * DRAG_SENSITIVITY, -X_LIMIT, X_LIMIT)
    applyTransform()
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (ptrId.current !== e.pointerId) return
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId)

    if (performance.now() - lastMoveT.current < 100) {
      velY.current = lastDelta.current.x * DRAG_SENSITIVITY * 0.55
      velX.current = lastDelta.current.y * DRAG_SENSITIVITY * 0.55
    }
    ptrId.current = null
    dragging.current  = false
    lastFrameT.current = null
    setIsDragging(false)
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging.current || !wrapRef.current) return
    const r  = wrapRef.current.getBoundingClientRect()
    const nx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2)
    const ny = (e.clientY - r.top   - r.height / 2) / (r.height / 2)
    targetTilt.current = {
      x: -ny * X_LIMIT * TILT_FACTOR * 0.18,
      y:  nx * X_LIMIT * TILT_FACTOR * 0.18,
    }
  }

  const onMouseLeave = () => { targetTilt.current = { x: 0, y: 0 } }

  /* ─────────────────────────────────────────────
     JSX
  ───────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400&display=swap');

        .c3d-outer {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1.5rem 0 2.2rem;
        }

        /* sombra elíptica proyectada */
        .c3d-shadow {
          position: absolute;
          bottom: 1.1rem;
          left: 50%;
          transform: translateX(-50%);
          width: 150px; height: 24px;
          background: radial-gradient(ellipse, rgba(190,60,120,0.38) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(7px);
          pointer-events: none;
          animation: c3d-shad 3.2s ease-in-out infinite;
        }
        @keyframes c3d-shad {
          0%,100% { opacity:.5; transform:translateX(-50%) scaleX(1); }
          50%     { opacity:.9; transform:translateX(-50%) scaleX(1.14); }
        }

        /* wrapper con perspective */
        .c3d-wrap {
          position: relative;
          width: 220px; height: 220px;
          perspective: 860px;
          perspective-origin: 50% 42%;
          cursor: grab;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          --glow: 0;
          --gc: 210,80,140;
        }
        @media (max-width: 640px) { .c3d-wrap { width: 250px; height: 250px; } }
        .c3d-wrap.is-drag { cursor: grabbing; }

        /* anillo de glow reactivo */
        .c3d-glow {
          position: absolute;
          inset: -22px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 20;
          border: 1.5px solid rgba(var(--gc), calc(var(--glow) * 0.5));
          box-shadow:
            0 0 calc(var(--glow) * 44px) rgba(var(--gc), calc(var(--glow) * 0.22)),
            inset 0 0 calc(var(--glow) * 18px) rgba(var(--gc), calc(var(--glow) * 0.1));
        }

        /* partículas flotantes */
        .c3d-sparks {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 21;
        }
        .c3d-spark {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,210,225,0.95);
          animation: c3d-spark var(--d) ease-in-out infinite var(--dl);
          opacity: 0;
        }
        @keyframes c3d-spark {
          0%,100% { opacity:0; transform:translate(0,0) scale(.5); }
          45%     { opacity:.85; transform:translate(var(--tx),var(--ty)) scale(1); }
          75%     { opacity:.3; }
        }

        /* contenedor 3D */
        .c3d-box {
          position: relative;
          width: 100%; height: 100%;
          transform-style: preserve-3d;
          will-change: transform;
        }

        /* caras */
        .c3d-face {
          position: absolute;
          width: 220px; height: 220px;
          border-radius: 1.75rem;
          backface-visibility: hidden;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.32);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.22),
            inset 0 -1px 0 rgba(0,0,0,0.12);
          transition: border-color .35s;
        }
        @media (max-width:640px) { .c3d-face { width:250px; height:250px; border-radius:1.5rem; } }
        .c3d-wrap.is-drag .c3d-face { border-color: rgba(220,100,160,0.55); }

        .c3d-face-1 { transform:translateZ(110px); }
        .c3d-face-2 { transform:rotateY(180deg) translateZ(110px); }
        .c3d-face-3 { transform:rotateY(-90deg) translateZ(110px); }
        .c3d-face-4 { transform:rotateY(90deg)  translateZ(110px); }
        .c3d-face-5 { transform:rotateX(90deg)  translateZ(110px); }
        .c3d-face-6 { transform:rotateX(-90deg) translateZ(110px); }
        @media (max-width:640px) {
          .c3d-face-1 { transform:translateZ(125px); }
          .c3d-face-2 { transform:rotateY(180deg) translateZ(125px); }
          .c3d-face-3 { transform:rotateY(-90deg) translateZ(125px); }
          .c3d-face-4 { transform:rotateY(90deg)  translateZ(125px); }
          .c3d-face-5 { transform:rotateX(90deg)  translateZ(125px); }
          .c3d-face-6 { transform:rotateX(-90deg) translateZ(125px); }
        }

        /* capa de profundidad */
        .c3d-depth {
          position:absolute; inset:0;
          border-radius:inherit;
          background:linear-gradient(160deg,rgba(255,255,255,.07) 0%,transparent 38%,rgba(0,0,0,.07) 68%,rgba(0,0,0,.54) 100%);
          pointer-events:none; z-index:1;
        }
        /* reflejo superior tipo vidrio */
        .c3d-shine {
          position:absolute; top:0; left:0; right:0; height:42%;
          border-radius:inherit;
          background:linear-gradient(180deg,rgba(255,255,255,.1) 0%,transparent 100%);
          pointer-events:none; z-index:2;
        }

        /* label */
        .c3d-label {
          position:absolute; bottom:11px; left:10px; right:10px; z-index:3;
          border-radius:100px;
          background:rgba(8,0,18,.4);
          backdrop-filter:blur(14px);
          -webkit-backdrop-filter:blur(14px);
          border:.5px solid rgba(255,255,255,.18);
          padding:7px 14px;
          text-align:center;
          font-family:'Lato',sans-serif;
          font-size:10px; font-weight:400;
          letter-spacing:.22em;
          text-transform:uppercase;
          color:rgba(255,235,230,.9);
          transition:background .3s, border-color .3s;
        }
        .c3d-wrap.is-drag .c3d-label {
          background:rgba(150,45,95,.35);
          border-color:rgba(255,140,180,.28);
        }

        /* hint */
        .c3d-hint {
          display:flex; align-items:center; gap:8px;
          font-family:'Lato',sans-serif;
          font-weight:300; font-size:10px;
          letter-spacing:4px; text-transform:uppercase;
          color:rgba(255,185,170,.48);
          pointer-events:none;
          transition:opacity .5s;
        }
        .c3d-hint.fade { opacity:0; }
        .c3d-hint-icon { animation:c3d-spin 5s linear infinite; display:inline-block; font-size:11px; }
        @keyframes c3d-spin { to { transform:rotate(360deg); } }

        /* dots */
        .c3d-dots { display:flex; gap:6px; pointer-events:none; }
        .c3d-dot {
          width:5px; height:5px; border-radius:50%;
          background:rgba(255,170,190,.2);
          border:.5px solid rgba(255,150,175,.25);
          transition:background .35s, transform .35s, box-shadow .35s;
        }
        .c3d-dot.on {
          background:rgba(210,85,135,.9);
          transform:scale(1.35);
          box-shadow:0 0 7px rgba(210,85,135,.65);
        }
      `}</style>

      <div className="c3d-outer">
        <div className="c3d-shadow" />

        <div
          ref={wrapRef}
          className={`c3d-wrap ${isDragging ? 'is-drag' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          {/* anillo glow */}
          <div className="c3d-glow" />

          {/* partículas */}
          <div className="c3d-sparks">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="c3d-spark"
                style={{
                  width:  `${2 + (i % 3)}px`,
                  height: `${2 + (i % 3)}px`,
                  top:    `${8  + (i * 41 % 84)}%`,
                  left:   `${4  + (i * 67 % 92)}%`,
                  ['--d'  as string]: `${2.2 + i * 0.38}s`,
                  ['--dl' as string]: `${i * 0.28}s`,
                  ['--tx' as string]: `${(i % 2 ? 1 : -1) * (3 + i * 2.5)}px`,
                  ['--ty' as string]: `${-5 - i * 1.8}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>

          {/* cubo */}
          <div ref={cubeRef} className="c3d-box">
            {faces.map((face, i) => (
              <div key={face.src} className={`c3d-face c3d-face-${i + 1}`}>
                <Image
                  src={getImageUrl(face.src)}
                  alt={face.alt}
                  fill
                  sizes="(max-width:640px) 250px, 220px"
                  className="object-cover"
                  style={{ borderRadius: 'inherit' }}
                  unoptimized
                />
                <div className="c3d-depth" />
                <div className="c3d-shine" />
                <span className="c3d-label">{face.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* hint */}
        {!hintGone && (
          <div className={`c3d-hint ${hintHidden ? 'fade' : ''}`}>
            <span className="c3d-hint-icon">✦</span>
            arrastra para girar
            <span className="c3d-hint-icon">✦</span>
          </div>
        )}

        {/* dots */}
        <div className="c3d-dots" aria-hidden>
          {faces.map((_, i) => (
            <div key={i} className={`c3d-dot ${activeFace === i ? 'on' : ''}`} />
          ))}
        </div>
      </div>
    </>
  )
}
