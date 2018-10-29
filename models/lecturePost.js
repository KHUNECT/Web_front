const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LecturePostSchema = new Schema({
    writerId: {type: String, required: true},
    title: {type: String, required: true},
    context: String,
    images: [{
        fileName:String,
        location:String
    }],
    comments: [{
        writerId: {type:String, required:true},
        context: {type:String, required:true},
        nestedComments:[{
            writerId: {type:String, required:true},
            context: {type:String, required:true}
        }]
    }],
    createdDate: {type: Date, default: Date.now},
    lecture: {
        lectureId : {type: String, required: true, unique: true},
        title : {type: String, required: true},
        professor : String
    }
},{collection: "lecturePosts"}
)

module.exports = mongoose.Model('LecturePost', LecturePostSchema)