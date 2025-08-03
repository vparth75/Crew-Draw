import axios from "axios";
import { BACKEND_URL } from "../../config";
import ChatRoom from "../../components/ChatRoom";

async function getRoomId(slug: string){
  const response = await axios.get(`${BACKEND_URL}/rooms/${slug}`, { headers: { 'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiNjgyNmNjOC0yYzkwLTQwMGUtYjY3OC03M2FlNGRmOTg2N2MiLCJpYXQiOjE3NTM4MTEyMDJ9.7NqFWf4K1Yqb0IjE1faqWUT55fLKmwqKOtqCo2Wd8sk' }})

  return response.data.room.id;
}

export default async function joinRoom({
  params
}: {
  params: {
    slug: string
  }
}){
  const roomId = await getRoomId((await params).slug)
  
  return <ChatRoom id={roomId}></ChatRoom>
}