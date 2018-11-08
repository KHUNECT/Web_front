'use strict'

const Post = require('../../../models/post')
const User = require('../../../models/user')
const Board = require('../../../models/board')

exports.ListAll = (req, res) => {
    const page = Number(req.query.page) || 1
    const item = Number(req.query.item) || 10

    // 0. 쿼리 실행
    const Querying = () => {
        return Post.find().skip((page - 1) * item).limit(item)
    }

    // 1. 전송
    const Response = (posts) =>{
        return res.status(200).json(posts)
    }

    Querying()
        .then(Response)
        .catch((err) => {if (err) return res.status(500).json({message: "MongoDB error"})})
}