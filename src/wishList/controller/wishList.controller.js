import { AppError } from "../../utils/appError.js";
import { errorHandler } from "../../utils/errorHandler.js";
import List from "../schema/wishList.schema.js";

export const addToWishList = errorHandler(async (req, res, next) => {
  const {id } = req.body;
  const user = await List.findOne({userId :req.userId});
  if (user) {
    const product = user.products.find((x)=>x.productId == id)
    if (product) {
    // const productsList = user.products.filter((x)=>x.productId != id)
      // await List.findByIdAndUpdate(req.userId, {products :productsList })
      List.products.pull(id)
      await List.save()
      res.status(209).send({ message: "Success Remove item from Wish List" });
    } else {
      List.products.push(id)
      await List.save()

    //  const productsList = user.products.push(id)
    //   await List.findByIdAndUpdate(req.userId, {products :productsList })
      res.status(200).send({ message: "Success Add item to Wish List" });
      
    }
  } else {
    await List.insertMany({userId : req.userId , products :[id]})
    res.status(201).send({ message: "Success Add item to Wish List" });
  }
});

export const getWishList = errorHandler(async(req, res,next)=>{
  const wishList = await List.findById({userId:req.userId}).populate('products.productId')
  if (wishList) {
   return res.status(200).send({message :'wish List is Empty'});
  }
  res.status(200).send(wishList);
})
