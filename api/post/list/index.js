'use strict'

const express = require('express')
const all = require('./all')
const allForUser = require('./allforuser')
const hot = require('./hot')
const router = express.Router()

router.get('/all', all.ListAll)
router.post('/allforuser', allForUser.AllForUser)
router.get('/hot', hot.Hot)

module.exports = router