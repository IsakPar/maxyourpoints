import { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface ButtonCustomProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

const ButtonCustom: React.FC<ButtonCustomProps> = ({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-stone-900 text-white hover:bg-stone-800": variant === "default",
          "border border-stone-200 bg-white text-stone-900 hover:bg-gray-50": variant === "outline",
          "hover:bg-stone-100 hover:text-stone-900": variant === "ghost",
        },
        {
          "h-10 px-4 py-2": size === "default",
          "h-9 px-3": size === "sm",
          "h-11 px-8": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default ButtonCustom 