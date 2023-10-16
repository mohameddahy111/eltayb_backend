import { sendVirfiyEmail } from "../../email/sendEmail.js";
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
    return next(new AppError(" Error inserting user" ,404));
  }
  sendVirfiyEmail({
    email :user.email,
    url :`http://localhost:3001/users/verify/${user._id}`
  })
  res.status(201).send("success add user");
});

//--------------------------- log in  -------------------------------------//


export const login = errorHandler(async (req, res, next) => {
  const { password, email } = req.body;
  const findEmail = await User.findOne({ email });
  if (!findEmail) {
    return next(new AppError(" this email is not correct", 404));
  }
  if (!findEmail._isVerify) {
    return next(new AppError(" this email is not verfiy", 409));
  }
  const match =
    findEmail &&
    bcrypt.compareSync(password, findEmail?.password, process.env.SALT);
  if (!match) {
    return next(new AppError("password not match"));
  }
  const token = jwt.sign({ id: findEmail._id }, process.env.JWT_USERS);
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
    return next(new AppError(" this user not found ", 404));
  }
  if (findUser.email != req.body.email) {
    const isExist = await User.findOne({ email: req.body.email });
    if (isExist) {
      return next(new AppError(" this email is already isExist ", 403));
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
    return next(new AppError(" this email is not isExist ", 403));
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
 //------------------------------ verfiy email --------------------------------//
 export const verfiyemail = errorHandler(async (req, res, next) => {
const {id} = req.params;
const user = await User.findByIdAndUpdate(id , {_isVerify :true})
if (!user) {
  return next(new AppError("this user not found "));

}
res.status(200).send({ message: "success verfiy emial" });

});

export const getUserInfo = errorHandler(async (req, res, next) => {
  const user  = await User.findById(req.userId)
  if (!user) {
   return next(new AppError('this user not found' , 404))
  }
  res.status(200).send({message :'user found' , user})
})
