const express=require('express');
const router=express.Router();
const {User} = require('../model/user')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

//get request of app which takes route and cllback which shows msg on scn.
router.get(`/`,async(req,res)=>{
    const userList= await User.find().select('-passwordHash');
    if(!userList){
        res.status(500).json({success:false})
     }
     res.send(userList);
     
 })

//get category by id.
 router.get('/:id',async (req,res)=>{
     const user=await User.findById(req.params.id).select('-passwordHash');

     if(!user){
     return res.status(500).json({success:false,message:' user Not found'})
     }else{
        return res.status(200).json({success:true,message:' success'})
     }
 })

 //post request add user
 router.post(`/`, async (req,res)=>{
    let user=new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash: await bcrypt.hashSync(req.body.passwordHash,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country,
    })
    user=await user.save();

    if(!user)
    return res.status(404).send('the user cannot be created !')
    
     res.send(user);

})

router.post('/login', async(req,res)=>{
    // try{
        const user=await User.findOne({email:req.body.email})
        console.log(user);
       const secret=process.env.secret;
        if(!user){
            return res.status(400).send('The user not Found')
        }
        if(user &&  bcrypt.compareSync(req.body.passwordHash,user.passwordHash)){
        //     //creating jsonwebtoken
            const token=jwt.sign({
                userId:user.id,
                isAdmin:user.isAdmin
            },
              secret,
              {expiresIn:'1d'}
            )
            // res.status(200).send('User Authenticated')
           res.status(200).send({user:user.email,token:token})
        }else{
             res.status(400).send('Wrong Password');
        }
    //    return res.status(200).send(user);
//     }
//    catch(err){
//        res.send(err);
//    }
})


//Creating api for count of total users for stats.
router.get('/get/count',async (req,res)=>{
    const userCount= await User.countDocuments()
    if(!userCount){
        res.status(500).json({success:false})
     }
     res.send({UserCount:userCount});
});

router.delete('/:id', (req,res)=>{
    User.findByIdAndRemove(req.params.id).then(user=>{
        if(user){
            return res.status(200).json({success:true,message:'The user is deleted'})
        }else{
            return res.status(404).json({success:false,message:'user not found'})
        }
        }).catch(err=>{
            return res.status(100).json({success:false,error:err})
        })
})


 module.exports=router;