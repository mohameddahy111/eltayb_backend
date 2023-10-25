import express from "express";
import {
  AcceptOrders,
  addCachOrders,
  addOnLineOrders,
  getAllOrders,
  getAllUserOrders,
  getNotAcceptOrders,
  getOrdersDetils,
} from "../controller/orders.controller.js";
import { auth } from "../../middleware/auth.js";
import { getAll } from "../../utils/helper/general.js";
import Orders from "../schema/orders.schema.js";
import { rolles } from "../../middleware/rolles.js";
const router = express.Router({ mergeParams: true });

router
  .post("/cash", auth, addCachOrders)
  .post("/online", auth, addOnLineOrders);
router.get("/", auth, getAllUserOrders);
router.get("/:id", auth,  getOrdersDetils);
router.get(
  "/new_orders",
  auth,rolles(['admin']) ,getNotAcceptOrders
);
router.get('/all_orders', auth,rolles(['admin']) ,getAllOrders)
router.patch('/acceptOrders', auth, rolles(['admin']) ,AcceptOrders)

export default router;
