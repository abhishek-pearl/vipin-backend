import mongoose from "mongoose";



const paymentSchema = new mongoose.Schema({
    orderId:{
        type:String
    },
    transactionStatus:{
        type:String,
        enum:['SUCCESS','PENDING','FAILED'],
        default:'PENDING'
    },
    transactionId:{
        type:String,
        
    },
    name:{
        type:String
    },
    state:{
        type:String

    },
    city:{
        type:String
    },
    locality:{
        type:String
    },
    auctionType:{
        type:String
    },
    budget:{
        type:String
    },
    amount:{
        type:Number
    },
    number:{
        type:Number
    },
    userType:{
        type:String
    }
},{
    timestamps:true
});


export const PaymentModel = new mongoose.model('Payments',paymentSchema);