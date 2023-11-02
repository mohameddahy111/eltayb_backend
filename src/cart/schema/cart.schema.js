import mongoose from "mongoose";

const cartShema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    cartItems: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
        price: { type: Number },
        final_price: { type: Number },
        size :{type :String}
        
      },
    ],
    totalPrice: { type: Number },
    descount: { type: Number },
    TAD: { type: Number },
  },
  { timestamps: true }
);

cartShema.pre("save", function () {
  let price = 0;
  let TAD =0

    this.cartItems.forEach((ele) => {
      price = price +( ele.price * ele.quantity)
      TAD = TAD + (ele.final_price *ele.quantity )
    })
  this.totalPrice = price;
  this.TAD = TAD;
});
cartShema.pre("findOneAndUpdate", function () {
  let price = 0;
  let TAD =0
    this._update.cartItems.forEach((ele) => {
      price = price +( ele.price * ele.quantity)
      TAD = TAD +(ele.final_price * ele.quantity)

    })
  this._update.totalPrice = price;
  this._update.TAD = TAD;
  
});
const Cart = mongoose.model("Cart", cartShema);
export default Cart;
