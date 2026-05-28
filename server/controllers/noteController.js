const prisma = require('../lib/prisma')

// GET /applications/:id/notes
const getNotes = async (req, res) => {
  try {
    const { id } = req.params

    // Make sure application belongs to this user
    const application = await prisma.application.findUnique({
      where: { id }
    })

    if (!application) {
      return res.status(404).json({ error: 'Application not found' })
    }

    if (application.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    const notes = await prisma.note.findMany({
      where: { applicationId: id },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ notes })

  } catch (error) {
    console.error('Get notes error:', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

// POST /applications/:id/notes
const createNote = async (req, res) => {
  try {
    const { id } = req.params
    const { content } = req.body

    if (!content) {
      return res.status(400).json({ error: 'Content is required' })
    }

    const application = await prisma.application.findUnique({
      where: { id }
    })

    if (!application) {
      return res.status(404).json({ error: 'Application not found' })
    }

    if (application.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    const note = await prisma.note.create({
      data: {
        applicationId: id,
        content
      }
    })

    res.status(201).json({ message: 'Note added', note })

  } catch (error) {
    console.error('Create note error:', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

// DELETE /applications/:id/notes/:noteId
const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: { application: true }
    })

    if (!note) {
      return res.status(404).json({ error: 'Note not found' })
    }

    if (note.application.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    await prisma.note.delete({ where: { id: noteId } })

    res.json({ message: 'Note deleted' })

  } catch (error) {
    console.error('Delete note error:', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

module.exports = { getNotes, createNote, deleteNote }