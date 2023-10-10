import Orders from "../../orders/schema/orders.schema.js";
import { AppError } from "../../utils/appError.js";
import { errorHandler } from "../../utils/errorHandler.js";
import Review from "../schema/review.schema.js";

export const addReview = errorHandler(async (req, res, next) => {
  // console.log(req.params.productId)
  const review = await Review.findOne({
    $and: [{ userId: req.userId }, { productId: req.params.productId }],
  });
  if (review) {
    return next(new AppError("Review already exists", 409));
  }
  await Orders.findOne({ userId: req.userId })
    .then(async (item) => {
      if (item.cartItems.map((x)=>x.productId== req.params.productId) ) {
        req.body.userId = req.userId;
        req.body.productId = req.params.productId;
        const newReview = await Review.insertMany(req.body);
        res
          .status(201)
          .send({ message: " review added successfully", newReview });
      }else{
       return next(new AppError("to review must buy product", 409));

      }
    })

});

export const updateReview = errorHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId)
  if (!review) {
    return next(new AppError('this review is delete' ,404))
  }
  if(review.userId !=  req.userId)return next(new AppError('only createor can update review'))
  await Review.findByIdAndUpdate(req.params.reviewId , req.body)
res.status(200).send({message :'review update successfully '})
});
