'use strict'

const User = require('../../models/user')

exports.UserDetail = (req, res) => {
    const userId = req.query.userId

    const QueryCheck = () => {
        if (!userId) {
            return Promise.reject({
                message: "query error"
            })
        } else {
            return User.findOne({userId: userId})
        }

    }

    QueryCheck()
    .then((result) => {
        if (result == null) {
            return Promise.reject({
                message: "User not Exists"
            })
        }
        return res.status(200).json({
            userId: result.userId,
            resizedImage: result.resizedImage,
            nickname: result.nickname,
            major: result.major,
            email: result.email
        })
    })
    .catch(err => {
        if (err) return res.status(500).json(err.message||err)
    })
}