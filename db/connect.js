import mongoose from "mongoose"

export const connect = ()=>{
  mongoose.connect(process.env.MONGOBD).then(()=>{
    console.log('connect')
  }).catch((err)=>console.log(err.message))
}