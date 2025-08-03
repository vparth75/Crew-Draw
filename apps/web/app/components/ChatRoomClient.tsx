"use client"

import { useEffect, useState } from "react";
import { useSocket } from "../../hook/useSocket"

export default function ChatRoomClient({
  messages,
  id
}: {
  messages: {message: string}[]
  id: string
}){
  const {socket, loading} = useSocket();
  const [currMessage, setCurrMessage] = useState('')
  const [chats, setChats] = useState<{message: string}[]>([]);

  useEffect(() => {
    setChats(messages.map(m => ({ message: m.message })))
  }, [messages])
  
  useEffect(() => {
    if (socket && !loading){
      

      socket.send(JSON.stringify({
        type: 'join_room',
        roomId: id
      }))

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data)
        
        if (parsedData.type === "chat"){
          setChats(c => [...c, {message: parsedData.message}])
        }
      }

    }
  }, [socket, loading])

  return <div>
    {chats.map((m, index) => <div key={index}>{ m.message }</div>)}
    <input type="text" value={currMessage} onChange={e => {
      setCurrMessage(e.target.value)
    }}></input>
    <button onClick={() => {
      if(socket){
        socket.send(JSON.stringify({
          type: 'chat',
          roomId: id,
          message: currMessage
        }))
        setCurrMessage("")
      } else return
    }}>Send</button>
  </div>
}