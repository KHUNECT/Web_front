'use strict'

const User = require('../../models/user')
const Board = require('../../models/board')
const rp = require('request-promise')

exports.SetLecture = (req, res) => {
    const userId = req.body.userId
    const klasId = req.body.klasId
    const klasPassword = req.body.klasPassword

    let json_var

    // 1. 쿼리 Check
    const QueryCheck = (json) => {
        if (!userId){
            return Promise.reject({
                message: "Query Error"
            })
        } else {
            json_var = JSON.parse(json)
            return User.findOne({userId: userId})
        }
    }

    // 2. User Check
    const UserCheck = (user) => {
        return new Promise((resolve, reject) => {
            if(user == null){
                return reject({
                    message: "Can't find User"
                })
            }
            for (let i = 0; i < json_var.length; i++){
                user.lectures.push(json_var[i]["subjnum"])
            }
            user.save()
            return resolve()
        })
    }

    // 3. Find And Create
    const FindAndCreate = () =>{
        return new Promise((resolve, reject) => {
            console.log("hi")
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
                        return reject(err)
                    })
            }
            return res.status(200).json({message: "Success"})

        })
    }

    rp.post('http://localhost:5000', {form:{
        id: klasId,
        password: klasPassword
    }})
        .then(QueryCheck)
        .then(UserCheck)
        .then(FindAndCreate)
        .catch(err => {
            if (err){
                return res.status(500).json(err)
            }
        })
}