import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getApplications, deleteApplication } from '../api/applications'
import AddApplicationForm from '../components/AddApplicationForm'
import StatusBadge from '../components/StatusBadge'

function Dashboard() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const apps = await getApplications()
        setApplications(apps)
      } catch (err) {
        console.error('Failed to fetch applications:', err)
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

  const handleAdd = (newApp) => {
    setApplications([newApp, ...applications])
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

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Job Tracker</h1>
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

      <main className="max-w-5xl mx-auto px-6 py-8">

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-gray-800' },
            { label: 'Applied', value: stats.applied, color: 'text-blue-600' },
            { label: 'Interview', value: stats.interview, color: 'text-yellow-600' },
            { label: 'Offer', value: stats.offer, color: 'text-green-600' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Applications</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            + Add Application
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No applications yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Click "Add Application" to get started
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {applications.map(app => (
              <div
                key={app.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{app.company}</p>
                  <p className="text-sm text-gray-500">{app.role}</p>
                  {app.notes && (
                    <p className="text-xs text-gray-400 mt-1">{app.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={app.status} />
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {showForm && (
        <AddApplicationForm
          onAdd={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}

    </div>
  )
}

export default Dashboard