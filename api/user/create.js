'use strict'

const User = require('../../models/user')

exports.UserCreate = (req, res) => {
    const userId = req.body.userId
    const password = req.body.password
    const nickname = req.body.nickname
    const email = req.body.email
    const image = req.body.image
    

    // 0. 데이터 체크
    const DataCheck = () => {
        return new Promise((resolve,reject) => {
            if(!userId || !password || !nickname || !email) {
                return reject({
                    code: 'request_body_error',
                    message: 'request body is not defined'
                })
            } else resolve()
        })
    }

    // 1. 사용자 정보 조회
    const UserCheck = () =>{
        return new Promise((resolve, reject) =>{
            if (User.findOne({userId: userId})){
                return reject({
                    code: 'userId_already_exists',
                    message: 'userId_already_exists'
                })
            }
            else resolve()
        })
    }

    // 2. 회원 가입
    const SignIn = () => {
        return User.create({userId: userId, password: password, nickname: nickname, email: email})
    }
    
    // 3. 정보 반환
    const ResponseInfo = (userInfo) => {
        res.status(200).json({
            userId: userInfo.userId,
            password: userInfo.password,
            nickname: userInfo.nickname,
            email: userInfo.email
        })
    }

    DataCheck()
    .then(UserCheck)
    .then(SignIn)
    .then(ResponseInfo)
    .catch((err) => {
        console.log(err)
        return res.status(500).json(err.message || err)
    })
}