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
    const writerId = req.session.sid || req.body.userId
    const title = req.body.title
    const context = req.body.context
    const boardId = req.body.boardId
    console.log('-POST /api/post/create-')
    console.log(` ${writerId}  ${title}  ${context}  ${boardId} `)
    let userId

    // 0. 쿼리 확인
    const QueryCheck = () => {
        console.log(0)
        return new Promise((resolve, reject) => {
            if (!writerId || !title || !context || !boardId){
                console.log('0 error')
                return reject({
                    message: 'query error'
                })
            }
            resolve()
        })
    }

    // 1. writerId 체크
    const WriterCheck = () => {
        console.log(1)
        return User.findById(writerId)
    }

    // 2. boardId 체크
    const BoardCheck = (writer) => {
        console.log(2)
        if (!writer) {
            console.log('2 error')
            return reject({
                message: 'User Not Exists'
            })
        }
        userId = writer.userId
        return Board.findOne({boardId: boardId})
    }

    // 3. 포스트 생성
    const Posting = (board) => {
        console.log(3)
        if (!board) {
            console.log('3 error')
            return reject({
                message: 'Board Not Exists'
            })
        }
        if (req.file == null){
            return Post.create({
                writerId: userId,
                title: title,
                context: context,
                boardId: boardId,
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

        return sharp(req.file.buffer)
            .rotate()
            .toFormat('jpeg')
            .resize(500,500)
            .toBuffer()
            .then(data => {
                params.Body = data
                return tempS3.putObject(params).promise()
            })
            .then(data => {
                return Post.create({
                    writerId: userId,
                    title: title,
                    context: context,
                    boardId: boardId,
                    images: ["https://khunect-bucket.s3.ap-northeast-2.amazonaws.com/images/" + origin_name]
                })
            })
            .then(data=>{
                res.status(200).json({message: "success"})
            })
            .catch(err => {
                throw err
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