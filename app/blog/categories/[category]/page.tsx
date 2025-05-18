import { CategoryPage } from '@/app/components/CategoryPage'
import { getCategoryBySlug } from '@/lib/categories'
import { notFound } from 'next/navigation'

interface CategoryPageParams {
  params: {
    category: string
  }
}

export default function CategoryPageWrapper({ params }: CategoryPageParams) {
  const category = getCategoryBySlug(params.category)
  
  if (!category) {
    notFound()
  }

  return (
    <CategoryPage categorySlug={params.category}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Your article grid/list component goes here */}
      </div>
    </CategoryPage>
  )
} 