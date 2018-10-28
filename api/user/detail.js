'use strict'

const User = require('../../models/user')

exports.UserDetail = (req, res) => {
    const userId = req.query.userId

    if (!userId) {
        return res.status(500).json({
            message: "query error"
        })
    }

    User.findOne({userId: userId})
    .then((result) => {
        return res.status(200).json({
            userId: result.userId,
            image: result.image,
            nickname: result.nickname,
            email: result.email
        })
    })
}