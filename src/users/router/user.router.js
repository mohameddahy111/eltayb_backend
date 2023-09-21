import express from 'express';
import { addUser, getAllUsers, login } from '../controller/user.controller.js';
import { auth } from '../../middleware/auth.js';
import { rolles } from '../../middleware/rolles.js';

const router = express.Router()
router.get('/' ,auth,rolles(['admin' , 'user']), getAllUsers)
router.post('/' ,addUser)
router.post('/login', login)

export default router  