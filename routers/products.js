const express=require('express');
const { default: mongoose } = require('mongoose');
const { Category } = require('../model/category');
const router=express.Router();
const {Product} = require('../model/product')


//get request of app which takes route and cllback which shows msg on scn.
router.get(`/`,async(req,res)=>{
    let filter={}
    if(req.query.categories){
        filter={category:req.query.categories.split(',')}
    }
    const produtList= await Product.find(filter).populate('category');//selct func used if we dont want to return all details of product 
    if(!produtList){
        res.status(500).json({success:false})
     }
     res.send(produtList);
     
 })
 //get product by id.
 router.get(`/:id`,async(req,res)=>{
    const product= await Product.findById(req.params.id).populate('category');//polpulate func used to fetch info using id,in this ex category
    if(!product){
        res.status(500).json({success:false})
     }
     res.send(product);
     
 })

 router.post(`/`,async (req,res)=>{
     //validate if category is present or not
     const category=await Category.findById(req.body.category);
    
     if(!category){
         return res.status(400).send('Invalid category');
     }
     let product=new Product({
         name:req.body.name,
         description:req.body.description,
         richDescription:req.body.richDescription,
         image:req.body.image,
         brand:req.body.brand,
         price:req.body.price,
         category:req.body.category,
         countInStock:req.body.countInStock,
         rating:req.body.rating,
         numReviews:req.body.numReviews,
         isFeatured:req.body.isFeatured
     })
       product=await  product.save()
       if(!product){
           return res.status(500).json({success:false,message:'Product cannot be created'})
       }else{
        
       return res.send(product);
       }

     // res.send("hello api");
 
 })

 router.put('/:id',async (req,res)=>{
      //validate if category is present or not
      if(!mongoose.isValidObjectId(req.params.id)){
          return res.status(400).send('Invalid Product Id')
      }
      const category=await Category.findById(req.body.category);
      if(!category){
        return res.status(400).send('Invalid category');
    }
      const product=await Product.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:req.body.image,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured
    },{new:true} // from this new updated data is retured.
    );

    if(!product){
    return res.status(500).json({success:false,message:' productId Not found'})
    }else{
       return res.send(product);
    } 
 })
 //delete by id
//  api/v1/id
router.delete('/:id', (req,res)=>{
    Product.findByIdAndRemove(req.params.id).then(product=>{
        if(product){
            return res.status(200).json({success:true,message:'The Product is deleted'})
        }else{
            return res.status(404).json({success:false,message:'product not found'})
        }
        }).catch(err=>{
            return res.status(100).json({success:false,error:err})
        })
})

//Creating api for count of total Products for stats.
router.get('/get/count',async (req,res)=>{
    const produtCount= await Product.countDocuments()
    if(!produtCount){
        res.status(500).json({success:false})
     }
     res.send({ProductCount:produtCount});
});

//API for getting featured products 
router.get('/get/featured',async (req,res)=>{
    const produtFeatured= await Product.find({isFeatured:true})
    if(!produtFeatured){
        res.status(500).json({success:false})
     }
     res.send(produtFeatured);
});

//API for filteration in category

 module.exports=router;