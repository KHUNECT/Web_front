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

exports.UserModify = (req, res) => {
    console.log('-POST modify-')
    const _id = req.session.sid
    const password = req.body.password || ''
    const nickname = req.body.nickname || ''
    const email = req.body.email || ''

    // 0. 중복 체크
    const CheckNickname = () =>{
        return User.findOne({nickname: nickname})
            .then((data)=>{
                if (data != null)
                    return Promise.reject({
                        message: "Nickname Exists"
                    })
                else
                    return User.findOne({email: email})
            })
            .then((data)=>{
                if (data != null)
                    return Promise.reject({
                        message: "email Exists"
                    })
                else
                    return Promise.resolve()
            })
    }


    // 1. 쿼리 체크
    const CheckQuery = () =>{
        return new Promise((resolve, reject) => {
            if (!_id) {
                return reject({
                    message: "query error"
                })
            }
            resolve()
        })
    }

    // 2. 유저 체크
    const UserCheck = () => {
        return User.findOne({_id: _id})
    }

    // 3. password, nickname, email 저장
    const Modify = (result) =>{
        if (result == null) {
            return reject({
                message: "Can't Find User"
            })
        }
        if (password != '') {
            if (result.validPassword(req.body.currPassword))
                result.password = password
            else{
                return reject({
                    message:"Current Password is invalid"
                })
            }
        }
        if (nickname != '')
            result.nickname = nickname
        if (email != '')
            result.email = email

        if (req.file == null) {
            result.save((err, data) => {
                if (err) {
                    console.log(err)
                    throw err
                }
                return res.status(200).json({message: 'Success'})
            })
        }
        else {
            let file_location = 'images/'
            let origin_name = Date.now() + "_" + path.basename(req.file.originalname)

            let resizedImage = "https://khunect-bucket.s3.ap-northeast-2.amazonaws.com/images/"+origin_name
            result.resizedImage = resizedImage

            let params = {
                Bucket: 'khunect-bucket',
                Key: file_location + origin_name,
                ACL: 'public-read'
            }

            let tempS3 = new AWS.S3()

            sharp(req.file.buffer)
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

            result.save((err, data) => {
                if (err) {
                    console.log(err)
                    throw err
                }
            })

            return res.status(200).json({message: 'success'})
        }
    }
    CheckNickname()
        .then(CheckQuery)
        .then(UserCheck)
        .then(Modify)
        .catch((err)=>{
            if (err) {
                return res.status(500).json(err)
            }
        })


}