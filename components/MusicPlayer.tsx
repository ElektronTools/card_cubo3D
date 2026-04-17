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
    <div className="rounded-[1.75rem] p-1 sm:p-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


        <div className="mx-auto w-full flex flex-col gap-1.5 sm:gap-2 rounded-[1.2rem] p-1 sm:p-2 lg:max-w-[300px]">
          <div className="relative mb-1 h-20 w-full overflow-hidden rounded-[1rem] border border-white/50 shadow-lg sm:h-28">
            <Image
              src="https://cdn-images.dzcdn.net/images/cover/6e92f911c0e0a2ff8bdb39913f455633/1900x1900-000000-80-0-0.jpg"
              alt="Portada del artista"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onPointerUp={() => void onTogglePlayback()}
              className="relative z-30 flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-lg text-white shadow-lg shadow-rose-300/50 transition hover:scale-110 sm:h-13 sm:w-13 sm:text-xl"
              aria-label={isPlaying ? 'Pausar cancion' : 'Reproducir cancion'}
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-800 text-xs sm:text-sm">Risa</p>
              <p className="text-[11px] sm:text-xs text-slate-600">Babasónicos</p>
            </div>
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={1}
              value={currentTime}
              onChange={(event) => onSeek(Number(event.target.value))}
              className="music-slider w-full accent-rose-500"
              aria-label="Progreso de la cancion"
            />

            <div className="flex justify-between text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
