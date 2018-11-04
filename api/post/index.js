'use strict'

const express = require('express')
const create = require('./create')
const deletes =  require('./delete')
const modify = require('./modify')
const list = require('./list')
const upload = require('../middlewares/multer')
const router = express.Router()

router.use('/list', list)
router.post('/create',upload.single('image'), create.CreatePost)
router.post('/modify', modify.ModifyPost)
router.post('/delete', deletes.DeletePost)

module.exports = router