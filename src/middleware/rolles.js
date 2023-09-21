import User from "../users/schema/user.schema.js"
import { AppError } from "../utils/appError.js"
// const rolle = ['admin' , 'user' , 'editor' , 'manager' , ]
export const rolles = (roll)=>{
// console.log(typeof roll )
 return async (req , res ,next) => {
  const findUser = await User.findById(req.userId)
  !findUser&&  next(new AppError('User not found' ,404))
  const match =[]
  roll.map((x)=>{
    if (x == findUser._isAdmin) {
      match.push(x)
    }
  })
  if (match.length >0) {
    next()
  } else {
    
    next(new AppError('not allowed to roll user' ,403))
  }  


}
}
