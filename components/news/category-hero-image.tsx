'use client'

interface CategoryHeroImageProps {
  src: string
  alt: string
  fallbackSrc: string
}

export function CategoryHeroImage({ src, alt, fallbackSrc }: CategoryHeroImageProps) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
      loading="eager"
      width={900}
      height={500}
      onError={(e) => {
        const img = e.target as HTMLImageElement
        if (img.src !== fallbackSrc) img.src = fallbackSrc
      }}
    />
  )
}
