import { AppError } from "../../utils/appError.js";
import { errorHandler } from "../../utils/errorHandler.js";
import List from "../schema/wishList.schema.js";

export const addToWishList = errorHandler(async (req, res, next) => {
  const { productId } = req.body;
  const user = await List.findOne({ userId: req.userId });
  if (user) {
    const product = user.products.find((x) => x.productId == productId);
    console.log(product);
    if (product) {
      const productsList = user.products.filter((x) => x.productId != productId);
      await List.findOneAndUpdate(
        { userId: req.userId },
        { products: productsList }
      );
      res.status(209).send({ message: "Success Remove item from Wish List" });
    } else {
      const productsListr = user.products.concat(req.body);

      await List.findOneAndUpdate(
        { userId: req.userId },
        { products: productsListr }
      );
      res.status(200).send({ message: "Success Add item to Wish List" });
    }
  } else {
await List.insertMany({userId :req.userId, products:req.body})
    res.status(201).send({ message: "Success Add item to Wish List" });
  }
});

export const getWishList = errorHandler(async (req, res, next) => {
  const wishList = await List.findOne({ userId: req.userId }).populate(
    {
      path:"products.productId" 
    }
    
  );
  if (!wishList) {
    return res.status(200).send({ message: "wish List is Empty" });
  }
  res.status(200).send(wishList);
});
