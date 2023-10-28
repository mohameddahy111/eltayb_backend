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
router.get(
  "/allOrders/",
  auth,
  rolles(['admin']),
  getAllOrders
  
);
router.get("/", auth, getAllUserOrders);
router.get("/:id", auth, getOrdersDetils).put("/accept/:id",auth, rolles(["admin"]), AcceptOrders);;
router.get("/new_orders", auth, rolles(["admin"]), getNotAcceptOrders);

export default router;
