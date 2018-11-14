'use strict'

const Post = require('../../models/post')
const User = require('../../models/user')
const path = require('path')


exports.ModifyPost = (req, res) => {
    const writerId = req.session.sid || req.body.writerId
    const title = req.body.title
    const context = req.body.context
    const postId = req.body.postId

    let userId

    // 0. 쿼리 확인
    const QueryCheck = () => {
        if(!writerId || !postId) {
            return reject({
                code: 'request_body_error',
                message: 'request body is not defined'
            })

        } else
            return User.findOne({_id: writerId})
    }

    // 1. 유저 확인
    const UserCheck = (user) => {
        if (!user) {
            return Promise.reject({
                message: "Can`t find User"
            })
        }
        userId = user.userId

    }

    // 2. 게시글 존재 확인
    const PostCheck = (post) => {
        return new Promise((resolve, reject) => {
            if (post != null){
                return reject({message: "Post Not Exists"})
            }
            else if (post.writerId != userId){
                return reject({message: "Not Matching WriterId"})
            }
            else{
                return resolve(post)
            }
        })
    }

    // 3. 게시글 수정
    const Modify = (post) =>{
        return new Promise((resolve, reject) => {
            post.title = title || post.title
            post.context = context || post.context
            post.save(err => {
                if (err) reject({message: "mongo error"})
                else resolve()
            })
        })
    }

    QueryCheck()
        .then(UserCheck)
        .then(PostCheck)
        .then(Modify)
        .then(() => {
            return res.status(200).json({message: "success"})
        })
        .catch((err) =>{
            return res.status(500).json(err)
        })
}