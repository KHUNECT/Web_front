'use strict'

const express = require('express')
const create = require('./create')
const detail = require('./detail')
const router = express.Router()

router.post('/create', create.UserCreate)
router.get('/detail', detail.UserDetail)

module.exports = router