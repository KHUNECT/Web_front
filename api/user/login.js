'use strict'

const User = require('../../models/user')

exports.Login = (req, res) => {
    const userId = req.body.userId
    const password = req.body.password

    // 1. 쿼리 체크
    const QueryCheck = () => {
        if (!userId || !password) {
            return Promise.reject({
                message: "Query Error"
            })
        }
        return User.findOne({userId: userId})
    }

    // 2. 로그인 시도
    const Login = (data) =>{
        if (bcrypt.compareSync(password, data.password)){
            return res.status(200).json({userId: data.userId})
        }
        else
        {
            return Promise.reject({
                message: "Login Failed"
            })
        }
    }

    QueryCheck()
        .then(Login)
        .catch(err => {
            if (err) return res.status(500).json(err.message || err)
        })
}