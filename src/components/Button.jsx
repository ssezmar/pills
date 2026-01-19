import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 hover:shadow-lg",
        {
          "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-purple-500/30": variant === "default",
          "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600": variant === "destructive",
          "border-2 border-purple-200 bg-white/80 backdrop-blur hover:bg-purple-50 hover:border-purple-300": variant === "outline",
          "hover:bg-purple-100/50": variant === "ghost",
          "bg-purple-100 text-purple-700 hover:bg-purple-200": variant === "secondary",
        },
        {
          "h-10 px-5 py-2": size === "default",
          "h-9 rounded-xl px-3 text-xs": size === "sm",
          "h-12 rounded-2xl px-8 text-base": size === "lg",
          "h-11 w-11": size === "icon",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
