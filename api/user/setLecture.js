'use strict'

const User = require('../../models/user')
const Board = require('../../models/board')
const rp = require('request-promise')

exports.SetLecture = (req, res) => {
    console.log('-POST api/user/create-')
    const _id = req.session.sid || req.body.userId
    const klasId = req.body.klasId
    const klasPassword = req.body.klasPassword

    let json_var

    // 1. 쿼리 Check
    const QueryCheck = (json) => {
        console.log(1)
        if (!_id){
            return Promise.reject({
                message: "Query Error"
            })
        } else {
            json_var = JSON.parse(json)
            if (json_var.statusCode == 500){
                console.log('1 error')
                return Promise.reject({
                    message: "Request Error"
                })
            }
            return User.findOne({_id:_id})
        }
    }

    // 2. User Check
    const UserCheck = (user) => {
        console.log(2)
        return new Promise((resolve, reject) => {
            if(user == null){
                console.log('2 error')
                return reject({
                    message: "Can't find User"
                })
            }
            user.lectures = []
            for (let i = 0; i < json_var.length; i++){
                user.lectures.push(json_var[i]["subjnum"])
            }
            user.save()
            return resolve()
        })
    }

    // 3. Find And Create
    const FindAndCreate = () =>{
        console.log(3)
        return new Promise((resolve, reject) => {
            for (let i = 0; i < json_var.length; i++){
                Board.findOne({boardId: json_var[i]["subjnum"]})
                    .then(data => {
                        if (data == null){
                            Board.create({
                                boardId: json_var[i]["subjnum"],
                                title: json_var[i]["subject"],
                                professor: json_var[i]["professor"],
                                lecture: true
                            })
                        }
                    })
                    .catch(err => {
                        console.log('3 error')
                        return reject(err)
                    })
            }
            return res.status(200).json({message: "Success"})

        })
    }
    
    rp.post('http://13.125.196.191:8000', {form:{
        id: klasId,
        password: klasPassword
    }})
        .then(QueryCheck)
        .then(UserCheck)
        .then(FindAndCreate)
        .catch(err => {
            if (err){
                return res.status(500).json(err.message || err)
            }
        })
}