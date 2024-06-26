import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Rect, Circle } from "react-konva";
import ToolBar from "./ToolkitBar/ToolBar";
import { io } from "socket.io-client";
import { KonvaEventObject } from "konva/lib/Node";
import { useParams } from "react-router-dom";
import { useDrawingStore } from "../../store/DrawingState";
import ChatBar from "../ChatSection/ChatBar";

const socket = io("http://localhost:5000");

interface LineType {
  tool?: string | null;
  points: number[];
  lineId: string;
  color?: string;
  strokeWidth?: number;
}

interface ShapeType {
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  color?: string;
  strokeWidth?: number;
  id: number;
}

export const DrawingBoard: React.FC = () => {
  const [tool, setTool] = useState<string | null>("pen");
  const [lines, setLines] = useState<LineType[]>([]);
  const [shapes, setShapes] = useState<ShapeType[]>([]);
  const [shape, setShape] = useState<string | null>(null);
  const isDrawing = useRef<boolean>(false);
  const [lineColor, setLineColor] = useState<string>("#df4b26");
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [undoStack, setUndoStack] = useState<(LineType[] | ShapeType[])[]>([]);
  const [redoStack, setRedoStack] = useState<(LineType[] | ShapeType[])[]>([]);
  const stageRef = useRef<any>(null);

  let { id } = useParams();

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("group", id);
    });

    socket.on("drawing", (data: { points: number[]; lineId: string }) => {
      setLines((prevLines) => {
        const updatedLines = prevLines.map((line: LineType) =>
          line.lineId === data.lineId
            ? {
                ...line,
                points: Array.isArray(line.points)
                  ? [...line.points, ...data.points]
                  : data.points,
              }
            : line
        );
        return updatedLines;
      });
    });

    socket.on("initDrawing", (data: LineType[]) => {
      setLines(() => data.filter((item) => "points" in item));
      setShapes(() => data.filter((item) => !("points" in item)));
    });

    socket.on("startLine", (data: LineType) => {
      setLines((prevLines) => [...prevLines, data]);
    });

    socket.on("drawingUpdate", (updatedDrawings: LineType[] | ShapeType[]) => {
      if (Array.isArray(updatedDrawings)) {
        const lines = updatedDrawings.filter(
          (item) => "points" in item
        ) as LineType[];
        const shapes = updatedDrawings.filter(
          (item) => !("points" in item)
        ) as ShapeType[];
        setLines(lines);
        setShapes(shapes);
      }
    });

    socket.on("undo", (data: (LineType[] | ShapeType[])[]) => {
      console.log("undo");

      setUndoStack(data);
    });

    socket.on("redo", (data: (LineType[] | ShapeType[])[]) => {
      setRedoStack(data);
    });

    return () => {
      socket.off("connect");
      socket.off("drawing");
      socket.off("initDrawing");
      socket.off("startLine");
      socket.off("drawingUpdate");
      socket.off("undo");
      socket.off("redo");
    };
  }, [id]);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;

    console.log(shape);
    console.log(shapes);

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    if (shape) {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      const newShape: ShapeType = {
        type: shape,
        x: pos.x,
        y: pos.y,
        color: lineColor,
        strokeWidth: lineWidth,
        id: Date.now(), // Use a unique ID
      };

      setShapes([...shapes, newShape]);
      socket.emit("drawing", {
        points: [], // Shapes do not use points array
        roomId: id,
        lineId: newShape.id.toString(), // Send shape ID as lineId
      });
      return;
    } else {
      // Start a new line only if not continuing from last drawn line
      const newLine: LineType = {
        tool,
        points: [], // Initialize points array
        lineId: `${id}-${Date.now()}`, // Unique line ID
        color: lineColor,
        strokeWidth: lineWidth,
      };

      setLines([...lines, newLine]);
      socket.emit("startLine", {
        roomId: id,
        lineId: newLine.lineId,
        color: newLine.color,
        strokeWidth: newLine.strokeWidth,
      });
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current || shape) return;

    console.log(shape);
    console.log(shapes);

    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;

    // Ensure there is at least one line in the array
    if (lines.length === 0) return;

    const updatedLines = lines.map((line, index) => {
      // Only update the last line being drawn
      if (index === lines.length - 1) {
        // Ensure line.points is initialized as an array
        const newPoints = [...line.points, point.x, point.y];
        return {
          ...line,
          points: newPoints,
        };
      }
      return line;
    });

    setLines(updatedLines);

    const lastLine = updatedLines[updatedLines.length - 1];
    socket.emit("drawing", {
      points: [point.x, point.y],
      roomId: id,
      lineId: lastLine.lineId,
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    if (shape) {
      setUndoStack([...undoStack, shapes]);
      setRedoStack([]);
      return;
    }

    // Finalize the last line drawn (if any)
    if (isDrawing.current && lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      if (lastLine.points.length === 0) {
        // Remove the last line if it has no points
        setLines(lines.slice(0, -1));
      }
    }

    // Add the current state to the undo stack
    setUndoStack([...undoStack, lines]);
    setRedoStack([]);
    socket.emit("drawing", {
      points: [],
      roomId: id,
      lineId: lines[lines.length - 1].lineId,
    });
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const lastState = undoStack.pop();
    setUndoStack([...undoStack]); // Update local stack
    setRedoStack([...redoStack, lines]); // Push current state to redo stack
    setLines(lastState as LineType[]); // Update lines state
    socket.emit("undo", id, undoStack); // Emit undo event with roomId and undoStack
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const lastState = redoStack.pop();
    setRedoStack([...redoStack]); // Update local stack
    setUndoStack([...undoStack, lines]); // Push current state to undo stack
    setLines(lastState as LineType[]); // Update lines state
    socket.emit("redo", id, redoStack); // Emit redo event with roomId and redoStack
  };

  return (
    <>
      <div className="absolute bottom-[2%] right-1 z-10">
        <ChatBar />
      </div>
      <div className="absolute bottom-[2%] left-1/2 -translate-x-[50%] z-10">
        <ToolBar
          setTool={setTool}
          setColor={setLineColor}
          setStrokeWidth={setLineWidth}
          setShape={setShape}
          undo={undo}
          redo={redo}
        />
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              tension={0.3}
              lineCap="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
          {shapes.map((shape, i) => {
            if (shape.type === "rect") {
              return (
                <Rect
                  key={i}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill={shape.color}
                  strokeWidth={shape.strokeWidth}
                />
              );
            } else if (shape.type === "circle") {
              return (
                <Circle
                  key={i}
                  x={shape.x}
                  y={shape.y}
                  radius={shape.radius}
                  fill={shape.color}
                  strokeWidth={shape.strokeWidth}
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
    </>
  );
};

export default DrawingBoard;
