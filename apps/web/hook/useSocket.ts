import { useEffect, useState } from "react"
import { WS_URL } from "../app/config";

export function useSocket(){
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    console.log(WS_URL)
    const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiNjgyNmNjOC0yYzkwLTQwMGUtYjY3OC03M2FlNGRmOTg2N2MiLCJpYXQiOjE3NTM4MTEyMDJ9.7NqFWf4K1Yqb0IjE1faqWUT55fLKmwqKOtqCo2Wd8sk`)

    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    }
  }, []);

  return {
    socket,
    loading
  }
}