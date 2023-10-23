import mongoose from"mongoose";

const wishList = new mongoose.Schema({
  userId :{type  : mongoose.Types.ObjectId  , ref :'User'},
  products :{type :Array}
})

const List  = mongoose.model('WishList', wishList)
export default List