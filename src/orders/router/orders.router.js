import express from 'express';
import { addCachOrders,addOnLineOrders, getAllOrders, getOrdersDetils  } from '../controller/orders.controller.js';
import { auth } from '../../middleware/auth.js';
const router = express.Router({mergeParams :true})
router.post('/cash' , auth, addCachOrders).post("/online", auth, addOnLineOrders)
router.get('/' , auth , getAllOrders)
router.get('/:id' , auth , getOrdersDetils)
export default router