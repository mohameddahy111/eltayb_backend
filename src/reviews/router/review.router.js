import express from 'express';
import { addReview, updateReview } from '../controller/review.controller.js';
import { deleteItem, getAll } from '../../utils/helper/general.js';
import Review from '../schema/review.schema.js';
import { auth } from '../../middleware/auth.js';


const router = express.Router({mergeParams :true})
router.post('/' ,auth, addReview).get('/' , getAll(Review))
router.delete('/:id' , auth , deleteItem(Review))
router.patch('/:reviewId', auth, updateReview)
export default router