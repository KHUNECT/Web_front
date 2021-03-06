'use strict'

const User = require('../../models/user')
const sharp = require('sharp')
const path = require('path')
const AWS = require('aws-sdk')
const bcrypt=require('bcrypt-nodejs')

AWS.config.update({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
    region: process.env.region
})

exports.UserCreate = (req, res,) => {
    const userId = req.body.userId
    const password = req.body.password
    const nickname = req.body.nickname
    const email = req.body.email
    const major = req.body.major
    const name=req.body.name

    // 0. 데이터 체크
    const DataCheck = () => {
        return new Promise((resolve,reject) => {
            if(!userId || !password || !nickname || !email || !major) {
                return reject({
                    code: 'request_body_error',
                    message: 'request body is not defined'
                })

            } else resolve()
        })
        
    }

    // 1. 사용자 정보 조회
    const UserCheck = () =>{
        return User.find().or({userId: userId}, {nickname: nickname}, {email: email}).findOne()
    }

    // 2. image 확인
    const ImageProcess = (User) => {
        if (User != null){
            return Promise.reject({
                code: 'User_Already_Exists',
                message: 'User Already Exists'
            })
        }
        if (req.file == null){
            return Promise.resolve(null, null)
        }

        let file_location = 'images/'
        let origin_name = Date.now() + "_" + path.basename(req.file.originalname)

        let params = {
            Bucket: 'khunect-bucket',
            Key: file_location + origin_name,
            ACL: 'public-read'
        }

        let tempS3 = new AWS.S3()

        sharp(req.file.buffer)
            .rotate()
            .toFormat('jpeg')
            .resize(200,200)
            .toBuffer()
            .then(data => {
                params.Body = data
                
                tempS3.putObject(params, (err, info)=>{
                    if (err){
                        throw err
                    }
                    if (info){
                        console.log("이미지가 업로드 되었습니다 : ", info.Location)
                    }
                })
            }).catch(err => {
                return Promise.reject(err)
            })
            
            return Promise.resolve("https://khunect-bucket.s3.ap-northeast-2.amazonaws.com/images/"+origin_name)
        }

    // 3. 회원 가입
    const SignUp = (resized_loc) => {
        return User.create({
            name:name,
            userId: userId,
            password: password,
            nickname: nickname,
            email: email,
            major: major,
            resizedImage: resized_loc || 'https://s3.ap-northeast-2.amazonaws.com/khunect-bucket/images/avatar.png'
        })
    }


    DataCheck()
    .then(UserCheck)
    .then(ImageProcess)
    .then(SignUp)
    .then(async (item) => {
        await item.generateHash(password)
        item.save()
        req.session.sid=item._id
        return res.status(200).json({userId: userId, nickname: nickname})
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json(err.message || err)
    })

}
