// Input
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
))
Input.displayName = "Input"

// Label
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-xs font-medium leading-none text-muted-foreground uppercase tracking-wider", className)}
    {...props}
  />
))
Label.displayName = "Label"

// Badge
const badgeVariants = {
  default: "bg-foreground text-background",
  secondary: "bg-secondary text-secondary-foreground border border-border",
  destructive: "bg-destructive/10 text-destructive border border-destructive/20",
  outline: "border border-border text-foreground",
  pending: "bg-secondary text-muted-foreground border border-border",
  completed: "bg-foreground/8 text-foreground border border-foreground/20",
}

const Badge = ({ className, variant = "default", ...props }) => (
  <span
    className={cn(
      "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium font-mono",
      badgeVariants[variant] || badgeVariants.default,
      className
    )}
    {...props}
  />
)

// Separator
const Separator = ({ className, orientation = "horizontal", ...props }) => (
  <div
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      className
    )}
    {...props}
  />
)

// Textarea
const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none",
      className
    )}
    ref={ref}
    {...props}
  />
))
Textarea.displayName = "Textarea"

// Card components
const Card = ({ className, ...props }) => (
  <div className={cn("rounded-lg border border-border bg-card text-card-foreground", className)} {...props} />
)

const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1 p-5", className)} {...props} />
)

const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("font-display font-semibold text-base leading-none", className)} {...props} />
)

const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-xs text-muted-foreground", className)} {...props} />
)

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-5 pt-0", className)} {...props} />
)

const CardFooter = ({ className, ...props }) => (
  <div className={cn("flex items-center p-5 pt-0", className)} {...props} />
)

export { Input, Label, Badge, Separator, Textarea, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
