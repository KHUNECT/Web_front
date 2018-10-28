'use strict'

const User = require('../../models/user')
const sharp = require('sharp')
const path = require('path')
const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
    region: process.env.region
})

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
            let temp
            User.findOne({userId: userId}).exec((err, data)=>{
                if (err)
                    throw err
                temp = data
            })

            console.log(temp)

            if (temp) {
                return reject({
                    code: 'userId_already_exists',
                    message: 'userId_already_exists'
                })
            }
            else resolve()
        })
    }

    // 2. image 확인
    const ImageProcess = () => {
        return new Promise((resolve, reject) => {
            if (req.file == undefined){
                resolve(false, {})
            }
            
            let file_location = 'images/'
            let origin_name = Date.now()+"_"+path.basename(req.file.originalname)
            let resized_name = "resized_"+origin_name
    
            let params = {
                Bucket: 'khunect-bucket',
                Body: req.file.buffer,
                Key: file_location + origin_name
            }
    
            let tempS3 = new AWS.S3()
            tempS3.upload(params, (err, data)=>{
                if (err){
                    throw err
                }
                if (data){
                    console.log("이미지가 업로드 되었습니다 : ",data.Location)
                }
            })
    
            
            
            sharp(req.file.buffer)
            .toFormat('jpeg')
            .resize(200,200)
            .toBuffer((err, buf, info) => {
                if (err)
                    throw err
                
                params.Key = file_location + resized_name
                params.Body = buf
    
                tempS3.upload(params, (err, data)=>{
                    if (err){
                        throw err
                    }
                    if (data){
                        console.log("이미지가 업로드 되었습니다 : ",data.Location)
                    }
                })
            })
            
            resolve(true, {
                original: {
                    fileName: origin_name,
                    s3Location: file_location + origin_name
                },
                resized:{
                    fileName: resized_name,
                    s3Location: file_location + resized_name
                }
            })
        })
    }

    // 2. 회원 가입
    const SignIn = (hasImage, imageData) => {
        if (hasImage){
            return User.createIndexes({userId: userId, password: password, nickname: nickname, email: email})
        } else {
            return User.createIndexes({
                userId: userId, 
                password: password, 
                nickname: nickname, 
                email: email,
                profileImage: imageData
            })
        }
    }
    
    // 3. 정보 반환
    const ResponseInfo = () => {
        res.status(200).json({
            userId: userId,
            password: password,
            nickname: nickname,
            email: email
        })
    }

    DataCheck()
    .then(UserCheck)
    .then(ImageProcess)
    .then(SignIn)
    .then(ResponseInfo)
    .catch((err) => {
        console.log(err)
        return res.status(500).json(err.message || err)
    })
}