"use client"

import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

const WS_URL = "ws://localhost:8080"

export function RoomCanvas({roomId}: {roomId:string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3ZmJjYjg2Ny00ZWIzLTQxYmQtYWExNC0zMTQwYzdhNWYwMGUiLCJpYXQiOjE3NzAwODY4MDl9.gcUk7KJ1QHvPj2-7I_Ltas_fBRVEhC9rm-2dwD9qqpk`)

        ws.onopen = () => {
            setSocket(ws)
            ws.send(JSON.stringify({
              type: "join_room",
              roomId
            }))
        }

    }, [])

  if (!socket) {
    return <div>
        Connecting to server....
    </div>
  }

  return (
    <div>
      <Canvas roomId={roomId} socket={socket}/>
    </div>
  );
}