import {Server} from 'socket.io'
import  {server}  from '../../../index.js'

const socketIo = ()=>{
  const io = new Server(server() , {
   cors :"*"
  })
  return {io}
}
export default socketIo