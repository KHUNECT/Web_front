const mongoose = require('mongoose')
const bcrypt=require('bcrypt-nodejs')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name :{type:String,required:true},
    userId : {type: String, required: true, unique: true, lowercase: true},
    password : {type: String, required: true, trim: true},
    nickname : {type: String, required: true, unique: true},
    email : {type: String, required: true, unique: true},
    major : {type: String, required: true},
    resizedImage: {type: String, required: true},
    lectures : [String],
    posts:[String],
    createdDate: {type: Date, default: Date.now}
},{collection: "users"}
)

UserSchema.methods.generateHash=function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

UserSchema.methods.validPassword=function(password){
    if(this.password!=null)
        return bcrypt.compareSync(password,this.password)
    else
        return false
}

UserSchema.pre('save',function(next){
    this.password=bcrypt.hashSync(this.password,bcrypt.genSaltSync(10),null)
    next()
})

module.exports = mongoose.model('User', UserSchema)