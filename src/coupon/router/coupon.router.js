import express from 'express';
import { createCoupon } from '../controller/coupon.controller.js';
import { deleteItem, getAll } from '../../utils/helper/general.js';
import Coupon from '../schema/coupon.schema.js';
const router = express.Router()
router.post('/' , createCoupon)
router.get('/' , getAll(Coupon))
router.delete('/:id' , deleteItem(Coupon))

export default router