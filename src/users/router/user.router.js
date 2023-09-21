import express from 'express';
import { addUser, getAllUsers, login } from '../controller/user.controller.js';
import { auth } from '../../middleware/auth.js';
import { rolles } from '../../middleware/rolles.js';
import { validetor } from '../../middleware/valitetor.js';
import { adduserValidation, loginValidation } from '../validtion/user.validtion.js';

const router = express.Router()
router.get('/' ,auth,rolles(['admin' , 'user']), getAllUsers)
router.post('/' ,validetor(adduserValidation)  ,addUser)
router.post('/login',validetor(loginValidation), login)

export default router  