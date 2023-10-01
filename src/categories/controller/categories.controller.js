import { AppError } from "../../utils/appError.js";
import { errorHandler } from "../../utils/errorHandler.js";
import Category from "../schema/categories.schema.js";
import cloudinary from "../../utils/cloudnery.js";
//----------------------------addCategories------------------------------------//
export const addCategories = errorHandler(async (req, res, next) => {
  const isExist = await Category.findOne({ title: req.body.title });
  if (isExist) {
    return next(new AppError("this title already exists"), 401);
  }
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "categories" }
    );
    req.body.img = { id: public_id, scr: secure_url };
  }
  req.body.createdBy = req.userId;
  await Category.insertMany(req.body);
  res.status(200).send({ message: "success add category" });
});

// ------------------------------update Category----------------------------------//
export const updateCategory = errorHandler(async (req, res, next) => {
  const { id } = req.params;
  const findCategory = await Category.findById(id);
  if (!findCategory) {
    return next(new AppError("this category not isExist "), 400);
  }
  if (findCategory.title != req.body.title) {
    const isExist = await Category.findOne({ title:req.body.title });
    if (isExist) {
      return next(new AppError("this title is use"), 402);
    }
  }
  if (req.file) {
    await cloudinary.uploader.destroy(findCategory.img.id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "categories" }
    );
    req.body.img = { id: public_id, scr: secure_url };
  }
  req.body.updatedBy = req.userId
  await Category.findByIdAndUpdate(id , req.body);
  res.status(200).send('success update category ')
});
