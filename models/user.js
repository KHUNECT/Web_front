const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    userId : {type: String, required: true, unique: true, lowercase: true},
    password : {type: String, required: true, trim: true},
    nickname : {type: String, required: true, unique: true},
    email : {type: String, required: true, unique: true},
    profileImage: {
        original: {
            fileName: String,
            s3Location: String
        },
        resized:{
            fileName: String,
            s3Location: String
        }
    },
    lectures : [String],
    posts:[String],
    createdDate: {type: Date, default: Date.now}
},{collection: "users"}
)

module.exports = mongoose.model('User', UserSchema)