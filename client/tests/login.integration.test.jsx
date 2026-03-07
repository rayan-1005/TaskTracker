import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { MemoryRouter } from "react-router-dom"

// Mock modules before importing components
jest.mock("../../src/lib/api", () => ({
  default: {
    post: jest.fn(),
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}))

jest.mock("../../src/context/AuthContext", () => ({
  useAuth: () => ({
    login: jest.fn(),
    user: null,
    loading: false,
    isAdmin: false,
  }),
  AuthProvider: ({ children }) => children,
}))

jest.mock("../../src/components/ui/toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
  ToastProvider: ({ children }) => children,
}))

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}))

import LoginPage from "../../src/pages/LoginPage"

const renderLogin = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  )

// ─── Login Form Integration Tests ────────────────────────────────────────────

describe("LoginPage", () => {
  beforeEach(() => jest.clearAllMocks())

  it("renders email and password fields", () => {
    renderLogin()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it("shows validation error for empty email", async () => {
    renderLogin()
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument()
    })
  })

  it("shows validation error for invalid email format", async () => {
    renderLogin()
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "not-an-email" },
    })
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText("Enter a valid email")).toBeInTheDocument()
    })
  })

  it("shows validation error for empty password", async () => {
    renderLogin()
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText("Password is required")).toBeInTheDocument()
    })
  })

  it("has a link to the register page", () => {
    renderLogin()
    expect(screen.getByText("Create one")).toBeInTheDocument()
  })
})
