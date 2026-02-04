import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";

type Shape = "circle" | "rect" | "pencil";

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Shape>("circle");

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket);
    }
  }, [canvasRef]);
  return (
    <div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
      <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}

function Topbar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Shape;
  setSelectedTool: (s: Shape) => void;
}) {
  return (
    <div className="flex gap-0.5 fixed top-[10px] left-[10px] text-white">
      <IconButton
        icon={<Pencil />}
        onClick={() => {
          setSelectedTool("pencil");
        }}
        activated={selectedTool === "pencil"}
      />
      <IconButton
        icon={<RectangleHorizontalIcon />}
        onClick={() => {
          setSelectedTool("rect");
        }}
        activated={selectedTool === "rect"}
      />
      <IconButton
        icon={<Circle />}
        onClick={() => {
          setSelectedTool("circle");
        }}
        activated={selectedTool === "circle"}
      />
    </div>
  );
}
