'use strict'

const Post = require('../../../models/post')
const User = require('../../../models/user')
const Board = require('../../../models/board')

exports.Hot = (req, res) => {

    // 0. 쿼리 실행
    const Querying = () => {
        let date = new Date()
        date.setDate(date.getDate()-7)
        return Post.find({createdDate: {$gte:date}}).or([{boardId: 'club'}, {boardId: 'contest'}, {boardId: 'trade'}, {boardId: 'groupbuying'}, {boardId: 'study'}, {boardId: 'hobby'}, {boardId: 'alba'}]).sort('-recommend').skip((page - 1) * item).limit(item).lean()
    }

    // 1. 전송
    const Response = async (posts) =>{
        let tempList = []
        for (let i = 0; i < posts.length; i++) {
            let board = await Board.findOne({boardId: posts[i].boardId}).lean().exec()
            let user = await User.findOne({userId: posts[i].writerId}).lean().exec()
            tempList.push({
                _id: posts[i]._id,
                title: posts[i].title,
                writerNickname: user.nickname,
                writerImage: user.resizedImage,
                boardId: board.boardId,
                boardTitle: board.title,
            })
        }

        return res.status(200).json(tempList)
    }

    Querying()
        .then(Response)
        .catch((err) => {if (err) return res.status(500).json({message: "MongoDB error"})})
}