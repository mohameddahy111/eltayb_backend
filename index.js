import express from 'express';
import dotenv from 'dotenv';
import { connect } from './db/connect.js';
import userRouter from './src/users/router/user.router.js';
import categoriesRouter from './src/categories/router/categories.router.js';
import productRouter from './src/product/router/product.router.js';
import couponRouter from './src/coupon/router/coupon.router.js'
import cartRouter from './src/cart/router/cart.router.js';
import orderRouter from './src/orders/router/orders.router.js';
import wishListRouter from './src/wishList/router/wishList.router.js';
import cors from 'cors';
import {Server  } from "socket.io";

dotenv.config()
const app = express();
app.use(cors())
app.use(express.json())
const port  = 3001

app.use('/users/' , userRouter)
app.use('/categories/' , categoriesRouter)
app.use('/product/' , productRouter)
app.use('/coupon/' ,couponRouter)
app.use('/cart/' ,cartRouter)
app.use('/orders/' ,orderRouter)
app.use('/wishList/' ,wishListRouter)

app.use((err , req, res ,next)=>{
  res.status(err.status || 400).send(err.message)
})
connect()
const server =  app.listen(process.env.PORT|| port , ()=>{
  console.log(`http://localhost:${port}`)
})
const io = new Server(server , {
  cors :"*"
})
io.on('connection',socket =>{
  console.log(socket.id)
})


