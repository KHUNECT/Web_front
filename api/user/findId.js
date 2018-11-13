'use strict'

const User = require('../../models/user')

exports.findId = (req, res) => {
    const email = req.body.email

    // 1. Query Check
    const QueryCheck = () => {
        if (!email) {
            return Promise.reject({
                message: "Query Error"
            })
        }
        return User.findOne({email: email})
    }

    // 2. User Check
    const UserCheck = (user) => {
        if (user != null) {
            return res.status(200).json({message: "아이디가 존재 하지 않습니다."})
        }
        else
            return res.status(200).json({message: `당신의 아이디는 ${user.userId} 입니다`})
    }

    QueryCheck()
        .then(UserCheck)
        .catch(err => {
            if (err) return res.status(500).json(err)
        })
}