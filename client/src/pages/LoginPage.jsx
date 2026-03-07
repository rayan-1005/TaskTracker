import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CheckSquare, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui/primitives"
import api from "@/lib/api"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast } = useToast()

  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email"
    if (!form.password) e.password = "Password is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await api.post("/auth/login", form)
      login(res.data.token, res.data.user)
      toast({ message: "Welcome back!", type: "success" })
      navigate("/dashboard")
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials"
      toast({ message: msg, type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-foreground text-background flex-col justify-between p-12">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-background rounded-md flex items-center justify-center">
            <CheckSquare className="h-5 w-5 text-foreground" />
          </div>
          <span className="font-display font-semibold text-lg text-background">TaskTracker</span>
        </div>
        <div>
          <h1 className="font-display text-5xl font-bold text-background leading-tight mb-4">
            Manage tasks.<br />Ship faster.
          </h1>
          <p className="text-background/60 text-base leading-relaxed">
            A clean, minimal workspace for teams who value clarity over clutter.
          </p>
        </div>
        <p className="text-background/30 text-xs font-mono">TASK TRACKER v1.0</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-7 w-7 bg-foreground rounded-md flex items-center justify-center">
              <CheckSquare className="h-4 w-4 text-background" />
            </div>
            <span className="font-display font-semibold">TaskTracker</span>
          </div>

          <div className="mb-8">
            <h2 className="font-display font-semibold text-2xl mb-1">Sign in</h2>
            <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                autoComplete="email"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={errors.password ? "border-destructive focus-visible:ring-destructive pr-10" : "pr-10"}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-background border-t-transparent animate-spin" />
                  Signing in...
                </span>
              ) : "Sign in"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-foreground font-medium hover:underline underline-offset-4">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
