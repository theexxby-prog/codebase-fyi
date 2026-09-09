import type { CSSProperties } from 'react'

// Matches the aspect-[16/10] window below; used to work out how much of the
// screenshot hangs past the frame and therefore how far it can pan.
const WINDOW_RATIO = 10 / 16

export function SitePreview({
  host,
  name,
  image,
  tile,
  monogram,
}: {
  host: string
  name: string
  image?: { w: number; h: number }
  tile: string
  monogram: string
}) {
  const shift = image
    ? Math.max(0, (1 - WINDOW_RATIO * (image.w / image.h)) * 100)
    : 0

  return (
    <div className="mb-5 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-1.5 border-b border-neutral-200 bg-neutral-100 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/60">
        <span className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        <span className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        <span className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        <span className="ml-1 truncate font-mono text-[10px] text-neutral-500 dark:text-neutral-500">
          {host}
        </span>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {image ? (
          <img
            src={`/previews/${host}.webp`}
            alt={`Screenshot of ${name}`}
            width={image.w}
            height={image.h}
            loading="lazy"
            decoding="async"
            className="preview-scroll absolute inset-x-0 top-0 w-full"
            style={
              {
                '--preview-shift': `${shift}%`,
                '--preview-duration': `${2.5 + (shift / 100) * 4}s`,
              } as CSSProperties
            }
          />
        ) : (
          <div
            className={`flex size-full items-center justify-center bg-gradient-to-br ${tile}`}
          >
            <span className="text-3xl font-semibold tracking-tight text-white/90 transition duration-300 group-hover:scale-110">
              {monogram}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
