export interface BlogPost {
  id: number
  title: string
  summary: string
  category: string
  readTime: string
  image: string
  slug: string
  author: string
  date: string
}

export const posts: BlogPost[] = [
  {
    id: 1,
    title: "Maximize Your Airline Points",
    summary: "Learn how to strategically earn and redeem airline points for maximum value on your next trip. Discover insider techniques that frequent flyers use to get more from their miles and travel further for less.",
    category: "Airline",
    readTime: "5 min read",
    image: "/placeholder.svg",
    slug: "/blog/maximize-airline-points",
    author: "Sarah Johnson",
    date: "May 10, 2023"
  },
  {
    id: 2,
    title: "Best Credit Cards for Travel",
    summary: "Discover the top credit cards that offer exceptional travel rewards, perks, and benefits for frequent travelers. Compare sign-up bonuses, earning rates, and redemption options to find your perfect travel companion.",
    category: "Credit",
    readTime: "7 min read",
    image: "/placeholder.svg",
    slug: "/blog/best-credit-cards-travel",
    author: "Michael Chen",
    date: "April 28, 2023"
  },
  {
    id: 3,
    title: "Top Hotels for Budget Travelers",
    summary: "Find out how to book luxury accommodations without breaking the bank using points, promotions, and insider strategies. Learn which hotel chains offer the best value and how to maximize elite status benefits.",
    category: "Hotels",
    readTime: "6 min read",
    image: "/placeholder.svg",
    slug: "/blog/budget-luxury-hotels",
    author: "Emma Rodriguez",
    date: "April 15, 2023"
  },
  {
    id: 4,
    title: "Hidden Gems: Underrated Destinations",
    summary: "Explore lesser-known travel destinations that offer incredible experiences without the crowds and high costs. Discover beautiful locations that haven't been overrun by tourism and offer authentic cultural experiences.",
    category: "Destinations",
    readTime: "5 min read",
    image: "/placeholder.svg",
    slug: "/blog/hidden-gem-destinations",
    author: "David Thompson",
    date: "March 30, 2023"
  },
  {
    id: 5,
    title: "Travel Hacking 101: Getting Started",
    summary: "A beginner's guide to travel hacking with step-by-step instructions on how to start maximizing your travel rewards. Learn the fundamentals of points programs and how to develop a strategy that works for your travel goals.",
    category: "Guide",
    readTime: "8 min read",
    image: "/placeholder.svg",
    slug: "/blog/travel-hacking-101",
    author: "Jessica Williams",
    date: "March 15, 2023"
  },
  {
    id: 6,
    title: "First Class for Economy Price",
    summary: "Strategies for upgrading your flight experience without paying premium prices using points and status. Discover the best times to book, how to leverage airline partnerships, and techniques for successful upgrades.",
    category: "Airline",
    readTime: "6 min read",
    image: "/placeholder.svg",
    slug: "/blog/first-class-economy-price",
    author: "Robert Garcia",
    date: "February 28, 2023"
  }
] 