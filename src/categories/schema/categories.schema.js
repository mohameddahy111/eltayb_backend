import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema({
  title :{type : String , required :true , unique: true },
  img :{type:Object},
  createdBy:{type:mongoose.Types.ObjectId , ref :"User"},
  updatedBy:{type:mongoose.Types.ObjectId , ref :"User"}

},{timestamps :true ,toJSON:{virtuals:true } , toObject:{virtuals:true}})

categoriesSchema.virtual("brands" , {
  ref:"Brands",
  localField:"_id",
  foreignField:"categoryId"
})


const Category =  mongoose.model("Category" , categoriesSchema)
export default Category