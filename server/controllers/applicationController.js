const prisma = require('../lib/prisma')

// CREATE — POST /applications
const createApplication = async (req, res) => {
  try {
    const { company, role, status, jobUrl, appliedAt, notes } = req.body

    if (!company || !role) {
      return res.status(400).json({ error: 'Company and role are required' })
    }

    const application = await prisma.application.create({
      data: {
        userId: req.userId,   // comes from authMiddleware
        company,
        role,
        status: status || 'saved',
        jobUrl: jobUrl || null,
        appliedAt: appliedAt ? new Date(appliedAt) : null,
        notes: notes || null
      }
    })

    res.status(201).json({ message: 'Application created', application })

  } catch (error) {
    console.error('Create application error:', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

// READ ALL — GET /applications
const getApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.userId },  // only fetch THIS user's applications
      orderBy: { createdAt: 'desc' }  // newest first
    })

    res.json({ applications })

  } catch (error) {
    console.error('Get applications error:', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

// READ ONE — GET /applications/:id
const getApplication = async (req, res) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id }
    })

    if (!application) {
      return res.status(404).json({ error: 'Application not found' })
    }

    // Make sure this application belongs to the logged-in user
    if (application.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    res.json({ application })

  } catch (error) {
    console.error('Get application error:', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

// UPDATE — PUT /applications/:id
const updateApplication = async (req, res) => {
  try {
    const { company, role, status, jobUrl, appliedAt, notes } = req.body

    // First check it exists and belongs to this user
    const existing = await prisma.application.findUnique({
      where: { id: req.params.id }
    })

    if (!existing) {
      return res.status(404).json({ error: 'Application not found' })
    }

    if (existing.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    const application = await prisma.application.update({
      where: { id: req.params.id },
      data: {
        company: company || existing.company,
        role: role || existing.role,
        status: status || existing.status,
        jobUrl: jobUrl !== undefined ? jobUrl : existing.jobUrl,
        appliedAt: appliedAt ? new Date(appliedAt) : existing.appliedAt,
        notes: notes !== undefined ? notes : existing.notes
      }
    })

    res.json({ message: 'Application updated', application })

  } catch (error) {
    console.error('Update application error:', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

// DELETE — DELETE /applications/:id
const deleteApplication = async (req, res) => {
  try {
    const existing = await prisma.application.findUnique({
      where: { id: req.params.id }
    })

    if (!existing) {
      return res.status(404).json({ error: 'Application not found' })
    }

    if (existing.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    await prisma.application.delete({
      where: { id: req.params.id }
    })

    res.json({ message: 'Application deleted' })

  } catch (error) {
    console.error('Delete application error:', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

module.exports = {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication
}