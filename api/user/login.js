'use strict'

const User = require('../../models/user')
const bcrypt=require('bcrypt-nodejs')
const session=require('express-session')
const app=require('express')()

app.use(session({
    secret:'ambc@!vsmkv#!&*!#EDNAnsv#!$()_*#@',
    resave:false,
    saveUninitialized:true
}))

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
    const Login = async (data) =>{
        if(data==null)
            return Promise.reject({
                code:'User_does_not_exists',
                message:'User_does_not_exists'
        })
        else {
            let check = await bcrypt.compareSync(password, data.password)
            if (check) {
                console.log(`${data.major} ${data.name} 로그인 완료`)
                req.session.sid=data._id
                console.log(data._id)
                req.session.save(function(){
                    return res.status(200).json({_id: data._id})
                })
            }
            else {
                console.log('비밀번호가 일치하지 않습니다')
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