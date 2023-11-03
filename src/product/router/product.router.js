import express from "express";
import { deleteItem, getAll } from "../../utils/helper/general.js";
import Producte from "../schema/product.schema.js";
import { auth } from "../../middleware/auth.js";
import { rolles } from "../../middleware/rolles.js";
import { uploadCloud } from "../../middleware/cloudinero.js";
import {
  addProduct,
  getAllProdects,
  getOneProdect,
  updateProduct,
} from "../controller/product.controller.js";
import reviewRouter from "../../reviews/router/review.router.js";
const router = express.Router();
router.use("/:productId/review/", reviewRouter);
router.get("/", getAllProdects);
router.get("/:slug", getOneProdect);
router.post(
  "/",
  auth,
  // rolles(["admin" ,"user"]),
  uploadCloud().fields([
    { name: "min_image", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  addProduct
);
router.patch(
  "/:id",
  auth,
  rolles(["admin"]),
  uploadCloud().fields([
    { name: "min_image", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  updateProduct
);
router.delete("/:id", deleteItem(Producte));
export default router;
