const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    writerId: {type: String, required: true},
    title: {type: String, required: true},
    context: String,
    images: [String],
    comments: [{
        writerId: {type:String, required:true},
        context: {type:String, required:true},
        nestedComments:[{
            writerId: {type:String, required:true},
            context: {type:String, required:true}
        }]
    }],
    createdDate: {type: Date, default: Date.now},
    boardId: {type: String, required: true},
    recommend: {type: Number, default: 0}
},{collection: "posts"}
)

module.exports = mongoose.model('Post', PostSchema)