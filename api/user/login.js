'use strict'

const User = require('../../models/user')
const bcrypt=require('bcrypt-nodejs')

exports.Login = (req, res) => {
    let userId = req.body.userId
    let password = req.body.password


    // 1. 쿼리 체크
    const QueryCheck = () => {
        return new Promise((resolve,reject)=>{
            if(!userId || !password){
                return reject({
                    code:'request_body_error',
                    message:'request body is not defined'
                })
            }
            else
                resolve()
        })
    }

    // 2. 아이디 확인
    const idCheck=()=>{
        return User.findOne({userId:userId})
    }
    // 3. 비밀번호 확인
    const Login = (data) =>{
        if(data==null)
            return Promise.reject({
                code:'User_does_not_exists',
                message:'User_does_not_exists'
        })
        else {
            if (bcrypt.compareSync(password, data.password)) {
                console.log(`${data.major} ${data.name} 로그인 완료`)
                req.session.sid=User._id
                req.session.save(function(){
                    return res.status(200).json({userId: data.userId})
                })
            }
            else {
                return Promise.reject({
                    message: "Login Failed"
                })
            }
        }

    }

    QueryCheck()
        .then(idCheck)
        .then(Login)
        .catch(err => {
            console.log(err)
            if (err) return res.status(500).json(err.message || err)
        })
}