import User from "../users/schema/user.schema.js"
import { AppError } from "../utils/appError.js"
// const rolle = ['admin' , 'user' , 'editor' , 'manager' , ]
export const rolles = (roll)=>{
// console.log(typeof roll )
 return async (req , res ,next) => {
  const findUser = await User.findById(req.userId)
  if (!findUser) {
    next(new AppError('this user is delete not allow to do this ' ,403))
  }
  const match =[]
  roll.map((x)=>{
    if (x == findUser?._isAdmin) {
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
