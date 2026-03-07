import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const Select = ({ value, onChange, children, className, ...props }) => (
  <div className={cn("relative", className)}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-1 pr-8 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
  </div>
)

const SelectOption = ({ value, children }) => (
  <option value={value}>{children}</option>
)

export { Select, SelectOption }
