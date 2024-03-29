import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userschema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  _isAdmin: { type: String, default: 'user' },
  _isBlocked: { type: Boolean, default: false },
  _isVerify: { type: Boolean, default: true },
  _isActive: { type: Boolean, default: false },
  changePasswordAt:{type: Date}
},{timestamps:true});

userschema.pre( "save", function(){
  this.password = bcrypt.hashSync(this.password , +process.env.SALT)
})
userschema.pre( "findOneAndUpdate", function(){
  if (this._update.password) {
    this._update.password = bcrypt.hashSync(this._update.password , +process.env.SALT)
  }
})

const User = mongoose.model("User", userschema);
export default User;
 