
"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  color?: "primary" | "white" | "gray"
}

const LoadingSpinner = ({ 
  size = "md", 
  className,
  color = "primary" 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  }

  const colorClasses = {
    primary: "border-[#0A8E81] border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-gray-300 border-t-transparent"
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  )
}

export default LoadingSpinner
