import Producte from "../../product/schema/product.schema.js";
import { AppError } from "../../utils/appError.js";
import { errorHandler } from "../../utils/errorHandler.js";
import Cart from "../schema/cart.schema.js";

export const addCart = errorHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await Producte.findOne({ _id: productId });
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  if (quantity > product.stock) {
    return next(new AppError(`we have only  ${product.stock} from this product `, 404));
  }
 const size_price =  product.price_size.find((x)=>x.size ==req.body.size );
 req.body.size = size_price.size
 req.body.price = size_price.price
  // req.body.descount = product.descount 
  req.body.final_price = product.final_price

  const isExistCart = await Cart.findOne({ userId: req.userId });
  if (!isExistCart) {
    const cart = new Cart({
      userId: req.userId,
      cartItems: req.body,
    });
    await cart.save();
    res.status(201).send({ message: "item is add to cart" });
  } else {
    const product = isExistCart.cartItems.find(
      (item) => item.productId == productId
    );
    if (product) {
      if (product.size == req.body.size) {
        product.quantity = quantity || product.quantity + 1
      }
    } else {
      isExistCart.cartItems.push(req.body);
    }
    isExistCart.save();
    res.status(200).send({ message: "cart is update " });
  }
});

export const removItem = errorHandler(async (req, res, next) => {
  const userCart = await Cart.findOne({userId :req.userId})
  const cart = await Cart.findOneAndUpdate(
    { userId: req.userId },
    { cartItems: userCart.cartItems.filter((item)=>item.productId != req.body.cartId) } ,
    {new :true}
  );
  if(!cart){return next(new AppError('this item is not is exist in cart'))}
  res.status(200).send({ message: "item is delete"})
});


export const getUserCart = errorHandler(async (req, res, next) => {
  const cart  = await Cart. findOne({userId:req.userId})
  if (!cart) {
    return next(new AppError("you don't have cart" , 404));
  }
  res.status(200).send({ cart})
})
