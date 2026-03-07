import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, CheckSquare, Search } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input, Label, Badge, Textarea } from "@/components/ui/primitives"
import { Select, SelectOption } from "@/components/ui/select"
import { Dialog, DialogTitle } from "@/components/ui/dialog"
import api from "@/lib/api"

const EMPTY_FORM = { title: "", description: "", status: "pending" }

export default function TasksPage() {
  const { toast } = useToast()
  const { isAdmin } = useAuth()
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editTask, setEditTask] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const fetchData = async () => {
    try {
      const taskRes = await api.get("/tasks")
      setTasks(taskRes.data.tasks || [])
      if (isAdmin) {
        const userRes = await api.get("/users")
        setUsers(userRes.data.users || [])
      }
    } catch (err) {
      toast({ message: "Failed to load tasks", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // userId → email lookup
  const userMap = users.reduce((acc, u) => {
    acc[u.id] = u.email
    return acc
  }, {})

  const openCreate = () => {
    setEditTask(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setDialogOpen(true)
  }

  const openEdit = (task) => {
    setEditTask(task)
    setForm({ title: task.title, description: task.description || "", status: task.status })
    setErrors({})
    setDialogOpen(true)
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = "Title is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      if (editTask) {
        const res = await api.put(`/tasks/${editTask.id}`, form)
        setTasks((prev) => prev.map((t) => (t.id === editTask.id ? res.data.task : t)))
        toast({ message: "Task updated", type: "success" })
      } else {
        const res = await api.post("/tasks", form)
        setTasks((prev) => [res.data.task, ...prev])
        toast({ message: "Task created", type: "success" })
      }
      setDialogOpen(false)
    } catch (err) {
      toast({ message: err.response?.data?.message || "Something went wrong", type: "error" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${deleteId}`)
      setTasks((prev) => prev.filter((t) => t.id !== deleteId))
      toast({ message: "Task deleted", type: "success" })
    } catch (err) {
      toast({ message: "Failed to delete task", type: "error" })
    } finally {
      setDeleteId(null)
    }
  }

  const toggleStatus = async (task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending"
    try {
      const res = await api.put(`/tasks/${task.id}`, { status: newStatus })
      setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data.task : t)))
    } catch (err) {
      toast({ message: "Failed to update status", type: "error" })
    }
  }

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "all" || t.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-semibold mb-0.5">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            {tasks.length} total · {tasks.filter(t => t.status === "pending").length} pending
            {isAdmin && ` · all users`}
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> New task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 animate-fade-in stagger-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={filterStatus} onChange={setFilterStatus} className="w-32">
          <SelectOption value="all">All</SelectOption>
          <SelectOption value="pending">Pending</SelectOption>
          <SelectOption value="completed">Completed</SelectOption>
        </Select>
      </div>

      {/* Task list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="h-5 w-5 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <CheckSquare className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {search || filterStatus !== "all" ? "No tasks match your filters" : "No tasks yet — create your first one"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((task, i) => (
            <div
              key={task.id}
              className="group flex items-start gap-3 p-4 rounded-lg border border-border hover:border-foreground/20 transition-all animate-fade-in"
              style={{ animationDelay: `${i * 0.04}s`, opacity: 0 }}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleStatus(task)}
                className={`mt-0.5 h-4 w-4 rounded shrink-0 border transition-all ${
                  task.status === "completed"
                    ? "bg-foreground border-foreground"
                    : "border-border hover:border-foreground"
                }`}
              >
                {task.status === "completed" && (
                  <svg className="h-4 w-4 text-background" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{task.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {/* Owner email for admin */}
                  {isAdmin && task.userId && userMap[task.userId] && (
                    <span className="text-xs font-mono text-muted-foreground/70">
                      {userMap[task.userId]}
                    </span>
                  )}
                  <span className="text-xs font-mono text-muted-foreground/40">
                    {new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Badge variant={task.status === "completed" ? "completed" : "pending"} className="mr-1">
                  {task.status}
                </Badge>
                <Button variant="ghost" size="icon" onClick={() => openEdit(task)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(task.id)}
                  className="hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editTask ? "Edit task" : "New task"}</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={errors.title ? "border-destructive" : ""}
              autoFocus
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Description <span className="text-muted-foreground/50 normal-case tracking-normal font-normal">(optional)</span></Label>
            <Textarea
              placeholder="Add more details..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onChange={(val) => setForm({ ...form, status: val })}>
              <SelectOption value="pending">Pending</SelectOption>
              <SelectOption value="completed">Completed</SelectOption>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Saving..." : editTask ? "Save changes" : "Create task"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete task?</DialogTitle>
        <p className="text-sm text-muted-foreground mb-6">This action cannot be undone.</p>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleDelete} className="flex-1">Delete</Button>
          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
        </div>
      </Dialog>
    </div>
  )
}