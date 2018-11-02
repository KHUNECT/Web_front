'use strict'

const express = require('express')
const create = require('./create')
const deletes =  require('./delete')
const upload = require('../middlewares/multer')
const router = express.Router()

router.get('/list', (req, res)=>{res.status(200).json({test:true})})
router.post('/create',upload.single('image'), create.CreatePost)
router.post('/delete', deletes.DeletePost)

module.exports = router