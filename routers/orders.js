const express=require('express');
const router=express.Router();
const Order = require('../model/order')


//get request of app which takes route and cllback which shows msg on scn.
router.get(`/`,async(req,res)=>{
    const orderList= await Order.find();
    if(!orderList){
        res.status(500).json({success:false})
     }
     res.send(produtList);
     
 })
 
 router.post(`/`,(req,res)=>{
     const order=new Order({
         name:req.body.name,
         image:req.body.image,
         countInStock:req.body.countInStock
     })
     order.save().then((createdOrder)=>{
         res.status(201).json(createdOrder)
     }).catch((err)=>{
         res.status(500).json({
             error:err,
             success:false
         })
     })
     // res.send(product);
     // res.send("hello api");
 
 })

 module.exports=router;