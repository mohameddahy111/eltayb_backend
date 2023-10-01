import express from 'express';
import { uploadCloud } from '../../middleware/cloudinero.js';
import { addCategories  , updateCategory} from '../controller/categories.controller.js';
import { auth } from '../../middleware/auth.js';
import { rolles } from '../../middleware/rolles.js';
import { deleteItem, getAll } from '../../utils/helper/general.js';
import Category from '../schema/categories.schema.js';
import brandsRouter from '../../brands/router/brands.router.js';

const router = express.Router()
router.use('/:idCategory/brands' , brandsRouter)
router.get('/' , getAll(Category ,"brands"))
router.post('/'  ,auth, rolles(['admin']) , uploadCloud().single('img'), addCategories)
router.patch('/:id'  ,auth, rolles(['admin']) , uploadCloud().single('img') , updateCategory)
router.delete('/:id' ,auth, rolles(['admin']) , deleteItem(Category))
export default router