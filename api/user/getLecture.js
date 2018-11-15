'use strict'

const User = require('../../models/user')
const Board = require('../../models/board')

exports.GetLecture = (req, res) => {
    const userId = req.body.userId

    // 0. 쿼리 체크
    const QueryCheck = () =>{
        if (!userId){
            return Promise.reject({
                message: "Query Error"
            })
        }
        else
            return User.findOne({_id: userId})
    }

    // 1. User Check
    const UserCheck = (user) => {
        if (user==null){
            return Promise.reject({
                message: "Can't Find User"
            })
        }
        else {
            let lecture_nums = user.lectures.map(x => {return {boardId : x}})
            return Board.find().or(lecture_nums)
        }
    }

    // 2. Return Lecture Board
    const LectureBoard = (lectures) => {
        return res.status(200).json(lectures.map(x => {return {
            boardId: x.boardId,
            title: x.title,
            professor: x.professor
        }}))
    }

    QueryCheck()
        .then(UserCheck)
        .then(LectureBoard)
        .catch(err => {
            if (err) return res.status(500).json(err.message || err)
        })
}