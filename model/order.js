const  mongoose  = require('mongoose');

const orderSchema=mongoose.Schema({
    name:String,
    image:String,
    countInStock:{
      type:Number,
      required:true
    }
})
//creating a modal
exports.Product = mongoose.model('Order',orderSchema);