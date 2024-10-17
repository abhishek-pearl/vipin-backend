import mongoose from "mongoose";

const registrationDetailsSchema = new mongoose.Schema({
    
    userId:{
       type:mongoose.Schema.ObjectId,
       ref:'auth'
    },
    amount:{
        type:Number
    },
    currency:{
        type:String
    },
    order:{
        type:String
    },
    orderDate:{
        type:String
    },
    isBookedSuccessFull:{
        type:Boolean,
        default:false
    },
    razorpay_payment_id:{
        type:String,
    },
    razorpay_order_id:{
        type:String,
    },
   

},{
    timestamps:true
});

export const registrationOrderModel = mongoose.model("registrationOrder",registrationDetailsSchema);