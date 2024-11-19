import { prospectsModel } from "../model/prospects.js";
import { uploadFile } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import { sendContactMail, sendEnquiryMail } from "../utils/nodeMailer.js";

export const submitEnquiry = asyncHandler(async (req, res) => {
  const { name, email, mobile, typeOfLoan, loanRequired, pincode } = req.body;
  const document = req.file;
  console.log("----", document);
  let documentUrl = null;
  if (document) {
    const uploadResponse = await uploadFile([document]);
    console.log("----", res);
    documentUrl = uploadResponse.result[0]?.secure_url;
  }
  if (!name || !email || !mobile || !typeOfLoan || !loanRequired || !pincode) {
    res
      .status(500)
      .json({ status: false, message: "Incomplete form parameters" });
  } else {
    const data = {
      name,
      email,
      mobile,
      typeOfLoan,
      loanRequired,
      pincode,
      document: documentUrl,
    };
    await prospectsModel.create(data);
    await sendEnquiryMail(data);
    res
      .status(200)
      .json({ status: true, message: "Enquiry sent successfully" });
  }
});

export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, mobile, message } = req.body;
  if (!name && !email && !mobile && !message) {
    res
      .status(500)
      .json({ status: false, message: "Incomplete form parameters" });
  } else {
    await prospectsModel.create(req.body);
    await sendContactMail(req.body);
    res
      .status(200)
      .json({ status: true, message: "Contact mail sent successfully" });
  }
});
