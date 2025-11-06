require('dotenv').config();
const port = 4000;
// hZdRNMdXHKC3L0Cw  sujithsree009_db_user
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt =require('jsonwebtoken');
const multer = require("multer");
const path = require('path');
const cors =require('cors');
const { type } = require('os');
const { log, error } = require('console');
const router = require('./routes/router');


app.use(express.json());
app.use(cors());
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD); // encode special chars
const DB_NAME = process.env.DB_NAME;
const HOST = process.env.MONGO_HOST;
// database with mongoose
// mongodb+srv://${DB_USER}:${DB_PASSWORD}@${HOST}/${DB_NAME}

const mongo_url=`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${HOST}/`
mongoose.connect(mongo_url) 


// API creation
app.get("/",(req,res)=>{
    res.send("Express App is Running...")
})

//Image storage
const storage= multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload =multer({storage:storage})

//Creating upload Endpoint for images
app.use('/images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})
//schema for creating products
const Product=mongoose.model("Product",{
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true,
    },
    image:{
         type:String,
         required:true
    },
    category:{
        type:String,
        required:true
    },
    new_price:{
        type:Number,
        required:true
    },
    old_price:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    avilable:{
        type:Boolean,
        default:true
    }
});

app.post('/addproduct',async (req,res)=>{
    let products=await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array=products.slice(-1);
        let last_product=last_product_array[0];
        id= last_product.id+1;
    }
    else{
        id=1;
    }
    const product=new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,

    });
    console.log(product);
    await product.save();
    console.log("Saved")
    res.json({
        success:true,
        name:req.body.name,
    })
})
app.post("/removeproduct",async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
} )

app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
//schema creating for user model

const Users=mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//creating endpoint for registering the user
app.post('/signup',async(req,res)=>{
    let check=await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart={}
    for(let i=0;i<300;i++){
        cart[i]=0;
    }
    const user=new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();

    const data ={
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

//creating endpoint for user login
app.post('/login',async (req,res)=>{
    let user=await Users.findOne({email:req.body.email});
    if(user){
        const passcompare= req.body.password===user.password;
        if(passcompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:'Wrong Password'});
        }
    }
    else{
        res.json({success:false,errors:'Wrong Email Id'})
    }
})

//creating endpoint for newcollection data
app.get('/newcollections',async (req,res)=>{
    let products=await Product.find({});
    let newcollection=products.slice(1).slice(-8);
    console.log("Newcollection Fetched");
    res.send(newcollection);
})

//creating endpoint for popular in women section
app.get('/popularinwomen',async(req,res)=>{
    let products =await Product.find({category:"women"});
    let popular_in_women=products.slice(0,4);
    // console.log("Popular in women fetched");
    res.send(popular_in_women);
})

//creating endpoint for women,men,kids
app.get('/:category', async (req, res) => {
  try {
    const {category}=req.params;
        // console.log("Fetching products for:", category);
    const products = await Product.find({ category});
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error fetching ${category} products` });
  }
});

//creating middleware to fetch user
const fetchUser=async(req,res,next)=>{
    const token=req.header('auth-token');
    
    if(!token){
        res.status(401).send({error:"Please authenticate using vaild token"})
    }
    else{
        try{
            const data=jwt.verify(token,'secret_ecom');
            req.user=data.user;
            next();
        }
        catch(error){
            res.status(401).send({error:"Please authenticate using a valid token"})
        }
    }
} 
//creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser,async (req,res)=>{
        console.log("Added",req.body.itemId);
    let userData =await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId]+=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added");   
})
//creating endpoint for removing products from cartdata
app.post('/removefromcart',fetchUser,async (req,res)=>{
        console.log("Removed",req.body.itemId);
    let userData =await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId]-=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed");   
})
//creating endpoint to get cartdata
app.post('/getcart',fetchUser,async (req,res)=>{
    console.log('Get cart');
    let userData=await Users.findOne({_id:req.user.id});
    res.json(userData.cartData)
})
app.use("/", router);
app.listen(port,(error)=>{
    if(!error){
        console.log("Server running on port "+port)
    }
    else{
        console.log("Error :"+error);
    }
})