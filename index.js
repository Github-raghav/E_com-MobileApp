const { config } = require('dotenv');
const express=require('express');
const  mongoose  = require('mongoose');
const app=express();
const cors=require('cors');
const morgan=require('morgan');
const productRouter=require('./routers/products');
const categoryRouter=require('./routers/categories');
 
require('dotenv/config');

const api=process.env.API_URL;
//Middleware- now server can accept the json data from frontend.
app.use(express.json());
app.use(morgan('tiny')); // used to display log request morgan library.
app.use('*',cors());
//Routers
app.use(`${api}/products`,productRouter)
app.use(`${api}/category`,categoryRouter)



mongoose.connect(process.env.CONNECTION_STRING).then(()=>{
    console.log("DATABASE CONNECTION IS READY");
}).catch((err)=>{
    console.log(err);
})


//listen takes the port no and callback for printing any msg.
app.listen(3000,()=>{
    console.log(api);
    console.log("server started at 3000port")
})
