import { create } from 'zustand'

const useAuthStore = create((set) => ({
  // Initial state
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  // Login action — saves token and user to state and localStorage
  login: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token, isAuthenticated: true })
  },

  // Logout action — clears everything
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  // Set user data
  setUser: (user) => set({ user })
}))

export default useAuthStore