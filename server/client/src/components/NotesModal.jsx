import { useState, useEffect } from 'react'
import { getNotes, createNote, deleteNote } from '../api/applications'

function NotesModal({ application, onClose }) {
  const [notes, setNotes] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes(application.id)
        setNotes(data)
      } catch (err) {
        console.error('Failed to fetch notes:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [application.id])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setSaving(true)
    try {
      const note = await createNote(application.id, content)
      setNotes([note, ...notes])
      setContent('')
    } catch (err) {
      console.error('Failed to add note:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (noteId) => {
    try {
      await deleteNote(application.id, noteId)
      setNotes(notes.filter(n => n.id !== noteId))
    } catch (err) {
      console.error('Failed to delete note:', err)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 max-h-screen overflow-y-auto">

        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Notes</h2>
            <p className="text-sm text-gray-500">{application.company} — {application.role}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleAdd} className="mb-6">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Add a note — interview feedback, follow-up reminders..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={saving || !content.trim()}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Adding...' : 'Add Note'}
          </button>
        </form>

        {loading ? (
          <div className="text-center py-8 text-gray-400 text-sm">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No notes yet — add your first one above
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map(note => (
              <div
                key={note.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-100"
              >
                <p className="text-sm text-gray-700">{note.content}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-400">{formatDate(note.createdAt)}</p>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default NotesModal