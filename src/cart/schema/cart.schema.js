import mongoose from "mongoose";

const cartShema = new mongoose.Schema(
  {
    userId: {type: mongoose.Types.ObjectId, ref: "User" },
    cartItems: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: "product" },
        quantity: { type: Number, },
        price: { type: Number },
      },
    ],
    totalPrice: { type: Number },
    descount: { type: Number }, 
    TAD: { type: Number },
  },
  { timestamps: true }
);
const Cart = mongoose.model("Cart", cartShema);
export default Cart;
