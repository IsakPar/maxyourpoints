import { getCategoryBySlug } from '@/lib/categories'
import { CategoryToggles } from './CategoryToggles'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  categorySlug: string
  children: React.ReactNode
}

export function CategoryPage({ categorySlug, children }: CategoryPageProps) {
  const category = getCategoryBySlug(categorySlug)
  
  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{category.label}</h1>
      <CategoryToggles category={category} />
      {children}
    </div>
  )
} 