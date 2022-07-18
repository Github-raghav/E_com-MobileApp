const express=require('express');
const { default: mongoose } = require('mongoose');
const { Category } = require('../model/category');
const router=express.Router();
const {Product} = require('../model/product')
const multer=require('multer');


const fileTypeMap={
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
}

//take from npm multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid=fileTypeMap[file.mimetype];
       let uploadError=new Error('invalid image type')
       if(isValid){
        uploadError=null;
       }    
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const filename = file.originalname.split('').join('-');
      const extension=fileTypeMap[file.mimetype];
      cb(null, `${filename}-${ Date.now()}.${extension}`)
    }
  })
  
  const uploadOpns = multer({ storage: storage })




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

 router.post(`/`,uploadOpns.single('image') , async (req,res)=>{
     //validate if category is present or not
     const category=await Category.findById(req.body.category);
    
     if(!category){
         return res.status(400).send('Invalid category');
     }
     const file=req.file;
     if(!file)return res.status(400).send('NO image in request');
     const fileName=req.file.filename
     const basepath=`${req.protocol}://${req.get('host')}/public.upload`
     
     let product=new Product({
         name:req.body.name,
         description:req.body.description,
         richDescription:req.body.richDescription,
         image:`${basepath}${fileName}`,//"http://localhost:3000/public/upload/image-23232322.jpeg",
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

 router.put('/:id',uploadOpns.single('image') ,async (req,res)=>{
      //validate if category is present or not
      if(!mongoose.isValidObjectId(req.params.id)){
          return res.status(400).send('Invalid Product Id')
      }
      const category=await Category.findById(req.body.category);
      if(!category){
        return res.status(400).send('Invalid category');
    }
   
    const product=await Product.findById(req.params.id);
    if(!product)return res.status(400).send('Invalid Product');
    const file=req.file;
    //if user does't upload any new image then save the same img.
    let imagePath;
    if(file){
        const fileName=req.file.filename
     const basepath=`${req.protocol}://${req.get('host')}/public.upload`
      imagePath=`${basepath}${fileName}`    
    }else{
        imagePath=product.image;
    }
     const  updatedproduct=await Product.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:imagePath,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured
    },{new:true} // from this new updated data is retured.
    );

    if(!updatedproduct){
    return res.status(500).json({success:false,message:' productId Not found'})
    }else{
       return res.send(updatedproduct);
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
//api for uploading multiple images/
router.put('/gallery-images/:id',uploadOpns.array('image',10),async(req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product id')
    }

    const files=req.files
    let imagePaths=[];
    const basePath=`${req.protocol}://${req.get('host')}/public/upload`;
    if(files){
        files.map(file=>{
            imagePaths.push(`${basePaths}${file.fileName}`);
        })
    }

const product=await Product.findByIdAndUpdate(req.params.id,{
    images:imagePaths
},
{new:true}
)
if(!product)return res.status(500).send('the product cannot be updated!')
res.send(product);

} )

 module.exports=router;