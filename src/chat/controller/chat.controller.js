import { errorHandler } from "../../utils/errorHandler.js";
import Chat from "../schema/chat.schema.js";

export const getAllChats = errorHandler(async (req, res, next) => {
  const allChats = await Chat.find().populate({
    path: "userIdSend",
    select: ["name", "phone", "email", "_isAdmin"],
  });
  const newMessage = allChats.map((x) => x.sendMessage.read == false);
  res
    .status(200)
    .send({ allChats, newMessage, number_Unread: newMessage.length });
});
