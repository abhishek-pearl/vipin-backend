import axios from "axios";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import crypto from 'crypto';
import { PaymentModel } from "../model/payment.js";
import chalk from "chalk";
import mongoose from "mongoose";
const generateTransactionId = () => {
  return `T${Date.now()}${Math.floor(Math.random() * 1000)}`;
};


export const orderPayment = async (req,res)=>{
    try{ 
          let {name,
      state,
      city,
      locality,
      auctionType,
      budget,
      amount,
      number
    } = req?.body;
     
    console.log(chalk.green(JSON.stringify(req.body)));
   
    let key = '';
    let merchantId = '';
    let redirectionUrl = '';
    let callbackUrl = '';
    let URL = '';
    if(process.env.WORKING_ENV == "development")
      {
          key = process.env.PHONEPAY_SALT_TESTING;
          merchantId =  process.env.PHONEPAY_MERCHANT_TESTING;
          redirectionUrl = process.env.redirectUrlPhonePayTesting;
          callbackUrl = process.env.callbackUrlPhonePayTesting;
          URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

      }
      else
      {
        key = process.env.PHONEPAY_SALT_PRODUCTION ;
        merchantId =  process.env.PHONEPAY_MERCHANT_PRODUCTION;
        redirectionUrl = process.env.redirectUrlPhonePayProduction;
        callbackUrl = process.env.callbackUrlPhonePayProduction;
        URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";


      }
    const createOrder = new PaymentModel({
      name,
      state,
      city,
      locality,
      auctionType,
      budget,
      amount,
      number
    });  
  
    await createOrder.save();
    
    const data = {
        // merchantId: "M22K8UH34V1RW",
        // merchantId: "PGTESTPAYUAT86",
        merchantId,
        merchantTransactionId:createOrder?._id||"SOMETHING IS WRONG",
        merchantUserId:'MUID'+req.userid,
        amount: 100*(createOrder.amount||1500),
        name:name,  
        redirectUrl: `${redirectionUrl}/${createOrder?._id}`,
        redirectMode: "POST",
        callbackUrl: `${callbackUrl}/${createOrder?._id}`,
        mobileNumber: number,
        paymentInstrument: {
          type: "PAY_PAGE"
        }
      }

      const  payload = JSON.stringify(data);
      const payloadMain = Buffer.from(payload).toString('base64');
      // const key = "e9a87a23-76de-4156-968f-efd0018afdb8";
      // const key = "96434309-7796-489d-8924-ab56988a6076";
      const keyIndex = 1;
      const string = payloadMain + '/pg/v1/pay' + key;
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const checkSum = sha256 + '###' + keyIndex;

      // const URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
      // const URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

      const options = {
        method:'POST',
        url:URL,
        headers:{
          accept:'application/json',
          'Content-Type':'application/json',
          'X-VERIFY':checkSum
        },
        data:{
            request:payloadMain
        }
      }
      
      axios
      .request(options)
      .then(function (response){

    
        return res.status(200).send(response.data.data.instrumentResponse.redirectInfo.url)
      })
    }catch(err)
    {
        res.status(500).json({status:false,message:"Something went wrong !!",err});
    }
}



