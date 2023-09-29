import User from "../users/schema/user.schema.js";
import { AppError } from "../utils/appError.js";
import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  const berrerToken = req.headers["authorization"];
  if (!berrerToken || (berrerToken && !berrerToken.includes("Bearer ")))
    return next(new AppError(" Authorization is Required", 401));
  const token = berrerToken.split(" ")[1];
  const decode = jwt.verify(token, process.env.JWT_USERS, (err, decoded) => {
    if (err) {
      return next(new AppError("token verification failed", 403));
    } else {
      return decoded;
    }
  });
  const user = await User.findById(decode?.id)
  if (!user) {
    return next(new AppError("this user is deleted", 401));
  }
  const time  = parseInt(user.changePasswordAt.getTime()/1000);
  if (time > decode?.iat) {
    return next(new AppError("this token is not failed ", 403));

  } else {
    req.userId = decode?.id
    next()
  }
};
