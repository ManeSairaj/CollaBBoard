import React from "react";
import { Link } from "react-router-dom";

const ProjectSearchBar = () => {
  return (
    <header className="bg-white space-y-4 p-4 sm:px-8 sm:py-6 lg:px-12 lg:py-6 xl:px-16 xl:py-6 lg:rounded-2xl lg:mt-1 shadow-md shadow-[rgba(59,130,246,0.2)]">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900/5 text-2xl lg:text-5xl tracking-wider" style={{WebkitTextStroke: "0.09rem skyblue"}}>
          Boards
        </h2>
        <Link
          to="/room"
          className="hover:bg-blue-400 group flex items-center rounded-md bg-blue-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
        >
          <svg
            width="20"
            height="20"
            fill="currentColor"
            className="mr-2"
            aria-hidden="true"
          >
            <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
          </svg>
          New Room
        </Link>
      </div>
      <form className="group relative">
        <svg
          width="20"
          height="20"
          fill="currentColor"
          className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          />
        </svg>
        <input
          className="focus:ring-[0.09rem] focus:ring-blue-500 focus:outline-none appearance-none bg-slate-100/100 w-full text-sm leading-6 max-lg:leading-4 max-sm:leading-3 text-slate-50 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-blue-300 shadow-sm"
          type="text"
          aria-label="Filter boards"
          placeholder="Filter boards..."
        />
      </form>
    </header>
  );
};

export default ProjectSearchBar;
