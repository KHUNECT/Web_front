'use strict'

const express = require('express')
const create = require('./create')
const upload = require('../middlewares/multer')
const router = express.Router()

router.get('/list', (req, res)=>{res.status(200).json({test:true})})
router.post('/create',upload.single('image'), create.CreatePost)

module.exports = router