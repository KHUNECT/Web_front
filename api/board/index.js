'use strict'

const express = require('express')
const boardList = require('./boardList')
const idToBoard = require('./idToBoard')
const router = express.Router()


router.get('/:boardId', boardList.BoardList)
router.get('/idToBoard', idToBoard.IdToBoard)

module.exports = router