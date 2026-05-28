const express = require('express')
const router = express.Router({ mergeParams: true })
const authMiddleware = require('../middleware/authMiddleware')
const { getNotes, createNote, deleteNote } = require('../controllers/noteController')

router.use(authMiddleware)

router.get('/', getNotes)
router.post('/', createNote)
router.delete('/:noteId', deleteNote)

module.exports = router