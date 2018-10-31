const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LectureSchema = new Schema({
    lectureId : {type: String, required: true, unique: true},
    title : {type: String, required: true},
    professor = String
},{collection: "lectures"}
)

module.exports = mongoose.Model('Lecture', LectureSchema)