'use strict'

const User = require('../../models/user')
const Post = require('../../models/post')

exports.Recommend = (req, res) => {
    const userId = req.session.sid || req.body.userId
    const postId = req.body.postId
    console.log(0)
    // 1. Query Check
    const QueryCheck = () => {
        console.log(1)
        if (!userId || !postId) {
            console.log('1 error ',!userId,!postId)
            return Promise.reject({
                message: "Query Error"
            })
        } else {
            return User.findOne({_id: userId})
        }
    }

    // 2. User Check
    const UserCheck = (user) => {
        console.log(2)
        if (user == null){
            console.log('2 error')
            return Promise.reject({
                message: "Can`t find user"
            })
        }
        return Post.findOne({_id: postId})
    }

    // 3. Post Check
    const PostCheck = (post) => {
        console.log(3)
        if (post == null){
            console.log('3 error')
            return Promise.reject({
                message: "Can`t find Post"
            })
        }
        else if (post.recommendList.includes(userId)){
            console.log('3-2 error')
            return Promise.reject({
                message: "Already Recommended"
            })
        } else {
            console.log('3 success')
            post.recommend += 1
            post.recommendList.push(userId)
            post.save()
            return res.status(200).json({message: "Success"})
        }
    }

    QueryCheck()
        .then(UserCheck)
        .then(PostCheck)
        .catch(err => {
            console.log(err)
            if (err) return res.status(500).json(err)
        })

}