import { errorHandler } from "../../utils/errorHandler.js";
import List from "../schema/wishList.schema.js";

export const addToWishList = errorHandler(async (req, res, next) => {
  const {id } = req.body;
  const user = await List.findById(req.userId);
  if (user) {
    const product = user.products.find((x)=>x.productId == id)
    if (product) {
     productsList = user.products.filter((x)=>x.productId != id)
      await List.findByIdAndUpdate(req.userId, {products :productsList })
      res.status(200).send({ message: "Success Remove item from Wish List" });
    } else {
      productsList = user.products.push(id)
      await List.findByIdAndUpdate(req.userId, {products :productsList })
      res.status(200).send({ message: "Success Add item to Wish List" });
      
    }
  } else {
    await List.insertMany({userId : req.userId , products :[{productId:id}]})
    res.status(200).send({ message: "Success Add item to Wish List" });
  }
});
