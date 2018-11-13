'use strict'

const Board = require('../../models/board')

exports.IdToBoard = (req, res) => {
    const boardId = req.params.boardId

    // 0. Query Check
    const QueryCheck = () => {
        if (!boardId){
            return Promise.reject({
                message: "Query Error"
            })
        }
        else
            return Board.findOne({boardId: boardId})
    }

    // 1. Board return
    const Response = (board) => {
        if (board == null){
            return Promise.reject({
                message: "Can't find Board"
            })
        } else {
            return res.status(200).json({
                boardId: board.boardId,
                title: board.title,
                professor: board.professor,
                lecture: board.lecture
            })
        }
    }

    QueryCheck()
        .then(Response)
        .catch(err => {
            if (err) return res.status(500).json(err.message || err)
        })
}