'use client'

import Image from 'next/image'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
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
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg">
      {/* Banner sutil cuando el autoplay fue bloqueado */}
      {autoplayBlocked && (
        <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 text-[10px] text-white/80">
          <span>🔇</span>
          <span>Tocá play para escuchar la canción</span>
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3">
        {/* Portada con indicador de reproducción animado */}
        <div className="flex-shrink-0">
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-lg shadow-md">
            <Image
              src="https://cdn-images.dzcdn.net/images/cover/6e92f911c0e0a2ff8bdb39913f455633/1900x1900-000000-80-0-0.jpg"
              alt="Portada del artista"
              fill
              className={`object-cover transition-all duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
              unoptimized
            />
            {/* Overlay pulsante cuando suena */}
            {isPlaying && (
              <div className="absolute inset-0 rounded-lg ring-2 ring-white/40 animate-pulse" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {/* Botón play/pause */}
            <button
              type="button"
              onPointerUp={() => void onTogglePlayback()}
              className="relative z-30 flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 touch-manipulation items-center justify-center rounded-full bg-white text-rose-500 transition-all hover:scale-110 hover:bg-rose-50 hover:shadow-lg font-bold shadow-md active:scale-95"
              aria-label={isPlaying ? 'Pausar canción' : 'Reproducir canción'}
            >
              {isPlaying ? (
                <span className="text-[10px] tracking-tighter">❚❚</span>
              ) : (
                <span className="text-xs pl-0.5">▶</span>
              )}
            </button>

            {/* Info de la canción con ondas animadas cuando suena */}
            <div className="min-w-0 flex-1 flex items-center gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-white text-xs sm:text-sm line-clamp-1">Risa</p>
                <p className="text-[10px] sm:text-xs text-white/80 line-clamp-1">Babasónicos</p>
              </div>

              {/* Ecualizador animado — solo visible cuando suena */}
              {isPlaying && (
                <div className="flex items-end gap-[2px] h-4 shrink-0" aria-hidden>
                  {[0, 0.2, 0.1, 0.3, 0.15].map((delay, i) => (
                    <span
                      key={i}
                      className="w-[3px] bg-white/70 rounded-full"
                      style={{
                        animation: `eq-bar 0.7s ease-in-out ${delay}s infinite alternate`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Barra de progreso custom */}
          <div className="space-y-1">
            <div className="relative group">
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={1}
                value={currentTime}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="music-slider w-full h-1.5 appearance-none rounded-full cursor-pointer
                  bg-white/25 accent-white
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:opacity-0
                  [&::-webkit-slider-thumb]:group-hover:opacity-100
                  [&::-webkit-slider-thumb]:transition-opacity"
                style={{
                  background: `linear-gradient(to right, rgba(255,255,255,0.9) ${progress}%, rgba(255,255,255,0.25) ${progress}%)`,
                }}
                aria-label="Progreso de la canción"
              />
            </div>

            <div className="flex justify-between text-[10px] sm:text-xs font-medium text-white/75 tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes eq-bar {
          from { height: 3px; }
          to   { height: 14px; }
        }
      `}</style>
    </div>
  )
}