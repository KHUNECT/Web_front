'use strict'

const express = require('express')
const all = require('./all')
const router = express.Router()

router.get('/all', all.ListAll)

module.exports = router