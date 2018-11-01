'use strict'

const Post = require('../../models/post')
const Board = require('../../models/board')
const User = require('../../models/user')
const sharp = require('sharp')
const path = require('path')
const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
    region: process.env.region
})

exports.CreatePost = (req, res) => {
    const writerId = req.body.writerId
    const title = req.body.title
    const context = req.body.context
    const boardId = req.body.boardId

    // 0. 쿼리 확인
    const QueryCheck = () => {
        return new Promise((resolve, reject) => {
            if (!writerId || !title || !context || !boardId){
                return reject({
                    message: 'query error'
                })
            }
            resolve()
        })
    }

    // 1. writerId 체크
    const WriterCheck = () => {
        return User.findOne({userId: writerId})
    }

    // 2. boardId 체크
    const BoardCheck = (writer) => {
        if (writer != null) {
            return reject({
                message: 'User Not Exists'
            })
        }
        return Board.findOne({boardId: boardId})
    }

    // 3. 포스트 생성
    const Posting = (board) => {
        if (board != null) {
            return reject({
                message: 'Board Not Exists'
            })
        }
        if (req.file == null){
            return Post.create({
                writerId: writerId,
                title: title,
                context: context,
                boardId: boardId
            })
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
            .toFormat('jpeg')
            .resize(200,200)
            .toBuffer()
            .then(data => {
                params.Body = data

                tempS3.putObject(params, (err, info)=>{
                    if (err){
                        console.log("에러 발생")
                    }
                    if (info){
                        console.log("이미지가 업로드 되었습니다 : ", info.Location)
                    }
                })
            }).catch(err => {
                throw err
            })

        return Post.create({
            writerId: writerId,
            title: title,
            context: context,
            boardId: boardId,
            images: ["https://khunect-bucket.s3.ap-northeast-2.amazonaws.com/images/"+origin_name]
        })

    }

    QueryCheck()
        .then(WriterCheck)
        .then(BoardCheck)
        .then(Posting)
        .then(data => {
            res.status(200).json(data)
        })
        .catch((err) => {
            return res.status(500).json(err)
        })

}