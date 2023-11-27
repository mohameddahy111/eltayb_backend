import {errorHandler} from "../../utils/errorHandler.js";
import Cart from "../../cart/schema/cart.schema.js";
import {AppError} from "../../utils/appError.js";
import Coupon from "../../coupon/schema/coupon.schema.js";
import Orders from "../schema/orders.schema.js";
import Producte from "../../product/schema/product.schema.js";
import ApiFeatures from "../../utils/apiFetchers.js";

export const addCachOrders = errorHandler(async (req, res, next) => {
  const cart = await Cart.findById(req.params.idCart);
  const coupon = await Coupon.findOne({code: req.body.couponCode});
  if (!cart) return next(new AppError("Cart not found", 404));
  const totalPrice = cart.TAD > 0 ? cart.TAD : cart.totalPrice;
  if (coupon) {
    req.body.totlaPrice = parseFloat(
      totalPrice - (totalPrice * coupon.discont) / 100 + totalPrice * 0.14 + 10
    ).toFixed(2);
  } else {
    req.body.totlaPrice = parseFloat(
      totalPrice + totalPrice * 0.14 + 10
    ).toFixed(2);
  }
  req.body.cartId = cart._id;
  req.body.userId = req.userId;
  req.body.cartItems = cart.cartItems;
  req.body.orgenalPrice = cart.totalPrice;
  req.body.payment_Mathed = "cash";
  const order = await Orders.insertMany(req.body);

  if (order) {
    let option = cart.cartItems.map((ele) => ({
      updateOne: {
        filter: {_id: ele.productId},
        update: {
          $inc: {stock: -ele.quantity, item_sell: ele.quantity}
        }
      }
    }));
    await Producte.bulkWrite(option);
  }
  await Cart.findByIdAndDelete(cart._id);
  res.status(201).send({message: "Success created order", order});
});

//----------------------------get all orders ------------------------------------//
export const getAllUserOrders = errorHandler(async (req, res, next) => {
  const all = await Orders.find({_id: req.params.id});
  const pages = Math.ceil(all.length / 10);
  const list = new ApiFeatures(
    Orders.find({_id: req.params.id}).populate([
      {path: "cartItems.productId", select: ["title"]}
    ]),
    req.query
  )
    .pagination(pages)
    .fields()
    .sort();
  const data = await list.mongooesQuery;
  res.status(200).send({data, page: list.page});
});
//----------------------------get order Detils ------------------------------------//
export const getOrdersDetils = errorHandler(async (req, res, next) => {
  const order = await Orders.findOne({_id: req.params.id}).populate([
    {path: "cartItems.productId", select: ["title"]},
    {path: "userId", select: ["name", "phone"]}
  ]);
  if (!order) {
    return next(new AppError(`Order not found`, 404));
  }
  res.status(200).send(order);
});

//----------------------------getAllOrders --------------------------------//
export const getAllOrders = errorHandler(async (req, res, next) => {
  const all = await Orders.find();
  const pages = Math.ceil(all.length / 10);
  const list = new ApiFeatures(
    Orders.find().populate([
      {path: "userId", select: ["name", "phone"]},
      {path: "cartItems.productId", select: ["title"]},
      {path: "accpetBy", select: ["name", "email"]}
    ]),
    req.query
  )
    .pagination(pages)
    .fields()
    .sort();
  const data = await list.mongooesQuery;
  res.status(200).send({data, page: list.page});
});
//----------------------------Get not accept order ------------------------------------//
export const getNotAcceptOrders = errorHandler(async (req, res, next) => {
  const order = await Orders.find({_isAccept: false}).populate(
    {path: "userId", select: ["name"]},
    {path: "cartItems.productId", select: ["title"]}
  );
  res.status(200).send(order);
});
//---------------------------- accept order ------------------------------------//
export const AcceptOrders = errorHandler(async (req, res, next) => {
  const {id} = req.params;
  await Orders.findByIdAndUpdate(
    {_id: id},
    {
      _isAccept: true,
      accpetBy: req.userId
    },
    {new: true}
  );

  res.status(200).send({message: "Accept order "});
});

//----------------------------onLien orders ------------------------------------//
export const addOnLineOrders = errorHandler(async (req, res, next) => {
  const cart = await Cart.findById(req.params.idCart);
  const coupon = await Coupon.findOne({code: req.body.couponCode});
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
