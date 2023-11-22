import ApiFeatures from "../apiFetchers.js";
import { AppError } from "../appError.js";
import cloudinary from "../cloudnery.js";
import { errorHandler } from "../errorHandler.js";

export const getAll = (shema, option,query ) => {
  return errorHandler(async (req, res, next) => {
    let data = await shema.find().populate(option)
    res.status(200).send(data);
  });
};
export const deleteItem = (shema) => {
  return errorHandler(async (req, res, next) => {
    const { id } = req.params;
    const item = await shema.findByIdAndDelete(id);
    if (!item) {
      return next(new AppError("this id not found"));
    }
    if (item.img.id) {
      await cloudinary.uploader.destroy(item.img.id);
    }
    if (item.images) {
      for (const x of item.images) {
        await cloudinary.uploader.destroy(x.id);
      }
    }

    res.status(200).send("Item  is deleted");
  });
};

export const addImages = async (options) => {
  if (!options.path) {
    return "";
  }
  if (options.type == "files") {
    const array = [];
    for (const file of options.path) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: options.folder }
      );
      array.push({ id: public_id, scr: secure_url });
    }
    return array.length > 1 ? array : { id: array[0].id, scr: array[0].scr };
  } else {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      options.path,
      { folder: options.folder }
    );
    return { id: public_id, scr: secure_url };
  }
};
