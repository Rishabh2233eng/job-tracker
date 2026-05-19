import useAuthStore from '../store/authStore'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Job Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Hey, {user?.name || 'there'} 👋
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Your Applications
        </h2>
        <p className="text-gray-500">
          Dashboard coming together — applications list next!
        </p>
      </main>
    </div>
  )
}

export default Dashboard