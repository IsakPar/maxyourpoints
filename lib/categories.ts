export interface Category {
  label: string
  slug: string
  subcategories: {
    label: string
    slug: string
  }[]
}

export const categories: Category[] = [
  {
    label: "Airlines & Aviation",
    slug: "airlines-and-aviation",
    subcategories: [
      { label: "Reviews", slug: "reviews" },
      { label: "News", slug: "news" },
      { label: "Deals", slug: "deals" },
      { label: "Guides", slug: "guides" },
    ],
  },
  {
    label: "Credit Cards & Points",
    slug: "credit-cards-and-points",
    subcategories: [
      { label: "Reviews", slug: "reviews" },
      { label: "News", slug: "news" },
      { label: "Deals", slug: "deals" },
      { label: "Guides", slug: "guides" },
    ],
  },
  {
    label: "Hotels & Trip Reports",
    slug: "hotels-and-trip-reports",
    subcategories: [
      { label: "Reviews", slug: "reviews" },
      { label: "News", slug: "news" },
      { label: "Deals", slug: "deals" },
      { label: "Trip Reports", slug: "trip-reports" },
      { label: "Guides", slug: "guides" },
    ],
  },
  {
    label: "Travel Hacks & Deals",
    slug: "travel-hacks-and-deals",
    subcategories: [
      { label: "News", slug: "news" },
      { label: "Guides", slug: "guides" },
      { label: "Deals", slug: "deals" },
      { label: "Price Alerts", slug: "price-alerts" },
    ],
  },
]

// Helper functions
export const getCategoryBySlug = (slug: string) => {
  return categories.find(category => category.slug === slug)
}

export const getCategoryByLabel = (label: string) => {
  return categories.find(category => category.label === label)
}

export const getCategoryPath = (categorySlug: string, subcategorySlug?: string) => {
  return `/blog/categories/${categorySlug}${subcategorySlug ? `/${subcategorySlug}` : ''}`
}

export const CATEGORY_ID_MAP = {
  'airlines-and-aviation': 'a55ae40e-8f31-43cb-a363-b9126a90c540',
  'credit-cards-and-points': '87b5aa6e-4a5b-495a-8489-e350717c3a39', 
  'hotels-and-trip-reports': 'f4874537-f296-4b1f-a8c1-464a23909f62',
  'travel-hacks-and-deals': '3fae5aa7-97ae-4c95-904e-79f5a11aea7a'
} as const

export function getCategoryIdBySlug(slug: string): string | undefined {
  return CATEGORY_ID_MAP[slug as keyof typeof CATEGORY_ID_MAP]
} 