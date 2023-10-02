import express from 'express';
import { addCart } from '../controller/cart.controller.js';
import { deleteItem, getAll } from '../../utils/helper/general.js';
import Cart from '../schema/cart.schema.js';
import { auth } from '../../middleware/auth.js';
import { rolles } from '../../middleware/rolles.js';
const router = express.Router()
router.post('/' , auth , rolles(['user , admin']), addCart).get("/" , getAll(Cart))
router.delete('/:id' , deleteItem(Cart))
export default router