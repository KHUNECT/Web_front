'use strict'

const express = require('express')
const boardList = require('./boardList')
const router = express.Router()


router.get('/:boardId/:page', boardList.BoardList)

module.exports = router