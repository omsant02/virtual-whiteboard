import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3ZmJjYjg2Ny00ZWIzLTQxYmQtYWExNC0zMTQwYzdhNWYwMGUiLCJpYXQiOjE3NzAwODY4MDl9.gcUk7KJ1QHvPj2-7I_Ltas_fBRVEhC9rm-2dwD9qqpk`,
    );
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return {
    socket,
    loading,
  };
}
