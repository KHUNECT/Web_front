'use strict'

const express = require('express')
const create = require('./create')
const detail = require('./detail')
const detailByID = require('./detailByID')
const modify = require('./modify')
const findId = require('./findId')
const findPassword = require('./findPassword')
const setLecture = require('./setLecture')
const getLecture = require('./getLecture')
const login = require('./login')
const upload = require('../middlewares/multer')
const router = express.Router()

router.post('/create', upload.single('image'), create.UserCreate)
router.get('/detail', detail.UserDetail)
router.post('/detailByID', detailByID.UserDetailById)
router.post('/modify', upload.single('image'), modify.UserModify)
router.post('/login', login.Login)
router.post('/setLecture', setLecture.SetLecture)
router.post('/getLecture', getLecture.GetLecture)
router.post('/findId', findId.findId)
router.post('/findPassword', findPassword.findPassword)

module.exports = router