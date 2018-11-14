'use strict'

const Post = require('../../models/post')

exports.DeletePost = (req, res) => {
    const writerId = req.session.sid || req.body.writerId
    const postId = req.body.postId

    // 0. 쿼리 확인
    const QueryCheck = () => {
        return new Promise((resolve, reject) => {
            if (!writerId || !postId){
                return reject({
                    message: 'query error'
                })
            }
            return resolve()
        })
    }

    // 1. postId 체크
    const WriterCheck = () => {
        console.log("d")
        return Post.findById(postId)
    }

    // 2. WriterId 체크
    const PostCheck = (post) => {
        return new Promise((resolve, reject) =>{
            if (post == null) {
                return reject({
                    message: 'Post Not Exists'
                })
            }
            if (post._id != writerId) {
                return reject({
                    message: 'User Not Matches'
                })
            }
            return post.remove()
                .then(data => {
                    return res.status(200).json({message: "success"})
                })
        })
    }

    QueryCheck()
        .then(WriterCheck)
        .then(PostCheck)
        .catch((err) => {
            return res.status(500).json(err)
        })
}