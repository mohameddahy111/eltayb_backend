import { errorHandler } from "../../utils/errorHandler.js";
import Cart from "../../cart/schema/cart.schema.js";
import { AppError } from "../../utils/appError.js";
import Coupon from "../../coupon/schema/coupon.schema.js";
import Orders from "../schema/orders.schema.js";
import Producte from "../../product/schema/product.schema.js";

export const addCachOrders = errorHandler(async (req, res, next) => {
  const cart = await Cart.findById(req.params.idCart);
  const coupon = await Coupon.findOne({ code: req.body.couponCode });
  if (!cart) return next(new AppError("Cart not found", 404));
  const totalPrice = cart.TAD > 0 ? cart.TAD : cart.totalPrice 
  if (coupon) {
    req.body.totlaPrice = parseFloat(
      totalPrice - (totalPrice * coupon.discont) / 100 +(totalPrice * .15)+10
    ).toFixed(2);
  } else {
    req.body.totlaPrice = parseFloat(totalPrice +(totalPrice*.15)+10).toFixed(2);
  }
  req.body.cartId = cart._id;
  req.body.userId = req.userId;
  req.body.cartItems = cart.cartItems;
  req.body.orgenalPrice = cart.totalPrice;
  req.body.payment_Mathed = 'cash'
  const order = await Orders.insertMany(req.body);

  if (order) {
    let option = cart.cartItems.map((ele) => ({
      updateOne: {
        filter: { _id: ele.productId },
        update: {
          $inc: { stock: -ele.quantity, item_sell: ele.quantity },
        },
      },
    }));
    await Producte.bulkWrite(option);
  }
  await Cart.findByIdAndDelete(cart._id);
  res.status(201).send({ message: "Success created order", order });
});

//----------------------------get all orders ------------------------------------//
export const getAllOrders = errorHandler(async (req, res, next) => {
  const orders = await Orders.find({ userId: req.userId }).populate({
    path: "cartItems.productId",
    select: ["title"],
  });
  res.status(200).send(orders);
});
//----------------------------get order Detils ------------------------------------//
export const getOrdersDetils = errorHandler(async (req, res, next) => {
  const order = await Orders.findOne({ _id: req.params.id });
  res.status(200).send(order);
});

//----------------------------onLien orders ------------------------------------//
export const addOnLineOrders = errorHandler(async (req, res, next) => {
  const cart = await Cart.findById(req.params.idCart);
  const coupon = await Coupon.findOne({ code: req.body.couponCode });
  if (!cart) return next(new AppError("Cart not found", 404));
  const totalPrice = cart.TAD > 0 ? cart.TAD : cart.totalPrice;
  if (coupon) {
    req.body.totlaPrice = parseFloat(
      totalPrice - (totalPrice * coupon.discont) / 100
    ).toFixed(2);
  } else {
    req.body.totlaPrice = parseFloat(totalPrice).toFixed(2);
  }
});
