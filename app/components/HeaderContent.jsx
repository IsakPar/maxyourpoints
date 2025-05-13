const HeaderContent = ({
  title = "Unlock Your Travel Potential with MaxYourPoints",
  description = "Discover expert tips on maximizing your travel rewards, from airline points to hotel deals that offer incredible value. Learn how to strategically accumulate and utilize your rewards for the best possible experiences. Join our vibrant community of savvy travelers and start your journey towards smarter, more efficient travel today. Share your experiences, ask questions, and gain insights that will transform the way you explore the world!",
}) => {
  return (
    <div className="header-content self-stretch px-16 py-20 inline-flex justify-start items-start gap-20 overflow-hidden">
      <div className="flex-1 inline-flex flex-col justify-start items-start">
        <div className="self-stretch justify-start text-stone-950 text-6xl leading-[67.20px]">{title}</div>
      </div>
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-8">
        <div className="self-stretch justify-start text-stone-950 text-lg font-bold font-['Inter'] leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  )
}

export default HeaderContent
