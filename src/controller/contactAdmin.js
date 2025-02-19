import { adminContact } from "../model/adminContact.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

export const submitAdminContact = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!name && !email && !phone && !address) {
    res
      .status(500)
      .json({ status: false, message: "Incomplete form parameters" });
  } else {
    await adminContact.create(req.body);
    res
      .status(200)
      .json({ status: true, message: "Contact Added successfully" });
  }
});
export const getAdminContact = asyncHandler(async (req, res) => {
  const data = await adminContact.find({});
  res
    .status(200)
    .json({ status: true, message: "Contact Added successfully", data: data });
});
export const updateAdminContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;
  const isExist = adminContact.findById({ _id: id });
  if (!isExist) {
    res
      .status(400)
      .json({ status: false, message: "Data not found!!", data: null });
  }

  const data = await adminContact.findByIdAndUpdate(
    { _id: id },
    {
      name,
      email,
      phone,
      address,
    }
  );
  res.status(200).json({
    status: true,
    message: "Admin Contact Updated successfully",
    data: data,
  });
});

export const updateActiveStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isExist = await adminContact.findOne({ _id: id }).lean();
  console.log(isExist, "isExist");
  if (!isExist) {
    res
      .status(400)
      .json({ status: false, message: "Data not found!!", data: null });
  }

  // await adminContact.updateMany(
  //   {},
  //   {
  //     activeAddress: false,
  //   }
  // );
  const data = await adminContact.findByIdAndUpdate(
    { _id: id },
    {
      activeAddress: !isExist?.activeAddress,
    }
  );
  res.status(200).json({
    status: true,
    message: "Admin Contact Activated",
    data: data,
  });
});

export const getSingleActiveContact = asyncHandler(async (req, res) => {
  const data = await adminContact.find({ activeAddress: true });
  res
    .status(200)
    .json({ status: true, message: "Contact Added successfully", data: data });
});
