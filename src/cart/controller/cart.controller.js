import { errorHandler } from "../../utils/errorHandler.js";
import Cart from "../schema/cart.schema.js";

export const addCart = errorHandler(async (req, res, next) => {
  const cartIsExist = await Cart.findOne({ userId: req.userId });
  // console.log(req.userId)
  console.log(req.body)
  if (!cartIsExist) {
    const cart = new Cart({
      userId :req.userId,
      cartItems:[req.body]
    });
    await cart.save();
    res.status(201).send({ message: "Cart added successfully"  , cart});
  } else {
    let item  = cartIsExist.cartItems.find((ele)=>ele.productId == req.body.productId)
    if (item) {
      item.quantity = req.body.quantity || +1
    } else {
      cartIsExist.cartItems.push(req.body);
    }
    
    await cartIsExist.save()
    res.status(201).send({ message: "Cart added successfully"  , cartIsExist});
  }
});

export const updateCart = errorHandler(async (req, res, next) => {});
