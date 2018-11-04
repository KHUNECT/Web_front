'use strict'

const User = require('../../models/user')
const Post = require('../../models/post')
const Board = require('../../models/board')

exports.SetLecture = (req, res) => {
    const userId = req.body.userId
    const klasId = req.body.klasId
    const klasPassword = req.body.klasPassword

    let options = {

    }
}