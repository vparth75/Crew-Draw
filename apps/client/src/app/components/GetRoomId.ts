import axios from "axios";
import { HTTP_BACKEND } from "../config";

export async function GetRoomId({ slug, token }: {
  slug: string,
  token: string
}) {
  
  try{
    const res = await axios.get(`${HTTP_BACKEND}/rooms/${slug}`, {
      headers: {
        "Authorization": token
      }
    })
    const roomId = res.data.room.id;

    return roomId;

  } catch(e){
    console.error('error getting room id', e);
    return null;
  }

}