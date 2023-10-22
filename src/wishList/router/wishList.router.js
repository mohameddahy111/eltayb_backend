import express  from "express"
import { addToWishList } from "../controller/wishList.controller.js"
import {auth} from '../../middleware/auth.js'



const router = express.Router()
router.post('/' , auth , addToWishList)
export default router