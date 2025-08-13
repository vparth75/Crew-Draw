'use client'
import { Canvas } from "@/app/components/Canvas";
import { GetRoomId } from "@/app/components/GetRoomId";
import { useEffect, useState } from "react";

export default function CanvasPage({ params }: { 
  params: Promise<{
    slug: string
}> }){
  const [slug, setSlug] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setSlug(p.slug));
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken);

  }, [params]);

  useEffect(() => {
    async function fetchRoomId() {
      if (!token || !slug) return;
      
      try {
        setLoading(true);
        const fetchedRoomId = await GetRoomId({ slug, token });
        if (fetchedRoomId) {
          setRoomId(fetchedRoomId);
        } else {
          setError('Room not found');
        }
      } catch (err) {
        setError('Failed to fetch room');
        console.error('Error fetching room:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoomId();
  }, [token, slug]);

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  if (!token) {
    return <div className="h-screen w-screen flex items-center justify-center">
      <div className="text-white text-xl">Not authenticated. Please sign in.</div>
    </div>;
  }

  if (error) {
    return <div className="h-screen w-screen flex items-center justify-center">
      <div className="text-red-500 text-xl">{error}</div>
    </div>;
  }

  if (!roomId) {
    return <div className="h-screen w-screen flex items-center justify-center">
      <div className="text-white text-xl">Room not found</div>
    </div>;
  }

  return <Canvas roomId={roomId} token={token} />;
}