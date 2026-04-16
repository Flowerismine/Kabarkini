'use client'

import Link from 'next/link'

interface Category {
  id: string | number
  slug: string
  name: string
  color: string
}

interface CategoryHoverLinksProps {
  categories: Category[]
}

export function CategoryHoverLinks({ categories }: CategoryHoverLinksProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/kategori/${cat.slug}`}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-colors hover:text-white"
          style={{
            borderColor: cat.color,
            color: cat.color,
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.backgroundColor = cat.color
            ;(e.currentTarget as HTMLElement).style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
            ;(e.currentTarget as HTMLElement).style.color = cat.color
          }}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}
