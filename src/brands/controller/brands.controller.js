import { AppError } from "../../utils/appError.js";
import { errorHandler } from "../../utils/errorHandler.js";
import Brands from "../schema/brands.schema.js";
import cloudinary from "../../utils/cloudnery.js";
//----------------------------add Brands------------------------------------//
export const addBrands = errorHandler(async (req, res, next) => {
  const isExist = await Brands.findOne({ title: req.body.title });
  const { idCategory } = req.params;
  if (isExist) {
    return next(new AppError("this title already exists"), 401);
  }
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "categories/brands" }
    );
    req.body.img = { id: public_id, scr: secure_url };
  }
  if (!req.file && req.body.url) {
    req.body.img = { id: "", scr: req.body.url };
  }
  req.body.createdBy = req.userId;
  req.body.categoryId = idCategory;
  await Brands.insertMany(req.body);
  res.status(200).send({ message: "success add Brands" });
});

//---------------------------- get all Brtands---------------------------------------------------//
export const getAllBrands = errorHandler(async (req, res, next) => {
  const { idCategory } = req.params;
  const brands = await Brands.find({ categoryId: idCategory });
  res.status(200).send(brands);
});

// ------------------------------update Brands----------------------------------//
export const updateBrands = errorHandler(async (req, res, next) => {
  const { id } = req.params;
  const findBrands = await Brands.findById(id);
  if (!findBrands) {
    return next(new AppError("this Brands not isExist "), 400);
  }
  if (findBrands.title != req.body.title) {
    const isExist = await Brands.findOne({ title: req.body.title });
    if (isExist) {
      return next(new AppError("this title is use"), 402);
    }
  }
  if (req.file) {
    await cloudinary.uploader.destroy(findBrands.img.id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "categories/brands" }
    );
    req.body.img = { id: public_id, scr: secure_url };
  }
  if (!req.file && req.body.url) {
    req.body.img = { id: "", scr: req.body.url };
  }

  req.body.updatedBy = req.userId;
  await Brands.findByIdAndUpdate(id, req.body);
  res.status(200).send("success update Brands ");
});
