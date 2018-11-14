'use strict'

const User = require('../../models/user')
const Mailer = require('../middlewares/mailer')

exports.findPassword = (req, res) => {
    const userId = req.body.userId
    const email = req.body.email

    // 1. Query Check
    const QueryCheck = () => {
        if (!userId || !email) {
            return Promise.reject({
                message: "Query Error"
            })
        }
        return User.findOne({userId:userId})
    }

    // 2. User Check
    const UserCheck = (user) => {
        return new Promise((resolve, reject) => {
            if (user == null) {
                return resolve(0)
            }
            else if (user.email != email)
                return resolve(1)
            else
                return resolve(user)
        })
    }

    // 3. Email Send
    const EmailSend = async (user) => {
        if (user == 0){
            return res.status(200).json({message: "아이디가 존재 하지 않습니다."})
        }
        else if (user == 1){
            return res.status(200).json({message: "이메일이 일치 하지 않습니다."})
        }
        let str = ""
        for (;str.length < 10;str += Math.random().toString(36).substr(2));

        await user.generateHash(str)
        user.save()

        let mailOptions = {
            from: 'KHUNECT',
            to: user.email,
            subject: '[KHUNECT] 비밀번호가 변경 되었습니다',
            text: `${user.nickname} 님의 비밀번호가 변경 되었습니다. 변경 된 비밀번호는 ${str} 입니다.`
        }
        Mailer.sendMail(mailOptions, (err, info) => {
            if (err) return Promise.reject(err)
        })
        return res.status(200).json({message: "Success"})
    }

    QueryCheck()
        .then(UserCheck)
        .then(EmailSend)
        .catch(err => {
            if (err) return res.status(500).json(err)
        })
}