'use strict'

const User = require('../../models/user')
const Post = require('../../models/post')

exports.modifyComment = (req, res) => {
    const userId = req.body.userId
    const postId = req.body.postId
    const commentId = req.body.commentId
    const context = req.body.context

    // 1. Query Check
    const QueryCheck = () =>{
        if (!userId || !postId || !commentId) {
            return Promise.reject({
                message: 'Query Error'
            })
        }
        return User.findOne({userId: userId})
    }

    // 2. User Check
    const UserCheck = (user) => {
        if (user == null) {
            return Promise.reject({
                message: 'Can`t find User'
            })
        }
        return Post.findOne({_id: postId})
    }

    // 3. Post Check
    const PostCheck = (post) => {
        let check = false
        if (post == null) {
            return Promise.reject({
                message: 'Can`t find Post'
            })
        }
        for (let i = 0; i < post.comments.length; i++){
            if (post.comments[i]._id == commentId){
                check = true
                post.comments[i].context = context
                break
            }
        }
        if (check == true){
            post.save()
            return res.status(200).json({message: "Success"})
        } else {
            return Promise.reject({
                message: "Can`t find Comment"
            })
        }
    }

    QueryCheck()
        .then(UserCheck)
        .then(PostCheck)
        .catch(err => {
            if (err) return res.status(500).json(err)
        })
}