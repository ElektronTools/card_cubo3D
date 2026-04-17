'use client'

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import Image from 'next/image'

const faces = [
  { src: '/img/image1.png', alt: 'Recuerdo 1', label: 'Pure love' },
  { src: '/img/image2.jpg', alt: 'Recuerdo 2', label: 'Lukass' },
  { src: '/img/image3.jpg', alt: 'Recuerdo 3', label: 'Thorfinn' },
  { src: '/img/image4.jpg', alt: 'Recuerdo 4', label: 'Tu mirada' },
  { src: '/img/image5.jpg', alt: 'Recuerdo 5', label: 'Las wawas' },
  { src: '/img/image6.jpg', alt: 'Recuerdo 6', label: 'Luu' },
]

const getImageUrl = (src: string) => {
  const timestamp = new Date().toISOString().split('T')[0]
  return `${src}?t=${timestamp}`
}

const AUTO_ROTATION_SPEED = 0.0225
const DRAG_ROTATION_SPEED = 0.4

export default function Cube3D() {
  const cubeRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number | null>(null)
  const rotationXRef = useRef(-18)
  const rotationYRef = useRef(0)
  const isDraggingRef = useRef(false)
  const pointerIdRef = useRef<number | null>(null)
  const pointerPositionRef = useRef({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const syncRotation = () => {
    const cube = cubeRef.current

    if (!cube) {
      return
    }

    cube.style.transform = `rotateX(${rotationXRef.current}deg) rotateY(${rotationYRef.current}deg)`
  }

  useEffect(() => {
    syncRotation()

    const animate = (time: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = time
      }

      if (!isDraggingRef.current) {
        const delta = time - lastFrameTimeRef.current
        rotationYRef.current += delta * AUTO_ROTATION_SPEED
        syncRotation()
      }

      lastFrameTimeRef.current = time
      frameRef.current = window.requestAnimationFrame(animate)
    }

    frameRef.current = window.requestAnimationFrame(animate)

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerIdRef.current = event.pointerId
    pointerPositionRef.current = { x: event.clientX, y: event.clientY }
    isDraggingRef.current = true
    lastFrameTimeRef.current = null
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || pointerIdRef.current !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - pointerPositionRef.current.x
    const deltaY = event.clientY - pointerPositionRef.current.y

    pointerPositionRef.current = { x: event.clientX, y: event.clientY }
    rotationYRef.current += deltaX * DRAG_ROTATION_SPEED
    rotationXRef.current -= deltaY * DRAG_ROTATION_SPEED
    syncRotation()
  }

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    pointerIdRef.current = null
    isDraggingRef.current = false
    lastFrameTimeRef.current = null
    setIsDragging(false)
  }

  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-3 py-6">
      <div
        className={`cube-wrapper ${isDragging ? 'is-dragging' : ''}`}
        onPointerCancel={stopDragging}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
      >
        <div ref={cubeRef} className="cube-container">
          {faces.map((face, index) => (
            <div key={face.src} className={`face face-${index + 1}`}>
              <Image
                src={getImageUrl(face.src)}
                alt={face.alt}
                fill
                sizes="(max-width: 640px) 160px, 220px"
                className="rounded-[inherit] object-cover"
                unoptimized
              />
              <div className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,transparent_28%,rgba(15,23,42,0.12)_55%,rgba(15,23,42,0.65)_100%)]" />
              <span className="absolute inset-x-3 bottom-3 rounded-full bg-white/18 px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur sm:text-xs">
                {face.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
