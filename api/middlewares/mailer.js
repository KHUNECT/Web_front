'use strict'

const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.password
    }
})