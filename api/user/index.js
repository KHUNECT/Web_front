'use strict'

const express = require('express')
const create = require('./create')
const detail = require('./detail')
const upload = require('../middlewares/multer')
const router = express.Router()

router.post('/create', upload.single('image'), create.UserCreate)
router.get('/detail', detail.UserDetail)

module.exports = router