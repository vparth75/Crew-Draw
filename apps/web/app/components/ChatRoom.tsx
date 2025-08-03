import axios from "axios";
import { BACKEND_URL } from "../config";
import ChatRoomClient from "./ChatRoomClient";

async function getChats(roomId: string){
  const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`, { headers: { 'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiNjgyNmNjOC0yYzkwLTQwMGUtYjY3OC03M2FlNGRmOTg2N2MiLCJpYXQiOjE3NTM4MTEyMDJ9.7NqFWf4K1Yqb0IjE1faqWUT55fLKmwqKOtqCo2Wd8sk' }}) 

  return response.data.messages
}

export default async function ChatRoom({id}: {
  id: string
}) {
  const messages = await getChats(id)
  
  return <ChatRoomClient id={id} messages={messages}></ChatRoomClient>
}