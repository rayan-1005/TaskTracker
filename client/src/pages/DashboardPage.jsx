import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CheckSquare, Clock, Users, ArrowRight, TrendingUp } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent } from "@/components/ui/primitives"
import { Badge } from "@/components/ui/primitives"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"

const StatCard = ({ label, value, icon: Icon, delay }) => (
  <Card className={`animate-fade-in stagger-${delay}`}>
    <CardContent className="p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <p className="font-display text-3xl font-bold">{value}</p>
    </CardContent>
  </Card>
)

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskRes = await api.get("/tasks")
        setTasks(taskRes.data.tasks || [])
        if (isAdmin) {
          const userRes = await api.get("/users")
          setUsers(userRes.data.users || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isAdmin])

  // Build a userId → email map for quick lookup
  const userMap = users.reduce((acc, u) => {
    acc[u.id] = u.email
    return acc
  }, {})

  const pending = tasks.filter((t) => t.status === "pending").length
  const completed = tasks.filter((t) => t.status === "completed").length
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0
  const recentTasks = tasks.slice(0, 5)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="h-5 w-5 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="font-display text-2xl font-semibold mb-1">
          Good {getTimeOfDay()}, {user?.email?.split("@")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          {tasks.length === 0
            ? "No tasks yet"
            : `${pending} pending task${pending !== 1 ? "s" : ""} across all users`}
        </p>
      </div>

      {/* Stats */}
      <div className={`grid gap-4 mb-8 ${isAdmin ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3"}`}>
        <StatCard label="Total Tasks" value={tasks.length} icon={CheckSquare} delay={1} />
        <StatCard label="Pending" value={pending} icon={Clock} delay={2} />
        <StatCard label="Completed" value={completed} icon={TrendingUp} delay={3} />
        {isAdmin && <StatCard label="Total Users" value={users.length} icon={Users} delay={4} />}
      </div>

      {/* Progress bar */}
      {tasks.length > 0 && (
        <Card className="mb-8 animate-fade-in stagger-4">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Completion Rate</span>
              <span className="font-display font-semibold text-sm">{completionRate}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full transition-all duration-700"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Tasks */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-base">Recent Tasks</h2>
          <Link to="/tasks">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckSquare className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No tasks yet</p>
              <Link to="/tasks">
                <Button size="sm" className="mt-4">Create your first task</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3.5 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1 min-w-0 mr-3">
                  <p className={`text-sm font-medium truncate ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {/* Show owner email for admin */}
                    {isAdmin && task.userId && userMap[task.userId] && (
                      <span className="text-xs font-mono text-muted-foreground truncate">
                        {userMap[task.userId]}
                      </span>
                    )}
                    {task.description && !isAdmin && (
                      <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                    )}
                  </div>
                </div>
                <Badge variant={task.status === "completed" ? "completed" : "pending"}>
                  {task.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return "morning"
  if (h < 17) return "afternoon"
  return "evening"
}