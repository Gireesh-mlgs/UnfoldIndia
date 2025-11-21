import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "backdrop-blur-[20px] bg-white/25 border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:bg-white/35 hover:backdrop-blur-[25px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
        destructive:
          "backdrop-blur-[20px] bg-destructive/25 border border-destructive/30 text-destructive-foreground shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:bg-destructive/35 hover:backdrop-blur-[25px]",
        outline:
          "backdrop-blur-[20px] bg-white/15 border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:bg-white/25 hover:backdrop-blur-[25px]",
        secondary:
          "backdrop-blur-[20px] bg-secondary/25 border border-secondary/30 text-secondary-foreground shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:bg-secondary/35 hover:backdrop-blur-[25px]",
        ghost: "backdrop-blur-[15px] bg-transparent hover:bg-white/20 hover:backdrop-blur-[20px]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
