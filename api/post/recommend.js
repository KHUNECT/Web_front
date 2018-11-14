'use strict'

const User = require('../../models/user')
const Post = require('../../models/post')

exports.Recommend = (req, res) => {
    const userId = req.session.sid || req.body.userId
    const postId = req.body.postId

    // 1. Query Check
    const QueryCheck = () => {
        if (!userId || !postId) {
            return Promise.reject({
                message: "Query Error"
            })
        } else {
            return User.findOne({_id: userId})
        }
    }

    // 2. User Check
    const UserCheck = (user) => {
        if (user == null){
            return Promise.reject({
                message: "Can`t find user"
            })
        }
        return Post.findOne({_id: postId})
    }

    // 3. Post Check
    const PostCheck = (post) => {
        if (post == null){
            return Promise.reject({
                message: "Can`t find Post"
            })
        }
        else if (post.recommendList.includes(userObjId)){
            return Promise.reject({
                message: "Already Recommended"
            })
        } else {
            post.recommend += 1
            post.recommendList.push(userObjId)
            post.save()
            return res.status(200).json({message: "Success"})
        }
    }

    QueryCheck()
        .then(UserCheck)
        .then(PostCheck)
        .catch(err => {
            if (err) return res.status(500).json(err)
        })

}