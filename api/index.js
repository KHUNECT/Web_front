'use strict'

const express = require('express')
const router = express.Router()

router.get('/test', (req, res)=>{res.status(200).json({test:true})})
router.use('/user', require('./user'))

module.exports = router