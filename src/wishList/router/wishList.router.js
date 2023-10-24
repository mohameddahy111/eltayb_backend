import express  from "express"
import { addToWishList, deleteWishList, getWishList } from "../controller/wishList.controller.js"
import {auth} from '../../middleware/auth.js'



const router = express.Router()
router.post('/' , auth , addToWishList)
router.get('/' , auth , getWishList)
router.patch('/'  ,auth , deleteWishList )
export default router