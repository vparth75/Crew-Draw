
import { Canvas } from "@/app/components/Canvas";
import { HTTP_BACKEND } from "@/app/config";
import axios from "axios";

export default async function CanvasPage({ params }: { 
  params: {
    slug: string
} }){
  const slug = (await params).slug
  
  const res = await axios.get(`${HTTP_BACKEND}/rooms/${slug}`, {
    headers: {
      "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OWM3ZTIxYS1lZDBmLTQ2MzYtYWQ1MS1mNWExMjAxYTNlNTkiLCJpYXQiOjE3NTM4MDkwMDl9.r5vbBYzOhqCfBOK43bezVRUPo9N_FdnXxgsGDTZmPWg"
    }
  })
  
  const roomId = res.data.room.id
  
  return <Canvas roomId={roomId}></Canvas>
}