'use strict'

const express = require('express')
const all = require('./all')
const allForUser = require('./allforuser')
const router = express.Router()

router.get('/all', all.ListAll)
router.post('/allforuser', allForUser.AllForUser)

module.exports = router