export const checkStatus = async (req, res) => {
  try {
    let key = '';
    let merchantId = '';
    let redirectionUrl = '';
    let callbackUrl = '';
    let URL = '';
    let redirectionUrlFrontendSUCCESS = '';
    let redirectionUrlFrontendFAIL ='';

    console.log(chalk.redBright("HEre we go "))
    if(process.env.WORKING_ENV == "development")
      {
          key = process.env.PHONEPAY_SALT_TESTING;
          merchantId =  process.env.PHONEPAY_MERCHANT_TESTING;
          redirectionUrl = process.env.redirectUrlPhonePayTesting;
          callbackUrl = process.env.callbackUrlPhonePayTesting;
          URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status";
          redirectionUrlFrontendSUCCESS = process.env.REDIRECTION_SUCCESS_URL_FRONTEND_TESTING;
          redirectionUrlFrontendFAIL = process.env.REDIRECTION_FAIL_URL_FRONTEND_TESTING;

      }
      else
      {
        key = process.env.PHONEPAY_SALT_PRODUCTION ;
        merchantId =  process.env.PHONEPAY_MERCHANT_PRODUCTION;
        redirectionUrl = process.env.redirectUrlPhonePayProduction;
        callbackUrl = process.env.callbackUrlPhonePayProduction;
        URL = "https://api.phonepe.com/apis/hermes/pg/v1/status";
        redirectionUrlFrontendSUCCESS = process.env.REDIRECTION_SUCCESS_URL_FRONTEND_PRODUCTION;
        redirectionUrlFrontendFAIL = process.env.REDIRECTION_FAIL_URL_FRONTEND_PRODUCTION;



      }

    const merchantTransactionId = req.params['txnId'];

    const saltKey = key;
    const keyIndex = 1;

    // Generate the checksum
    const stringToHash = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const checksum = `${sha256}###${keyIndex}`;

    // Set up the API request options
    const options = {
      method: 'GET',
      url: `${URL}/${merchantId}/${merchantTransactionId}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': merchantId,
      },
    };

    // Make the API request
    const response = await axios.request(options);

    const updatedPayment = await PaymentModel.findById({ _id:response.data.data.merchantTransactionId });
    
 

    if (!updatedPayment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }


    if (response.data.success && updatedPayment) {

      updatedPayment.transactionStatus = "SUCCESS";
      updatedPayment.orderId = response.data.data.transactionId;

      await updatedPayment.save();
      return res.status(200).redirect(redirectionUrlFrontendSUCCESS);
    } else {
      updatedPayment.transactionStatus = "FAILED";
      updatedPayment.orderId = response.data.data.transactionId;
      await updatedPayment.save();

      return res.status(400).redirect(redirectionUrlFrontendFAIL);
    }

  } catch (err) {
    console.error("Error in checkStatus:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Adjust the path to your Payment model

// @desc Create a new payment
// @route POST /api/payments
// @access Public
export const createPayment = asyncHandler(async (req, res) => {
  const {
      name,
      state,
      city,
      locality,
      auctionType,
      budget,
  } = req.body;
  
  const genTransactionId = generateTransactionId();  

  const payment = new PaymentModel({
      orderId:genTransactionId,
      name,
      state,
      city,
      locality,
      auctionType,
      budget,
  });

  const createdPayment = await payment.save();
  res.status(201).json({createdPayment});
});

// @desc Get all payments
// @route GET /api/payments
// @access Public
export const getPayments = asyncHandler(async (req, res) => {
  const payments = await PaymentModel.find({});
  res.status(200).json(payments);
});

// @desc Get a single payment by ID
// @route GET /api/payments/:id
// @access Public
export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await PaymentModel.findById(req.params.id);

  if (payment) {
      res.status(200).json(payment);
  } else {
      res.status(404);
      throw new Error('Payment not found');
  }
});

// @desc Update a payment
// @route PUT /api/payments/:id
// @access Public
export const updatePayment = asyncHandler(async (req, res) => {
  const { orderId, transactionStatus, name, state, city, locality, auctionType, budget } = req.body;

  const payment = await PaymentModel.findById(req.params.id);

  if (payment) {
      payment.orderId = orderId || payment.orderId;
      payment.transactionStatus = transactionStatus || payment.transactionStatus;
      payment.name = name || payment.name;
      payment.state = state || payment.state;
      payment.city = city || payment.city;
      payment.locality = locality || payment.locality;
      payment.auctionType = auctionType || payment.auctionType;
      payment.budget = budget || payment.budget;

      const updatedPayment = await payment.save();
      res.status(200).json(updatedPayment);
  } else {
      res.status(404);
      throw new Error('Payment not found');
  }
});

// @desc Delete a payment
// @route DELETE /api/payments/:id
// @access Public
export const deletePayment = asyncHandler(async (req, res) => {
  const payment = await PaymentModel.findById(req.params.id);

  if (payment) {
      await payment.remove();
      res.status(200).json({ message: 'Payment deleted' });
  } else {
      res.status(404);
      throw new Error('Payment not found');
  }
});



