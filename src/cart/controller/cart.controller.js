import Producte from "../../product/schema/product.schema.js";
import { AppError } from "../../utils/appError.js";
import { errorHandler } from "../../utils/errorHandler.js";
import Cart from "../schema/cart.schema.js";

export const addCart = errorHandler(async (req, res, next) => {
  const { productId, quantity, size } = req.body;
  const product = await Producte.findOne({ _id: productId });
  const findSize = product.price_size.find((x) => x.size == size);
  if (!findSize || findSize == null)
    return next(new AppError("sorry this item not available now ", 404));
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  if (quantity > product.stock) {
    return next(
      new AppError(`we have only  ${product.stock} from this product `, 404)
    );
  }
  const size_price = product.price_size.find((x) => x.size == size);
  req.body.price = size_price.price;
  req.body.descount = size_price.offer_value;
  req.body.final_price = size_price.final_price;

  const isExistCart = await Cart.findOne({ userId: req.userId });
  if (!isExistCart) {
    const cart = new Cart({
      userId: req.userId,
      cartItems: req.body,
    });
    await cart.save();
    res.status(201).send({ message: "item is add to cart" });
  } else {
    const productItem = isExistCart.cartItems.filter(
      (item) => item.productId == productId
    );
    if (productItem.length > 0) {
      const sameSize = productItem.find((ele) => ele.size == size);
      if (sameSize) {
        sameSize.quantity = quantity || sameSize.quantity + 1;
      } else {
        isExistCart.cartItems.push(req.body);
      }
    } else {
      isExistCart.cartItems.push(req.body);
    }
    isExistCart.save();
    res.status(200).send({ message: "cart is update " });
  }
});

export const removItem = errorHandler(async (req, res, next) => {
  const userCart = await Cart.findOne({ userId: req.userId });
  const cart = await Cart.findOneAndUpdate(
    { userId: req.userId },
    {
      cartItems: userCart.cartItems.filter(
        (item) => item._id != req.body.itemId
      ),
    },
    { new: true }
  );
  if (!cart) {
    return next(new AppError("this item is not is exist in cart"));
  }
  res.status(200).send({ message: "item is delete" });
});

export const getUserCart = errorHandler(async (req, res, next) => {
  const oldCart = await Cart.findOne({userId :req.userId})
  const newCart = oldCart?.cartItems.filter(item=>item.productId == null)

  const cart = await Cart.findOneAndUpdate({ userId: req.userId } ,{cartItems :newCart}).populate({
    path: "cartItems.productId",
    select: ["title"],
  });

  if (!cart) {
    return next(new AppError("you don't have cart", 404));
  }
  res.status(200).send({ cart });
});
