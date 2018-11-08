'use strict'

const express = require('express')
const create = require('./create')
const detail = require('./detail')
const modify = require('./modify')
const setLecture = require('./setLecture')
const getLecture = require('./getLecture')
const login = require('./login')
const upload = require('../middlewares/multer')
const router = express.Router()

router.post('/create', upload.single('image'), create.UserCreate)
router.get('/detail', detail.UserDetail)
router.post('/modify', upload.single('image'), modify.UserModify)
router.post('/login', login.Login)
router.post('/setLecture', setLecture.SetLecture)
router.post('/getLecture', getLecture.GetLecture)

module.exports = router