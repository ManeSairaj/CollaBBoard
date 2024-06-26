import "./App.css";
import RoomDoor from "./Components/RoomDoor/RoomDoor";
import ToolBar from "./Components/DrawingBoard/ToolkitBar/ToolBar";
import WhiteBoard from "./Components/WhiteBoard";
import Whiteboard_v2 from "./Components/WhiteBoard_v2";
import Whiteboard_v3 from "./Components/WhiteBoard_v3";
import Login from "./Components/RoomDoor/JoinRoom/Login";
import JoinRoom from "./Components/RoomDoor/JoinRoom/JoinRoom";
import LoginBg from "./Components/Login/LoginBg";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DrawingBoard from "./Components/DrawingBoard/DrawingBoard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/", 
      element: <RoomDoor />,
    },
    {
      path: "/room",
      element: <JoinRoom />,
    },
    {
      path: "/drawing/:id/:name",
      element: <DrawingBoard />,
    },
    {
      path: "/board",
      element: <DrawingBoard />,
    },
    {
      path: "/register",
      element: <LoginBg />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
