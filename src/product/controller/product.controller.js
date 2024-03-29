import slugify from "slugify";
import {AppError} from "../../utils/appError.js";
import {errorHandler} from "../../utils/errorHandler.js";
import {addImages} from "../../utils/helper/general.js";
import Producte from "../schema/product.schema.js";
import cloudinary from "../../utils/cloudnery.js";
import ApiFeatures from "../../utils/apiFetchers.js";

export const addProduct = errorHandler(async (req, res, next) => {
  const isExist = await Producte.findOne({title: req.body.title});
  if (isExist) {
    return next(new AppError("this title is used already"), 402);
  }
  req.body.slug = slugify(req.body.title);
  req.body.createBy = req.userId;
  req.body.updateBy = req.userId;
  if (req.files.min_image) {
    req.body.img = await addImages({
      path: req.files.min_image,
      folder: `/prodectes/${req.body.slug}`,
      type: "files"
    });
  }
  if (req.files.images) {
    req.body.images = await addImages({
      path: req.files.images,
      folder: `/prodectes/${req.body.slug}`,
      type: "files"
    });
  }
  if (!req.files.min_image && req.body.url_Img) {
    req.body.img = {id: "", scr: req.body.url_Img};
  }
  const product = new Producte(req.body);
  await product.save();
  res.status(200).send({message: "Producte saved"});
});
//---------------------------apdate Product-------------------------------------//
export const updateProduct = errorHandler(async (req, res, next) => {
  const {id} = req.params;
  const item = await Producte.findById(id);
  if (item.title != req.body.title) {
    const isExist = await Producte.findOne({title: req.body.title});
    isExist && next(new AppError("this title is used already"), 402);
  }
  req.body.slug = slugify(req.body.title);
  req.body.updateBy = req.userId;
  if (req.files.min_image) {
    if (item.img.id) {
      await cloudinary.uploader.destroy(item.img.id);
    }
    req.body.img = await addImages({
      path: req.files.min_image,
      folder: `/prodectes/${req.body.slug}`,
      type: "files"
    });
  }
  if (req.files.images) {
    for (const image of req.files.images) {
      await cloudinary.uploader.destroy(image.id);
    }
    req.body.images = await addImages({
      path: req.files.images,
      folder: `/prodectes/${req.body.slug}`,
      type: "files"
    });
  }
  if (!req.files.min_image && req.body.url_Img) {
    req.body.img = {id: "", scr: req.body.url_Img};
  }
  await Producte.findOneAndUpdate({_id: id}, req.body);
  res.status(200).send({message: "Producte is updated successfully"});
});
//----------------------------getAllProdects--------------------------------//
export const getAllProdects = errorHandler(async (req, res, next) => {
  const all = await Producte.find();
  const pages = Math.ceil(all.length / 16);
  const list = new ApiFeatures(
    Producte.find().populate([
      {
        path: "reviews",
        select: ["comment", "rating"],
        populate: {path: "userId", select: ["name"]}
      },
      {path: "brand", select: ["title"]},
      {path: "category", select: ["title"]}
    ]),
    req.query
  )
    .pagination(pages)
    .fields()
    .sort();
  const data = await list.mongooesQuery;
  res.status(200).send({data, page: list.page});
});
//----------------------------getOneProdect--------------------------------//
export const getOneProdect = errorHandler(async (req, res, next) => {
  const {slug} = req.params;
  console.log(slug);
  const product = await Producte.findOne({slug: slug}).populate([
    {
      path: "reviews",
      select: ["comment", "rating"],
      populate: {path: "userId", select: ["name"]}
    },
    {path: "brand", select: ["title"]},
    {path: "category", select: ["title"]}
  ]);

  res.status(200).send({product});
});

// ----------------------------slider data-------------------------------//
export const getSlider = errorHandler(async (req, res, next) => {
  const swiperProducts = await Producte.find({_isShowe: true}).populate([
    {
      path: "reviews",
      select: ["comment", "rating"],
      populate: {path: "userId", select: ["name"]}
    },
    {path: "brand", select: ["title"]},
    {path: "category", select: ["title"]}
  ]);
  if (!swiperProducts) {
    res.status(404).send({product: []});
  }
  res.status(200).send({product: swiperProducts});
});

//----------------------------chage statue--------------------------------//
export const chageStatue = errorHandler(async (req, res, next) => {
  const {productId, statue} = req.body;
  const item = await Producte.findByIdAndUpdate(
    productId,
    {statue},
    {new: true}
  );
  if (!item) {
    return next(new AppError("this item not found", 404));
  }
  res.status(200).send({message: "statue of product is Changed"});
});

//----------------------------socket io --------------------------------//
