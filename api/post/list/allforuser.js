'use strict'

const Post = require('../../../models/post')
const User = require('../../../models/user')
const Board = require('../../../models/board')

exports.AllForUser = (req, res) => {
    const userId = req.body.userId
    const page = Number(req.body.page) || 1
    const item = Number(req.body.item) || 5

    // 0. Query Check
    const QueryCheck = () =>{
        if (!userId){
            return Promise.reject({
                message: "Query Error"
            })
        }
        return User.findOne({_id: userId}).lean()
    }

    // 1. User Check
    const UserCheck = (user) => {
        return new Promise((resolve, reject) => {
            if (user == null) {
                return reject({
                    message: "Can`t find User"
                })
            }
            return resolve(user.lectures)
        })
    }

    // 2. Lecture Check
    const LectureCheck = async (lectures) => {
        if (lectures.length == 0){
            return Promise.reject({message: "아직 강의를 등록 하지 않으셨습니다. 강의를 등록 해 주세요."})
        }
        let newLectures = lectures.map(x => {return {boardId: x}})
        let posts = await Post.find().or(newLectures).sort('-createdDate').skip((page-1)*item).limit(item).lean().exec()
        let newPosts = []
        for (let i = 0; i < posts.length; i++){
            let board = await Board.findOne({boardId: posts[i].boardId}).lean().exec()
            let user = await User.findOne({userId: posts[i].writerId}).lean().exec()
            newPosts.push({
                _id: posts[i]._id,
                title: posts[i].title,
                context: posts[i].context,
                date: posts[i].createdDate,
                recommend: posts[i].recommend,
                writerNickname: user.nickname,
                writerImage: user.resizedImage,
                boardId: board.boardId,
                boardTitle: board.title,
            })
        }
        return res.status(200).json(newPosts)
    }

    QueryCheck()
        .then(UserCheck)
        .then(LectureCheck)
        .catch(err => {
            if (err) return res.status(500).json(err)
        })
}