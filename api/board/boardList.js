'use strict'

const Post = require('../../models/post')
const User = require('../../models/user')


exports.BoardList = (req, res) => {
    const boardId = req.params.boardId
    const page = Number(req.query.page) || 1
    const itemNum = Number(req.query.itemNum) || 10

    // 1. Query Check
    const QueryCheck = () => {
        if (!boardId){
            return Promise.reject({
                message: "Query Error"
            })
        }
        return Post.find({boardId: boardId}).sort('-createdDate').skip((page-1)*itemNum).limit(itemNum).lean()
    }

    // 2.
    const Response = (posts) => {
        const mapPosts = async () => {
            try {
                let tempPosts = []
                for (let i = 0; i < posts.length; i++) {
                    let user = await User.findOne({userId: posts[i].writerId}).exec()
                    tempPosts.push({
                        _id: posts[i]._id,
                        images: posts[i].images,
                        title: posts[i].title,
                        context: posts[i].context,
                        boardId: posts[i].boardId,
                        comments: posts[i].comments,
                        createdDate: posts[i].createdDate,
                        recommend: posts[i].recommend,
                        writerId: user.userId,
                        writerNickname: user.nickname,
                        writerImage: user.resizedImage
                    })
                }
                return tempPosts
            } catch (err) {
                return Promise.reject(err)
            }
        }
        return mapPosts()
        }


    QueryCheck()
        .then(Response)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            if (err) res.status(500).json(err.message || err)
        })
}