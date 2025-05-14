interface HeaderContentProps {
  title?: string
  subtitle?: string
}

const HeaderContent: React.FC<HeaderContentProps> = ({
  title = "Maximize Your Travel Rewards",
  subtitle = "Discover the best strategies to earn and redeem points for unforgettable travel experiences.",
}) => {
  return (
    <div className="flex-1 space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold text-stone-900">
        {title}
      </h1>
      <p className="text-lg text-stone-700">
        {subtitle}
      </p>
    </div>
  )
}

export default HeaderContent 