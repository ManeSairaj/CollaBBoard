import { Link } from "react-router-dom";
import ProjectSearchBar from "./ProjectSearchBar/ProjectSearchBar";
import { useDrawingStore } from "../../store/DrawingState";
import { useEffect } from "react";

const RoomDoor = () => {
  let rooms = [
    {
      img: "https://cdn.dribbble.com/users/34991/screenshots/11186896/media/ba478cb538e8e48feeb0b3b1e5556f3e.jpg?resize=320x240&vertical=center",
      roomId: "1",
    },
  ];

  const { drawings } = useDrawingStore();

  useEffect(() => {
    console.log(drawings);
  }, []);

  return (
    <section className="h-full w-[100vw]">
      <div className="lg:px-20 lg:py-4">
        <ProjectSearchBar />
      </div>

      <ul className="bg-[#242424] px-9 sm:px-26 sm:pt-6 sm:pb-8 lg:px-24 xl:px-28 xl:pt-6 xl:pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-sm leading-6 min-h-[78vh] w-full mt-4 ">
        {drawings.map((drawing, index) => (
          <li className="flex" key={index}>
            <Link
              to={`/room/${drawing.roomId}`}
              className="hover:border-blue-500 hover:border-opacity-50 hover:bg-[#2b2b2b] hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-white text-sm leading-6 text-slate-50 font-medium max-h-[240px] transform duration-500 ease-in-out hover:shadow-blue-900/90 shadow-lg hover:scale-105"
            >
              <img
                src={drawing.img}
                className="w-full h-full"
                alt={`Room ${drawing.roomId}`}
              />
            </Link>
          </li>
        ))}
        <li className="flex">
          <Link
            to="/board"
            className="hover:border-blue-500 hover:border-opacity-50 hover:bg-[#2b2b2b] hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-50 font-medium py-3 max-h-[240px] transform duration-300 ease-in-out"
          >
            <svg
              className="group-hover:text-blue-500 mb-1 text-white transform duration-300 ease-in-out"
              width="20"
              height="20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
            </svg>
            New project
          </Link>
        </li>
      </ul>
    </section>
  );
};

export default RoomDoor;

// new project UI model v2

{
  /* <li className="flex">
          <a
            href="/new"
            className="hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-50 font-medium py-3 max-h-[240px]"
          >
            <svg
              className="group-hover:text-blue-500 mb-1 text-slate-50"
              width="20"
              height="20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
            </svg>
            New project
          </a>
        </li> */
}
