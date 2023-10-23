import express  from "express"
import { addToWishList, getWishList } from "../controller/wishList.controller.js"
import {auth} from '../../middleware/auth.js'



const router = express.Router()
router.post('/' , auth , addToWishList)
router.get('/' , auth , getWishList)
export default router