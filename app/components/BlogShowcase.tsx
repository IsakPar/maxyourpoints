"use client"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

interface CategoryTagProps {
  children: React.ReactNode
}

const CategoryTag = ({ children }: CategoryTagProps) => {
  return (
    <div className="px-2.5 py-1 bg-transparent rounded-md outline outline-1 outline-stone-950/20 flex justify-start items-start">
      <div className="text-stone-950 text-sm font-bold font-['Inter'] leading-tight">{children}</div>
    </div>
  )
}

interface BlogPostProps {
  post: {
    id: number
    title: string
    summary: string
    category: string
    readTime: string
    image: string
    slug: string
  }
}

// Update the BlogPost component to make the entire card clickable with hover effect
const BlogPost = ({ post }: BlogPostProps) => {
  const { title, summary, category, readTime, image, slug } = post
  const router = useRouter()

  const handleCardClick = () => {
    router.push(slug)
  }

  return (
    <div
      className="flex-1 flex flex-col md:flex-row justify-start items-start md:items-start gap-4 md:gap-8 p-4 rounded-lg transition-all duration-300 hover:shadow-elevation cursor-pointer bg-transparent"
      onClick={handleCardClick}
    >
      <div className="w-full md:w-2/5 h-48 md:h-64 flex-shrink-0 overflow-hidden rounded-md">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="w-full md:w-3/5 flex flex-col justify-start items-start gap-4 md:gap-6">
        <div className="w-full flex flex-col justify-start items-start gap-4">
          <div className="flex justify-start items-center gap-4">
            <CategoryTag>{category}</CategoryTag>
            <div className="text-stone-950 text-sm font-bold font-['Inter'] leading-tight">{readTime}</div>
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <h3 className="w-full text-stone-950 text-xl md:text-2xl font-bold leading-relaxed md:leading-loose">
              {title}
            </h3>
            <p className="w-full text-stone-950 text-base font-bold font-['Inter'] leading-normal line-clamp-3">
              {summary}
            </p>
          </div>
        </div>
        <div
          className="rounded-xl inline-flex justify-center items-center gap-2 text-stone-950 hover:text-orange-500 transition-colors"
          onClick={(e) => e.stopPropagation()} // Prevent triggering the parent click
        >
          <Link href={slug} className="inline-flex items-center gap-2">
            <span className="text-base font-bold font-['Inter'] leading-normal">Read more</span>
            <ChevronRight size={24} />
          </Link>
        </div>
      </div>
    </div>
  )
}

interface OutlinedGradientButtonProps {
  href?: string
  children: React.ReactNode
}

const OutlinedGradientButton = ({ href, children }: OutlinedGradientButtonProps) => {
  const style = {
    background: "white",
    border: "2px solid transparent",
    backgroundImage: "linear-gradient(white, white), linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
    transition: "all 0.5s ease",
  }

  const buttonContent = (
    <button
      className="px-5 py-2.5 text-base font-medium font-['Inter'] rounded-lg text-stone-950 hover:text-orange-500"
      style={style}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundImage = "linear-gradient(white, white), linear-gradient(to right, #EA580C, #EAB308, #2DD4BF)"
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundImage = "linear-gradient(white, white), linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)"
      }}
    >
      {children}
    </button>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    )
  }

  return buttonContent
}

export interface BlogPost {
  id: number
  title: string
  summary: string
  category: string
  readTime: string
  image: string
  slug: string
}

export interface BlogShowcaseProps {
  title?: string
  subtitle?: string
  posts?: BlogPost[]
  className?: string
}

// Update the BlogShowcase component
const BlogShowcase: React.FC<BlogShowcaseProps> = ({
  title = "Explore Our Latest Insights",
  subtitle = "Discover tips and tricks for savvy travelers.",
  posts = [],
  className = "",
}) => {
  // Default blog posts if none are provided
  const defaultPosts: BlogPost[] = [
    {
      id: 1,
      title: "Maximize Your Airline Points",
      summary:
        "Learn how to strategically earn and redeem airline points for maximum value on your next trip. Discover insider techniques that frequent flyers use to get more from their miles and travel further for less.",
      category: "Airline",
      readTime: "5 min read",
      image: "/placeholder.svg?key=quq3l",
      slug: "/blog/maximize-airline-points",
    },
    {
      id: 2,
      title: "Best Credit Cards for Travel",
      summary:
        "Discover the top credit cards that offer exceptional travel rewards, perks, and benefits for frequent travelers. Compare sign-up bonuses, earning rates, and redemption options to find your perfect travel companion.",
      category: "Credit",
      readTime: "7 min read",
      image: "/travel-rewards-cards.png",
      slug: "/blog/best-credit-cards-travel",
    },
    {
      id: 3,
      title: "Top Hotels for Budget Travelers",
      summary:
        "Find out how to book luxury accommodations without breaking the bank using points, promotions, and insider strategies. Learn which hotel chains offer the best value and maximize elite status benefits.",
      category: "Hotels",
      readTime: "6 min read",
      image: "/luxury-hotel-room-with-view.png",
      slug: "/blog/budget-luxury-hotels",
    },
    {
      id: 4,
      title: "Hidden Gems: Underrated Destinations",
      summary:
        "Explore lesser-known travel destinations that offer incredible experiences without the crowds and high costs. Discover beautiful locations that haven't been overrun by tourism and offer authentic cultural experiences.",
      category: "Destinations",
      readTime: "5 min read",
      image: "/hidden-beach-paradise.png",
      slug: "/blog/hidden-gem-destinations",
    },
  ]

  const blogPosts = posts.length > 0 ? posts : defaultPosts

  return (
    <section
      className={`w-full max-w-[1440px] px-4 md:px-16 py-16 md:py-28 flex flex-col justify-start items-start gap-10 md:gap-20 overflow-hidden bg-[#ECFDF5] ${className}`}
    >
      <div className="w-full md:w-[768px] flex flex-col justify-start items-start gap-4">
        <div className="inline-flex justify-start items-center">
          <div className="text-stone-950 text-base font-bold font-['Inter'] leading-normal">Blog</div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start md:items-center gap-4 md:gap-6">
          <h2 className="self-stretch text-stone-950 text-3xl md:text-5xl font-bold leading-tight md:leading-[57.60px]">
            {title}
          </h2>
          <p className="self-stretch text-stone-950 text-base md:text-lg font-bold font-['Inter'] leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col justify-start items-start gap-8 md:gap-12">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          {blogPosts.map((post) => (
            <BlogPost key={post.id} post={post} />
          ))}
        </div>
      </div>

      <div className="self-stretch flex flex-col justify-start items-center md:items-end gap-4">
        <OutlinedGradientButton href="/blog">
          View all
        </OutlinedGradientButton>
      </div>
    </section>
  )
}

export default BlogShowcase 