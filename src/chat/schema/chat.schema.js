import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userIdSend: { type: mongoose.Types.ObjectId, ref: "User" },
    sendMessage: [{
      send: { type: String },
      resIdSend: { type: mongoose.Types.ObjectId, ref: "User" },
      read : {type :Boolean , default: false}
    }],
    // resiveMessage: {
    //   resive: { type: String },
    // },
  },
  { timestamps: true }
);
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
