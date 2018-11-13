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
        return Post.find({boardId: boardId}).skip((page-1)*itemNum).limit(itemNum).lean()
    }

    // 2.
    const Response = (posts) => {
        const mapPosts = async () => {
            try {
                for (let i = 0; i < posts.length; i++) {
                    let user = await User.find({_id: posts[i].writerId}).exec()
                    posts[i].writerNickname = user.nickname
                    posts[i].writerImage = user.resizedImage
                }
                return posts
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