'use strict'

const User = require('../../models/user')
const Post = require('../../models/post')

exports.addComment = (req, res) => {
    const userId = req.session.sid || req.body.userId
    const postId = req.body.postId
    const context = req.body.context

    let writerId

    // 1. Query Check
    const QueryCheck = () => {
        if (!userId || !postId || !context) {
            return Promise.reject({
                message: "Query Error"
            })
        }
        return User.findOne({_id: userId})
    }

    // 2. User Check
    const UserCheck = (user) => {
        if (user == null) {
            return Promise.reject({
                message: "Can`t find User"
            })
        }
        writerId = user.userId
        return Post.findOne({_id : postId})
    }

    // 3. Post Check
    const PostCheck = (post) => {
        if (post == null) {
            return Promise.reject({
                message: "Can`t find Post"
            })
        }
        post.comments.push({
            writerId: writerId,
            context: context
        })
        post.save()

        return res.status(200).json({
            message: "Success"
        })
    }

    QueryCheck()
        .then(UserCheck)
        .then(PostCheck)
        .catch(err => {
            if (err) return res.status(500).json(err.message || err)
        })
}