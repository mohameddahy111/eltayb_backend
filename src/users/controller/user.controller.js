import { AppError } from "../../utils/appError.js";
import { errorHandler } from "../../utils/errorHandler.js";
import User from "../schema/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//---------------------------  add user -------------------------------------//
//TODO : verify user email  send email
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

// export const login = errorHandler(async (req, res, next) => {
//   const { email, password } = req.body;
//   const findEmail = await User.findOne({ email });
//   //TODO : check isActive or not
//   // if(findEmail._isActive == true) return next(new AppError("this user already log in",))
//   if (findEmail) {
//    let match = bcrypt.compareSync(password ,findEmail.password, process.env.SALT)
//    console.log(match)
//     if (!match){ return next(new AppError("password mismatch"), 403)};
//     const token = jwt.sign({ id: findEmail._id }, process.env.JWT_USERS, {
//       expiresIn: 60 * 60,
//     });
//     await User.findByIdAndUpdate({ _id: findEmail._id }, { _isActive: true });
//     res.status(200).send({ mesage: "success login", token });
//   } else {
//     return next(new AppError(" this email is not correct"), 404);
//   }
// });

export const login = errorHandler(async (req, res, next) => {
  const { password, email } = req.body;
  const findEmail = await User.findOne({ email });
  if (!findEmail) {
    return next(new AppError(" this email is not correct"), 404);
  }
  const match =
    findEmail &&
    bcrypt.compareSync(password, findEmail?.password, process.env.SALT);
  if (!match) {
    return next(new AppError("password not match"));
  }
  const token = jwt.sign({ id: findEmail._id }, process.env.JWT_USERS, {
    expiresIn: 60 * 60,
  });
  await User.updateOne(
    { _id: findEmail._id },
    { _isActive: true },
    { new: true }
  );
  res.status(200).send({ massge: "success", token });
});
//------------------------------ update user----------------------------------//
export const updateUser = errorHandler(async (req, res, next) => {
  const id = req.userId;
  const findUser = await User.findById(id);
  if (!findUser) {
    return next(new AppError(" this user not found "), 404);
  }
  if (findUser.email != req.body.email) {
    const isExist = await User.findOne({ email: req.body.email });
    if (isExist) {
      return next(new AppError(" this email is already isExist "), 403);
    }
  }
  await User.findOneAndUpdate({ _id: id }, req.body, { new: true });

  res.status(200).send({ message: "success update user" });
});
//------------------------------ forget password ----------------------------------//
// TODO : send email notification when password forget

export const forgetPassword = errorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser) {
    await User.findOneAndUpdate(
      { email },
      { password, changePasswordAt: Date.now() },
      { new: true }
    );
    res.status(200).send({ message: "success update password" });
  } else {
    return next(new AppError(" this email is not isExist "), 403);
  }
});
//------------------------------change password --------------------------------//
export const changePassword = errorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  const findUser = await User.findOneAndUpdate(
    { _id: id },
    { password: newPassword, changePasswordAt: Date.now() },
    { new: true }
  );
  if (!findUser) {
    return next(new AppError("this user not exist "));
  }
  res.status(200).send({ message: "success change password" });
});
