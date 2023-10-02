import mongoose from "mongoose";

const ordersShema =new mongoose.Schema({
  comment :{type :String , required : [true , 'review comment is required '],trim:true },
  rating :{type :Number , max :5 , min:1},
  userId :{type :mongoose.Types.ObjectId , ref:"User" ,  required :true},
  productId :{type :mongoose.Types.ObjectId , ref:"Product" ,  required :true},


},{timestamps:true});
const Orders  = mongoose.model("Orders" , ordersShema)
export default Orders