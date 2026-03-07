import { useEffect, useState } from "react"
import { Trash2, Shield, User, Search, CheckSquare, Clock, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Input, Badge } from "@/components/ui/primitives"
import { Dialog, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api"

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, taskRes] = await Promise.all([
          api.get("/users"),
          api.get("/tasks"),
        ])
        setUsers(userRes.data.users || [])
        setAllTasks(taskRes.data.tasks || [])
      } catch (err) {
        toast({ message: "Failed to load data", type: "error" })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteId}`)
      setUsers((prev) => prev.filter((u) => u.id !== deleteId))
      toast({ message: "User deleted", type: "success" })
    } catch (err) {
      toast({ message: "Failed to delete user", type: "error" })
    } finally {
      setDeleteId(null)
    }
  }

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const userTasks = selectedUser
    ? allTasks.filter((t) => t.userId === selectedUser.id)
    : []

  const pendingCount = userTasks.filter((t) => t.status === "pending").length
  const completedCount = userTasks.filter((t) => t.status === "completed").length

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-semibold mb-0.5">Users</h1>
          <p className="text-sm text-muted-foreground">{users.length} registered</p>
        </div>
        <Badge variant="secondary" className="gap-1.5 py-1 px-2.5">
          <Shield className="h-3 w-3" /> Admin view
        </Badge>
      </div>

      {/* Search */}
      <div className="relative mb-5 animate-fade-in stagger-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Users list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="h-5 w-5 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <User className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="space-y-2 animate-fade-in stagger-2">
          {filtered.map((u, i) => {
            const taskCount = allTasks.filter((t) => t.userId === u.id).length
            return (
              <div
                key={u.id}
                className="group flex items-center justify-between p-4 rounded-lg border border-border hover:border-foreground/20 transition-all cursor-pointer"
                style={{ animationDelay: `${i * 0.04}s` }}
                onClick={() => setSelectedUser(u)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium">
                      {u.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{u.email}</p>
                      {u.id === currentUser?.id && (
                        <Badge variant="secondary" className="text-xs py-0">you</Badge>
                      )}
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">
                      {taskCount} task{taskCount !== 1 ? "s" : ""} · Joined {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                    {u.role}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                  {u.id !== currentUser?.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); setDeleteId(u.id) }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* User Tasks Dialog */}
      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} className="max-w-lg">
        {selectedUser && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <span className="font-medium">{selectedUser.email[0].toUpperCase()}</span>
              </div>
              <div>
                <h2 className="font-display font-semibold text-base">{selectedUser.email}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant={selectedUser.role === "admin" ? "default" : "secondary"}>
                    {selectedUser.role}
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">
                    {userTasks.length} tasks · {pendingCount} pending · {completedCount} done
                  </span>
                </div>
              </div>
            </div>

            {userTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckSquare className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No tasks yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {userTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border"
                  >
                    <div className={`mt-0.5 h-4 w-4 rounded shrink-0 border flex items-center justify-center ${
                      task.status === "completed"
                        ? "bg-foreground border-foreground"
                        : "border-border"
                    }`}>
                      {task.status === "completed" && (
                        <svg className="h-4 w-4 text-background" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{task.description}</p>
                      )}
                    </div>
                    <Badge variant={task.status === "completed" ? "completed" : "pending"}>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete user?</DialogTitle>
        <p className="text-sm text-muted-foreground mb-2">
          This will permanently delete the user and all their tasks.
        </p>
        <p className="text-xs font-mono text-muted-foreground mb-6">This action cannot be undone.</p>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleDelete} className="flex-1">Delete user</Button>
          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
        </div>
      </Dialog>
    </div>
  )
}