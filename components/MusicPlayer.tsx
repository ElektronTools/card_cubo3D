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
    <div className="glass-panel rounded-[1.75rem] p-4 sm:rounded-[2.1rem] sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-rose-500 sm:text-sm sm:tracking-[0.24em]">Nuestra cancion</p>
          <h3 className="text-xl font-semibold sm:text-2xl">Un fondo musical para este comienzo</h3>
          <p className="max-w-2xl text-slate-600">
            {autoplayBlocked
              ? 'En algunos moviles el navegador bloquea el sonido automatico. Toca reproducir y se activara.'
              : 'La pagina intenta reproducirla apenas se abre para acompanar el momento desde el inicio.'}
          </p>
        </div>

        <div className="mx-auto w-full flex flex-col gap-4 rounded-[1.6rem] border border-white/70 bg-gradient-to-br from-white/80 to-rose-50/70 p-4 shadow-md lg:max-w-[420px]">
          <div className="relative mb-4 h-32 w-full overflow-hidden rounded-[1.3rem] border border-white/50 shadow-lg sm:h-40">
            <Image
              src="https://cdn-images.dzcdn.net/images/cover/6e92f911c0e0a2ff8bdb39913f455633/1900x1900-000000-80-0-0.jpg"
              alt="Portada del artista"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onPointerUp={() => void onTogglePlayback()}
              className="relative z-30 flex h-14 w-14 shrink-0 touch-manipulation items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-lg text-white shadow-lg shadow-rose-300/50 transition hover:scale-110 sm:h-16 sm:w-16 sm:text-2xl"
              aria-label={isPlaying ? 'Pausar cancion' : 'Reproducir cancion'}
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-800">Risa</p>
              <p className="text-sm text-slate-600">Un detalle para ti</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
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
