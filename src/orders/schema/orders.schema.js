import mongoose from "mongoose";

const ordersShema = new mongoose.Schema(
  {
    couponCode: { type: String },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    cartId: { type: mongoose.Types.ObjectId, ref: "Cart" },
    payment_Mathed: { type: String, enums: ["credit", "cash"] },
    order_state: { type: String, default: "prepar" },
    pay_state: { type: Boolean, default: false },
    shippingAddress: {
      city: { type: String },
      street: { type: String },
    },
    cartItems: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
        price: { type: Number },
        final_price: { type: Number },
        size: { type: String },
      },
    ],

    payDate: { type: Date },
    totlaPrice: { type: Number, required: true },
    orgenalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);
const Orders = mongoose.model("Orders", ordersShema);
export default Orders;
