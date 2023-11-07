import express from "express";
import { auth } from "../../middleware/auth.js";
import { rolles } from "../../middleware/rolles.js";
import { getAllChats } from "../controller/chat.controller.js";

const router = express.Router()
router.get('/' , auth , rolles(['admin']) , getAllChats)
export default router