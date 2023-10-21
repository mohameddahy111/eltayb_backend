import express from 'express';
import { addCart, removItem  ,getUserCart} from '../controller/cart.controller.js';
import { deleteItem, } from '../../utils/helper/general.js';
import Cart from '../schema/cart.schema.js';
import { auth } from '../../middleware/auth.js';
import { rolles } from '../../middleware/rolles.js';
import orderRouter from '../../orders/router/orders.router.js';
const router = express.Router()
router.use("/:idCart/order" ,orderRouter )

router.post('/' , auth , rolles(['user' , "admin"]), addCart).get("/",auth ,getUserCart).patch('/' , auth , removItem)
router.delete('/:id' ,auth, deleteItem(Cart))
export default router 