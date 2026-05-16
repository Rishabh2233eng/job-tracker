const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication
} = require('../controllers/applicationController')

// All routes here are protected — authMiddleware runs first
router.use(authMiddleware)

router.post('/', createApplication)
router.get('/', getApplications)
router.get('/:id', getApplication)
router.put('/:id', updateApplication)
router.delete('/:id', deleteApplication)

module.exports = router