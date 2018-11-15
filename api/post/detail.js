'use strict'

const Post = require('../../models/post')
const User = require('../../models/user')

exports.Detail = (req, res) => {
    const postId = req.query.postId

    let tempPost

    // 1. Query Check
    const QueryCheck = () => {
        if (!postId) {
            return Promise.reject({
                message: "Query Error"
            })
        } else {
            return Post.findOne({_id: postId}).lean()
        }
    }

    // 2. Post Check
    const PostCheck = (post) => {
        if (post == null){
            return Promise.reject({
                message: "Can`t find Post"
            })
        }
        tempPost = post
        return User.findOne({userId: post.writerId})
    }

    // 3. User Check
    const UserCheck = async (user) => {
        if (user == null){
            return Promise.reject({
                message: "Can`t find User"
            })
        }
        for (let i = 0; i < tempPost.comments.length; i++) {
            let userInfo = await User.findOne({userId: tempPost.comments[i].writerId}).lean().exec()
            tempPost.comments[i].writerNickname = userInfo.nickname
        }
        return res.status(200).json({
            _id: postId,
            writerId: user.userId,
            writerNickname: user.nickname,
            writerImage: user.resizedImage,
            postTitle: tempPost.title,
            postContext: tempPost.context,
            postComments: tempPost.comments,
            postRecommend: tempPost.recommend,
            postImages: tempPost.images,
            createdDate: tempPost.createdDate
        })
    }


    QueryCheck()
        .then(PostCheck)
        .then(UserCheck)
        .catch(err => {
            if (err) return res.status(500).json(err)
        })

}