'use strict'

const Post = require('../../models/post')
const User = require('../../models/user')

exports.Detail = (req, res) => {
    const postId = req.params.postId

    let tempPost

    // 1. Query Check
    const QueryCheck = () => {
        if (!postId) {
            return Promise.reject({
                message: "Query Error"
            })
        } else {
            return Post.findOne({_id: postId})
        }
    }

    // 2. Post Check
    const PostCheck = (post) => {
        if (post == null){
            return Promise.reject({
                message: "Can`t find Post"
            })
        }
        tempPost = Post
        return User.findOne({userId: post.userId})
    }

    // 3. User Check
    const UserCheck = (user) => {
        if (user == null){
            return Promise.reject({
                message: "Can`t find User"
            })
        }
        return res.status(200).json({
            _id: postId,
            writerId: user.writerId,
            writerNickname: user.writerNickname,
            writerImage: user.resizedImage,
            postTitle: tempPost.title,
            postContext: tempPost.context,
            postComments: tempPost.comments,
            postRecommend: tempPost.recommend,
            postImages: tempPost.images
        })
    }


    QueryCheck()
        .then(PostCheck)
        .then(UserCheck)
        .catch(err => {
            if (err) return res.status(500).json(err)
        })

}