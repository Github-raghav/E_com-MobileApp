const  mongoose  = require('mongoose');

const orderSchema=mongoose.Schema({
    name:String,
    orderItem:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'OrderItem',
      required:true
     }],
     shippingAddress1:{
      type:String,
      required:true
     },
     shippingAddress2:{
      type:String
     },
     city:{
      type:String,
      required:true,
     },
     zip:{
      type:String,
      required:true
     },
     country:{
      type:String,
      required:true
     },
     phone:{
      type:String,
      required:true,
     },
     status:{
      type:String,
      required:true,
      default:'Pending'
     },
     totalPrice:{
      type:Number,
     },
     User:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
     },
     totalPrice:{
      type:Number
     },
     dateOrdered:{
      type:Date,
      default:Date.now,
     }

})

orderSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

orderSchema.set('toJSON',{
  virtuals:true,
});

//creating a modal
exports.Order = mongoose.model('Order',orderSchema);