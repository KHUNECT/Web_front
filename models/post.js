const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
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
    boardId: {type: Number, required: true}
},{collection: "posts"}
)

module.exports = mongoose.Model('Post', PostSchema)