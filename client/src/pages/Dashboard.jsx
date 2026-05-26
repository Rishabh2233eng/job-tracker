import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getApplications, deleteApplication } from '../api/applications'
import AddApplicationForm from '../components/AddApplicationForm'
import StatusBadge from '../components/StatusBadge'

const STATUS_FILTERS = ['all', 'saved', 'applied', 'interview', 'offer', 'rejected']

function Dashboard() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

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

  const filtered = applications
    .filter(app => statusFilter === 'all' || app.status === statusFilter)
    .filter(app => app.company.toLowerCase().includes(search.toLowerCase()) ||
                   app.role.toLowerCase().includes(search.toLowerCase()))

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-semibold text-gray-800">Job Tracker</h1>
          <div className="flex gap-2">
            <button
              className="text-sm text-blue-600 font-medium px-3 py-1.5 rounded-lg bg-blue-50"
            >
              List view
            </button>
            <button
              onClick={() => navigate('/board')}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100"
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Applications</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            + Add Application
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by company or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              {applications.length === 0 ? 'No applications yet' : 'No results found'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {applications.length === 0
                ? 'Click "Add Application" to get started'
                : 'Try a different search or filter'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {filtered.map(app => (
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
                  <p className="text-xs text-gray-300 mt-1">
                    Added {formatDate(app.createdAt)}
                  </p>
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