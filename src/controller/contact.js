import chalk from "chalk";
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
export const getContactDetails = asyncHandler(async (req, res) => {
  const data = await prospectsModel.find().lean();
  try {
    let { startDate, endDate } = req.query;

    let filter = {}; // Default empty filter (fetch all leads)

    if (startDate && endDate) {
      // If both startDate and endDate are provided
      filter.$or = [
        {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      ];
    } else if (startDate) {
      // If only startDate is provided, get records from that date onward
      filter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      // If only endDate is provided, get records up to that date
      filter.createdAt = { $lte: new Date(endDate) };
    }

    // Fetch filtered leads (or all leads if no filter applied)
    const leads = await prospectsModel.find(filter).sort({ createdAt: -1 });
    const explain = await prospectsModel
      .find(filter)
      .sort({ createdAt: -1 })
      .explain();

    console.log("explain", explain);
    console.log("explain", JSON.stringify(filter));

    res.status(200).json({
      status: true,
      message: "Data Fetched successfully",
      data: leads,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
export const deleteContactDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await prospectsModel.findOneAndDelete({ _id: id });

  if (!data) {
    res.status(400).json({ status: true, message: "Data Deletion Failed !!" });
  }
  res
    .status(200)
    .json({ status: true, message: "Data Deleted  successfully", data });
});
