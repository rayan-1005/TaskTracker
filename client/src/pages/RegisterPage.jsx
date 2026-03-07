import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CheckSquare, Eye, EyeOff, Check, X } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui/primitives"
import api from "@/lib/api"

const rules = [
  { label: "8+ characters", test: (p) => p.length >= 8 },
  { label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Number", test: (p) => /\d/.test(p) },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email"
    if (!form.password) e.password = "Password is required"
    else if (!rules.every((r) => r.test(form.password))) e.password = "Password doesn't meet requirements"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await api.post("/auth/register", form)
      toast({ message: "Account created! Please sign in.", type: "success" })
      navigate("/login")
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed"
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
            Start tracking.<br />Stay focused.
          </h1>
          <p className="text-background/60 text-base leading-relaxed">
            Create your account and get organized in seconds.
          </p>
        </div>
        <p className="text-background/30 text-xs font-mono">TASK TRACKER v1.0</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-7 w-7 bg-foreground rounded-md flex items-center justify-center">
              <CheckSquare className="h-4 w-4 text-background" />
            </div>
            <span className="font-display font-semibold">TaskTracker</span>
          </div>

          <div className="mb-8">
            <h2 className="font-display font-semibold text-2xl mb-1">Create account</h2>
            <p className="text-sm text-muted-foreground">Fill in your details to get started</p>
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
                className={errors.email ? "border-destructive" : ""}
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
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className={errors.password ? "border-destructive pr-10" : "pr-10"}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength indicators */}
              {(passwordFocused || form.password) && (
                <div className="grid grid-cols-2 gap-1 pt-1">
                  {rules.map((rule) => {
                    const passed = rule.test(form.password)
                    return (
                      <div key={rule.label} className="flex items-center gap-1.5">
                        {passed
                          ? <Check className="h-3 w-3 text-foreground shrink-0" />
                          : <X className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                        }
                        <span className={`text-xs ${passed ? "text-foreground" : "text-muted-foreground/60"}`}>
                          {rule.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
              {errors.password && !passwordFocused && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-background border-t-transparent animate-spin" />
                  Creating account...
                </span>
              ) : "Create account"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-foreground font-medium hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
