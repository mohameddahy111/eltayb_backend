import { AppError } from "../../utils/appError.js";
import { errorHandler } from "../../utils/errorHandler.js";
import User from "../schema/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//---------------------------get all -------------------------------------//
export const getAllUsers = errorHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).send(users);
});
//---------------------------  add user -------------------------------------//

export const addUser = errorHandler(async (req, res, next) => {
  const findUser = await User.findOne({ email: req.body.email });
  if (findUser) return next(new AppError("this user already exists", 401));
  const user = new User(req.body);
  await user.save();
  if (!user) {
    return next(new AppError(" Error inserting user"), 404);
  }
  res.status(200).send("success add user");
});

//--------------------------- log in  -------------------------------------//

export const login = errorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const findEmail = await User.findOne({ email });
  // if(findEmail._isActive == true) return next(new AppError("this user already log in",))
  if (findEmail) {
    let match = bcrypt.compareSync(
      password,
      findEmail.password,
      process.env.SALT
    );
    if (!match) return next(new AppError("password mismatch"), 403);
    const token = jwt.sign({ id: findEmail._id },process.env.JWT_USERS , {expiresIn :6});
    await User.findByIdAndUpdate({ _id: findEmail._id }, { _isActive: true });
    res.status(200).send({ mesage: "success login", token });
  } else {
    return next(new AppError(" this email is not correct"), 404);
  }
});
