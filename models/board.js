const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BoardSchema = new Schema({
        boardId : {type: String, required: true, unique: true},
        title : {type: String, required: true},
        professor : String,
        lecture : Boolean
    },{collection: "boards"}
)

module.exports = mongoose.Model('Board', BoardSchema)