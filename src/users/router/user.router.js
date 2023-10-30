import express from 'express';
import { addUser, changePassword, forgetPassword, getUserDetils, getUserInfo, login, updateUser, verfiyemail } from '../controller/user.controller.js';
import { auth } from '../../middleware/auth.js';
import { rolles } from '../../middleware/rolles.js';
import { validetor } from '../../middleware/valitetor.js';
import { adduserValidation, loginValidation } from '../validtion/user.validtion.js';
import { deleteItem, getAll } from '../../utils/helper/general.js';
import User from '../schema/user.schema.js';

const router = express.Router()
router.get('/' ,auth,rolles(['admin']), getAll(User))
router.get('/verfiy/:id' , verfiyemail)
router.get('/userInfo' , auth , getUserInfo)
router.get('/admin/user/:userId' , auth,rolles(['admin']) , getUserDetils)

router.post('/' ,validetor(adduserValidation)  ,addUser)
router.post('/login',validetor(loginValidation), login)

router.patch('/forget_password',validetor(loginValidation), forgetPassword)
router.patch('/change_password/:id', changePassword)
router.patch('/' ,auth,validetor(adduserValidation)  ,updateUser)
router.delete('/:id' ,auth,rolles(['admin' ]), deleteItem(User))

export default router   