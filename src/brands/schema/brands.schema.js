import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema({
  title :{type : String , required :true , unique: true },
  img :{type:Object},
  categoryId: {type:mongoose.Types.ObjectId, ref :"Category" , required :true},
  createdBy:{type:mongoose.Types.ObjectId , ref :"User"},
  updatedBy:{type:mongoose.Types.ObjectId , ref :"User"}

},{timestamps :true ,toJSON:{virtuals :true} , toObject:{virtuals :true}})

const Brands =  mongoose.model("Brands" , categoriesSchema)
export default Brands