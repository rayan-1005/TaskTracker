import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { Button } from "../../src/components/ui/button"
import { Badge } from "../../src/components/ui/primitives"

// ─── Button Component Tests ───────────────────────────────────────────────────

describe("Button component", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText("Click me"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("is disabled when disabled prop is passed", () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByText("Disabled")).toBeDisabled()
  })

  it("renders outline variant with correct text", () => {
    render(<Button variant="outline">Outline</Button>)
    expect(screen.getByText("Outline")).toBeInTheDocument()
  })
})

// ─── Badge Component Tests ────────────────────────────────────────────────────

describe("Badge component", () => {
  it("renders with correct text", () => {
    render(<Badge>pending</Badge>)
    expect(screen.getByText("pending")).toBeInTheDocument()
  })

  it("renders completed variant", () => {
    render(<Badge variant="completed">completed</Badge>)
    const badge = screen.getByText("completed")
    expect(badge).toBeInTheDocument()
  })

  it("renders destructive variant", () => {
    render(<Badge variant="destructive">error</Badge>)
    expect(screen.getByText("error")).toBeInTheDocument()
  })
})
