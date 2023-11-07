import express from "express";
import dotenv from "dotenv";
import { connect } from "./db/connect.js";
import userRouter from "./src/users/router/user.router.js";
import categoriesRouter from "./src/categories/router/categories.router.js";
import productRouter from "./src/product/router/product.router.js";
import couponRouter from "./src/coupon/router/coupon.router.js";
import cartRouter from "./src/cart/router/cart.router.js";
import orderRouter from "./src/orders/router/orders.router.js";
import wishListRouter from "./src/wishList/router/wishList.router.js";
import chatRouter from "./src/chat/router/chat.router.js";
import cors from "cors";
import socketIo from "./src/utils/helper/socket.js";
import Chat from "./src/chat/schema/chat.schema.js";
// import {Server  } from "socket.io";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const port = 3001;

app.use("/users/", userRouter);
app.use("/categories/", categoriesRouter);
app.use("/product/", productRouter);
app.use("/coupon/", couponRouter);
app.use("/cart/", cartRouter);
app.use("/orders/", orderRouter);
app.use("/wishList/", wishListRouter);
app.use("/chat/", chatRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 400).send(err.message);
});
connect();
export const server = () => {
  const se = app.listen(process.env.PORT || port, () => {
    console.log(`http://localhost:${port}`);
  });
  return se;
};

socketIo().io.on("connection", (socket) => {
  socket.on("openChat", async (data) => {
    const getChat = await Chat.findOne({ userIdSend: data.id }).populate({
      path: "userIdSend",
      select: ["name", "phone", "email", "_isAdmin"],
    });
    if (getChat) {
      socket.emit("getChat", getChat);
      
    } else {
      socket.emit("getChat", null)
    }
  });
  socket.on("sendMessage", async (data) => {
    const findUser = await Chat.findOne({ userIdSend: data.id }).populate({
      path: "userIdSend",
      select: ["name", "phone", "email", "_isAdmin"],
    });
    if (findUser) {
      findUser.sendMessage.push({ send: data.send });
      findUser?.save();
      socket.emit("addMessage", findUser);
    } else {
      const newUser = await Chat.insertMany({
        userIdSend: data.id,
        sendMessage: { send: data.send },
      });
      socket.emit("addMessage", newUser);
    }
  });
});
