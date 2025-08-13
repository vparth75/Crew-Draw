import axios from "axios";
import { HTTP_BACKEND } from "../config";

export const getExistingShapes = async (roomId: string, token: string) => {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`, {
    headers: {
      "Authorization": token
    }
  });
  const messages = res.data.messages;

  const shapes = messages.map((x: {message: string}) => {
    const messageData = JSON.parse(x.message)
    return messageData;
  })

  return shapes;
}