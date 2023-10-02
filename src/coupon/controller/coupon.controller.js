import { AppError } from "../../utils/appError.js";
import { errorHandler } from "../../utils/errorHandler.js";
import Coupon from "../schema/coupon.schema.js";
import QRCode from "qrcode";

export const createCoupon = errorHandler(async (req, res, next) => {
  const { code } = req.body;
  const isExist = await Coupon.findOne({ code });
  if (isExist) {
    return next(new AppError("this code is already exists" ,402));
  }
  req.body.QR = await QRCode.toDataURL(req.body.code);
  await Coupon.insertMany(req.body);
  res.status(201).send({ message: "Success created coupon" });
});
export const updateCoupon = errorHandler(async (req, res, next) => {});
