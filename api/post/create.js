'use strict'

const Post = require('../../models/post')
const Board = require('../../models/board')
const User = require('../../models/user')

exports.CreatePost = (req, res) => {
    const writerId = req.body.writerId
    const title = req.body.title
    const context = req.body.context
    const boardId = req.body.boardId

    // 0. 쿼리 확인
    const QueryCheck = () => {
        return new Promise((resolve, reject) => {
            if (!writerId || !title || !context || !boardId){
                return reject({
                    message: 'query error'
                })
            }
        })
    }

    // 1. writerId 체크
    const WriterCheck = () => {
        return User.findOne({userId: writerId})
    }

    // 2. boardId 체크
    const BoardCheck = (writer) => {
        if (writer != null) {
            return reject({
                message: 'User Not Exists'
            })
        }
        return Board.findOne({boardId: boardId})
    }

    // 3. 포스트 생성
    const Posting = (board) => {
        if (board != null) {
            return reject({
                message: 'Board Not Exists'
            })
        }

        Post.create({
            writerId: writerId,
            title: title,
            context: context,
            boardId: boardId
        }, (err, data) => {
            if (err) throw err
            return res.status(200).json({message: 'Created'})
        })
    }

    QueryCheck()
        .then(WriterCheck)
        .then(BoardCheck)
        .then(Posting)
        .catch((err) => {
            return res.status(500).json(err)
        })
}