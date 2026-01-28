import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZjk2OTExZC03ZGFlLTQ0M2MtOWI0MS1hY2M3M2QzYmI0ODQiLCJpYXQiOjE3Njk1ODkxMjl9._Q3FiqfW-0yZG54CiE2vixRTRgyp67WOBAIkvcHqWMo`,
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
