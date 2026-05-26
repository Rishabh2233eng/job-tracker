import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import useAuthStore from '../store/authStore'
import { getApplications, updateApplication, deleteApplication } from '../api/applications'
import KanbanColumn from '../components/KanbanColumn'
import StatusBadge from '../components/StatusBadge'

const STATUSES = ['saved', 'applied', 'interview', 'offer', 'rejected']

function KanbanBoard() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeApp, setActiveApp] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  )

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const apps = await getApplications()
        setApplications(apps)
      } catch (err) {
        console.error('Failed to fetch:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchApps()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return
    try {
      await deleteApplication(id)
      setApplications(applications.filter(app => app.id !== id))
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  const handleDragStart = (event) => {
    const app = applications.find(a => a.id === event.active.id)
    setActiveApp(app)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveApp(null)

    if (!over) return

    const draggedApp = applications.find(a => a.id === active.id)
    const newStatus = over.id

    if (!draggedApp || draggedApp.status === newStatus) return
    if (!STATUSES.includes(newStatus)) return

    // Optimistic update — update UI instantly
    setApplications(applications.map(app =>
      app.id === active.id ? { ...app, status: newStatus } : app
    ))

    // Then update backend
    try {
      await updateApplication(active.id, { status: newStatus })
    } catch (err) {
      // Roll back if backend fails
      console.error('Failed to update status:', err)
      setApplications(applications)
    }
  }

  const getColumnApps = (status) =>
    applications.filter(app => app.status === status)

  return (
    <div className="min-h-screen bg-gray-50">

      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-semibold text-gray-800">Job Tracker</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              List view
            </button>
            <button
              className="text-sm text-blue-600 font-medium px-3 py-1.5 rounded-lg bg-blue-50"
            >
              Board view
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hey, {user?.name} 👋</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Kanban Board</h2>
          <p className="text-sm text-gray-400">Drag cards to update status</p>
        </div>

        {loading ? (
          <div className="flex gap-4">
            {STATUSES.map(s => (
              <div key={s} className="flex-1 bg-gray-100 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STATUSES.map(status => (
                <KanbanColumn
                  key={status}
                  status={status}
                  applications={getColumnApps(status)}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            <DragOverlay>
              {activeApp && (
                <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-lg w-48">
                  <p className="font-medium text-gray-800 text-sm">{activeApp.company}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activeApp.role}</p>
                  <div className="mt-2">
                    <StatusBadge status={activeApp.status} />
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}
      </main>

    </div>
  )
}

export default KanbanBoard