'use client'

import Image from 'next/image'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) {
    return '0:00'
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export default function MusicPlayer({
  autoplayBlocked,
  currentTime,
  duration,
  isPlaying,
  onSeek,
  onTogglePlayback,
}: {
  autoplayBlocked: boolean
  currentTime: number
  duration: number
  isPlaying: boolean
  onSeek: (nextTime: number) => void
  onTogglePlayback: () => Promise<void>
}) {
  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg">
      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3">
        <div className="flex-shrink-0">
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-lg shadow-md">
            <Image
              src="https://cdn-images.dzcdn.net/images/cover/6e92f911c0e0a2ff8bdb39913f455633/1900x1900-000000-80-0-0.jpg"
              alt="Portada del artista"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onPointerUp={() => void onTogglePlayback()}
              className="relative z-30 flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 touch-manipulation items-center justify-center rounded-full bg-white text-sm sm:text-base text-rose-500 transition hover:scale-110 hover:bg-rose-50 hover:shadow-lg font-bold shadow-md"
              aria-label={isPlaying ? 'Pausar cancion' : 'Reproducir cancion'}
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white text-xs sm:text-sm line-clamp-1">Risa</p>
              <p className="text-[10px] sm:text-xs text-white/90 line-clamp-1">Babasónicos</p>
            </div>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={1}
              value={currentTime}
              onChange={(event) => onSeek(Number(event.target.value))}
              className="music-slider w-full accent-white h-1.5"
              aria-label="Progreso de la cancion"
            />

            <div className="flex justify-between text-[10px] sm:text-xs font-medium text-white/80">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
