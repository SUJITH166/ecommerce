const express=require('express');
const Razorpay=require("razorpay");
const router=express.Router();

const razorpay=new Razorpay({
    key_id:process.env.R_KEY_ID,
    key_secret:process.env.R_SECRET,
});


router.post('/create-order',async(req,res)=>{
    try{
        const {amount}=req.body;
        const options={
            amount:amount*100,
            currency:"INR",
            receipt:`receipt_order_${Date.now()}`,

        };
        const order=await razorpay.orders.create(options);
        res.json(order);
    }catch(err){
        console.error(err);
        res.status(500).send({error:err.message});
    }

});
module.exports=router;