import mongoose from "mongoose";

const producteSchema = new mongoose.Schema(
  {
    //-------------------------------String----------------------------------//
    title: { type: String, required: true, unique: true },
    sub_title: { type: String },
    slug: { type: String, required: true, unique: true },
    descrption: { type: String },
    // ---------------------------Boolean-------------------------------------
    statue: { type: Boolean, default: true },
    offer: { type: Boolean, default: false },
    _isShowe: { type: Boolean, default: false },
    // ---------------------------Numbers-------------------------------------
    quantity: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    item_sell: { type: Number, default: 0 },
    price_size: [
      {
        size: { type: String, required: true },
        price: { type: Number, required: true },
        offer_value: { type: Number },
        final_price: { type: Number },
      },
    ],
    // ----------------------------Object------------------------------------//
    img: { type: Object },
    images: { type: [Object] },
    //-----------------------------ObjectId-----------------------------------//
    category: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: "Subcategory",
    },
    brand: { type: mongoose.Types.ObjectId, required: true, ref: "Brands" },
    createBy: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    updateBy: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

producteSchema.virtual("reviews", {
  foreignField: "productId",
  localField: "_id",
  ref: "Review",
});
const Producte = mongoose.model("Product", producteSchema);
export default Producte;
