import express from "express";
import { deleteItem, getAll } from "../../utils/helper/general.js";
import Producte from "../schema/product.schema.js";
import { auth } from "../../middleware/auth.js";
import { rolles } from "../../middleware/rolles.js";
import { uploadCloud } from "../../middleware/cloudinero.js";
import { addProduct, updateProduct } from "../controller/product.controller.js";
const router = express.Router();
router.get("/", getAll(Producte));
router.post(
  "/",
  auth,
  rolles(["admin"]),
  uploadCloud().fields([
    { name: "min_image", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  addProduct
);
router.patch('/:id' , auth , rolles(["admin"]), uploadCloud().fields([    { name: "min_image", maxCount: 1 },
{ name: "images", maxCount: 4 },
]),updateProduct)
router.delete("/:id", deleteItem(Producte));
export default router;
