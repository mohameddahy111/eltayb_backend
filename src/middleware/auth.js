import { AppError } from "../utils/appError.js";
import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  const berrerToken = req.headers["authorization"];
  if (!berrerToken || (berrerToken && !berrerToken.includes("Bearer ")))
   return next(new AppError(  " Authorization is Required" , 401));
  const token = berrerToken.split(' ')[1]
  jwt.verify(token , process.env.JWT_USERS , (err , decoded)=>{
    if ( decoded.exp < parseFloat(new Date().getTime()/1000).toFixed(2)) {
      // console.log(parseFloat(new Date().getTime()/1000).toFixed(2))
      return next(new AppError('token verification failed' , 403))
    } else {
        req.userId = decoded.id
        next()
    }  
})
} 