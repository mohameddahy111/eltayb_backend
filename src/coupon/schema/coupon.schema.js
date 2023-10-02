import mongoose from "mongoose";

const couponShema =new mongoose.Schema({
  code :{type :String , required : true , unique: true},
  discont :{type :Number , min:0 , required : true},
  maxUse :{type :Number , required : true},
  expireDate :{type :String ,  required :true},
  QR :{type :String },


},{timestamps:true});
const Coupon  = mongoose.model("Coupon" , couponShema)
export default Coupon