'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import { HTTP_BACKEND } from "../config";

export default function CreateRoom() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken);
    const storedUserId = sessionStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);
  
  if(!token && !userId){
    return <div>
      <div className="flex justify-center h-screen items-center text-4xl">Not Authenticated</div>
    </div>
  }

  return <div className="flex justify-center h-screen items-center flex-col">
    <input placeholder="create room..." className="p-2.5 font-extrabold m-2.5 border rounded" onChange={e => setName(e.target.value)}></input>
    <button className="p-2.5 bg-neutral-700 text-white rounded cursor-pointer" onClick={async (e) => {
      try{
        const response = await axios.post(`${HTTP_BACKEND}/create-room`, {
          name,
          userId
        }, { headers: {'Authorization': token}})
        console.log(response.data);
      } catch (err) {
        console.error('Failed to create room: ', err)
      }
    }}>Create</button>
  </div>
}