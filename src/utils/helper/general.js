import ApiFeatures from "../apiFetchers.js";
import { AppError } from "../appError.js";
import cloudinary from "../cloudnery.js";
import { errorHandler } from "../errorHandler.js";

export const getAll = (shema, option) => {
  return errorHandler(async (req, res, next) => {
    let lestOptions = new ApiFeatures(shema.find().populate(option), req.query)
      .fields()
      .filter()
      .search()
      .sort()
      .pagination();
    const date = await lestOptions.mongooesQuery;
    res.status(200).send(date);
  });
};
export const deleteItem = (shema) => {
  return errorHandler(async (req, res, next) => {
    const { id } = req.params;
    const item = await shema.findOneAndDelete(id);
    if (!item) {
      return next(new AppError("this id not found"));
    }
    if (item.img) {
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
