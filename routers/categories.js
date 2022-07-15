const express=require('express');
const router=express.Router();
const {Category} = require('../model/category')


//get request of app which takes route and cllback which shows msg on scn.
//get list of all categories
router.get(`/`,async (req,res)=>{
    const categoryList= await Category.find();
    if(!categoryList){
        res.status(500).json({success:false})
     }
     res.status(200).send(categoryList);
     
 })
//get category by id.
 router.get('/:id',async (req,res)=>{
     const category=await Category.findById(req.params.id);

     if(!category){
     return res.status(500).json({success:false,message:' categoryId Not found'})
     }else{
        return res.status(200).json({success:true,message:' success'})
     }
 })
 //update by id
router.put('/:id',async (req,res)=>{
    const category=await Category.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    },{new:true} // from this new updated data is retured.
    );

    if(!category){
    return res.status(500).json({success:false,message:' categoryId Not found'})
    }else{
       return res.status(200).json({success:true,message:' success'})
    } 
 })

//add a category
 router.post(`/`, async (req,res)=>{
     let category=new Category({
         name:req.body.name,
         icon:req.body.icon,
         color:req.body.color
     })
     category=await category.save();
     if(!category)
     return res.status(404).send('the category cannot be created !')
     
      res.send(category);
 
 })
//delete by id
//  api/v1/id
 router.delete('/:id', (req,res)=>{
     Category.findByIdAndRemove(req.params.id).then(category=>{
         if(category){
             return res.status(200).json({success:true,message:'The category is deleted'})
         }else{
             return res.status(404).json({success:false,message:'Category not found'})
         }
         }).catch(err=>{
             return res.status(100).json({success:false,error:err})
         })
 })



 module.exports=router;