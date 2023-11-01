import express from 'express';
import { uploadCloud } from '../../middleware/cloudinero.js';
import { auth } from '../../middleware/auth.js';
import { rolles } from '../../middleware/rolles.js';
import { deleteItem, getAll } from '../../utils/helper/general.js';
import Brands from '../schema/brands.schema.js';
import { addBrands, getAllBrands, updateBrands } from '../controller/brands.controller.js';

const router = express.Router({mergeParams :true})
router.get('/' , getAllBrands)
router.post('/'  ,auth, rolles(['admin']) , uploadCloud().single('img') ,addBrands )
router.patch('/:id'  ,auth, rolles(['admin']) , uploadCloud().single('img') ,updateBrands )
router.delete('/:id' ,auth, rolles(['admin']) , deleteItem(Brands))
export default router