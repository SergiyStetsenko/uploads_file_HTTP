const { Schema, model,Types} = require('mongoose')

const schema =  new Schema({
    email:{ type: String, required: true, unique: true},
    password: {type: String,required: true},
    // links: [{type: Types.ObjectId, ref: 'Link'}],
    images: [{type:String}]
})

module.exports = model("uploadFile", schema)