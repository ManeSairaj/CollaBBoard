import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ErrorMessage from "../../Alerts/ErrorMessage";
import { useDrawingStore } from "../../../store/DrawingState";

const socket = io("http://localhost:5000");

const Login = () => {
  const [createRoom, setCreateRoom] = useState<boolean>(true);
  const [error, setError] = useState<string>(""); // State for error message
  const nameRef = useRef<HTMLInputElement>(null);
  const roomIdRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  let { setUserName, setRoomId } = useDrawingStore();

  useEffect(() => {
    const handleRoomCreated = (roomId: string) => {
      console.log(`Room ${roomId} created`);
      navigate(`/drawing/${roomId}`); // Navigate to drawing board
    };

    const handleRoomCreationFailed = (message: string) => {
      setError(message); // Set error message for room creation failure
    };

    const handleRoomJoined = (roomId: string) => {
      console.log(`Joined Room ${roomId}`);
      navigate(`/drawing/${roomId}`); // Navigate to drawing board
    };

    const handleRoomJoinFailed = (message: string) => {
      setError(message); // Set error message for room join failure
    };

    const handleConnectError = (error: any) => {
      console.error("Socket connection error:", error);
    };

    socket.on("connect", () => {
      console.log("login", socket.id);

      socket.on("roomCreated", handleRoomCreated);
      socket.on("roomCreationFailed", handleRoomCreationFailed);
      socket.on("roomJoined", handleRoomJoined);
      socket.on("roomJoinFailed", handleRoomJoinFailed);
      socket.on("connect_error", handleConnectError);

      return () => {
        // Clean up listeners
        socket.off("roomCreated", handleRoomCreated);
        socket.off("roomCreationFailed", handleRoomCreationFailed);
        socket.off("roomJoined", handleRoomJoined);
        socket.off("roomJoinFailed", handleRoomJoinFailed);
        socket.off("connect_error", handleConnectError);
        console.log(socket.id);
        socket.disconnect();
      };
    });
  }, []);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = nameRef.current?.value;
    const roomId = roomIdRef.current?.value.trim();
    const password = passwordRef.current?.value;

    if (!name) {
      setError("Please enter a username");
      return;
    }

    if (!createRoom && !roomId) {
      setError("Please enter a Room ID");
      return;
    }

    if (!password && createRoom) {
      setError("Please enter a password for the room");
      return;
    }

    const data = {
      username: name,
      roomId,
      password,
    };

    try {
      if (createRoom) {
        socket.emit("createRoom", data, (response) => {
          if (response === "Room already exists") {
            setError("Room already exists");
          } else {
            setUserName(name);
            setRoomId(roomId);
            navigate(`/drawing/${data.roomId}/${name}`);
            socket.disconnect();
          }
        });
      } else {
        socket.emit("joinRoom", data, (response) => {
          if (response === "Invalid room ID or password") {
            setError("Invalid room ID or password");
          } else {
            setUserName(name);
            setRoomId(roomId);
            navigate(`/drawing/${data.roomId}/${name}`);
            socket.disconnect();
          }
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong."); // Set a generic error message
    }
  };

  return (
    <section className="relative flex flex-wrap h-screen lg:items-center bg-white max-md:flex-col lg:p-4">
      <div className="w-full px-4 max-xl:py-12 max-md:py-0 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24 order-2 max-md:absolute max-lg:top-[30%] z-10  max-md:scale-75">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl text-slate-900">
            Get started with CollaBBoard!
          </h1>
          <p className="mt-4 text-gray-900 font-semibold tracking-wider">
            Create, Join & Collaborate!
          </p>
        </div>

        <form
          action="#"
          className="mx-auto mb-0 mt-8 max-w-md space-y-4"
          onSubmit={submitHandler}
        >
          <div>
            <label htmlFor="email" className="sr-only">
              Username
            </label>
            <div className="relative">
              <input
                ref={nameRef}
                type="text"
                className="w-full rounded-xl shadow-md border-gray-200 px-4 py-3 pe-12 -base bg-black/85 max-lg:bg-black/50 outline-none border-none max-lg:placeholder:text-white/85"
                placeholder="Enter Username"
              />
              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <img
                  src="src\assets\icons8-username-24 (1).png"
                  className="size-5 lg:opacity-70"
                  alt=""
                />
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="roomId" className="sr-only">
              Room ID
            </label>
            <div className="relative">
              <input
                ref={roomIdRef}
                type="text"
                className="w-full rounded-xl shadow-md border-gray-200 px-4 py-3 pe-12 text-base bg-black/85 max-lg:bg-black/50 outline-none border-none max-lg:placeholder:text-white/85"
                placeholder="Enter Room ID (leave blank to auto-generate)"
              />
              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <img
                  src="src\assets\icons8-meeting-room-48 (1).png"
                  className="size-5 lg:opacity-70 text-white"
                  alt=""
                />
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                ref={passwordRef}
                type="password"
                className="w-full rounded-xl shadow-md border-gray-200 px-4 py-3 pe-12 text-base bg-black/85 max-lg:bg-black/50 outline-none border-none max-lg:placeholder:text-white/85"
                placeholder="Enter password"
              />
              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <img
                  src="src\assets\icons8-password-24.png"
                  className="size-5 lg:opacity-70"
                  alt=""
                />
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <a
              className="hover:underline text-gray-500"
              href="#"
              onClick={() => setCreateRoom((prev) => !prev)}
            >
              {createRoom
                ? "want to join a room?"
                : "want to create your own room?"}
            </a>

            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-purple-600 via-purple-600 to-purple-500 px-4 py-2 shadow-inner border-purple-700 shadow-purple-500 text-sm font-medium border-b-[0.1rem] border-r-[0.1rem] text-white active:border-purple-500 duration-100 ease-in-out active:shadow-purple-600 flex tracking-wide"
            >
              {createRoom ? "Enter" : "Join"}
            </button>
          </div>
        </form>
      </div>

      <div className="lg:relative w-full h-0 lg:h-full lg:w-1/2 order-1 max-md:absolute z-0 max-md:h-full">
        <img
          alt=""
          src="https://img.freepik.com/premium-psd/join-our-team-business-office-agency-3d_66255-2049.jpg?w=740"
          className="absolute inset-0 h-full w-full object-contain"
        />

        {error && (
          <div className="absolute top-[2%] left-1/2 -translate-x-[50%] z-10 w-full">
            <ErrorMessage text={error} />{" "}
          </div>
        )}
      </div>
    </section>
  );
};

export default Login;
