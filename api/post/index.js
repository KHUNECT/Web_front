'use strict'

const express = require('express')
const create = require('./create')
const deletes =  require('./delete')
const modify = require('./modify')
const list = require('./list')
const recommend = require('./recommend')
const upload = require('../middlewares/multer')
const detail = require('./detail')
const addComment = require('./addComment')
const deleteComment = require('./deleteComment')
const router = express.Router()

router.use('/list', list)
router.post('/create',upload.single('image'), create.CreatePost)
router.post('/modify', modify.ModifyPost)
router.post('/delete', deletes.DeletePost)
router.post('/recommend', recommend.Recommend)
router.get('/detail', detail.Detail)
router.post('/addComment', addComment.addComment)
router.post('/deleteComment', deleteComment.DeleteComment)

module.exports = router