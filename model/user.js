const  mongoose  = require('mongoose');

const userSchema=mongoose.Schema({
    name:String,
    image:String,
    countInStock:{
      type:Number,
      required:true
    }
})
//creating a modal
exports.Product = mongoose.model('User',userSchema);