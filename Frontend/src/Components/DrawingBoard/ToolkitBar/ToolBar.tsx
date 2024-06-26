import React from "react";

const ToolBar = ({
  setTool,
  setColor,
  setStrokeWidth,
  setShape,
  undo,
  redo,
}) => {
  return (
    <span className="absolute bottom-[2rem] left-1/2 -translate-x-1/2 inline-flex overflow-hidden rounded-md border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 hover:space-x-1">
      <button
        className="inline-block border-e p-3 text-gray-700 hover:bg-gray-50 focus:relative dark:border-e-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 hover:border-b-4 hover:border-b-blue-500 transform duration-200 ease-in-out"
        title="Pen"
        onClick={() => {
          setTool("pen"); 
          setColor("#df4b26");
          setShape(null);
        }}
      >
        <img
          width="24"
          height="24"
          src="https://img.icons8.com/forma-bold-filled/24/FFFFFF/pencil.png"
          alt="pencil"
          className="size-5"
        />
      </button>
      <button
        className="inline-block border-e p-3 text-gray-700 hover:bg-gray-50 focus:relative dark:border-e-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 hover:border-b-4 hover:border-b-blue-500 transform duration-200 ease-in-out"
        title="Eraser"
        onClick={() => {
          setColor("#242424");
          setTool("eraser");
          setShape(null);
        }}
      >
        <img
          width="64"
          height="64"
          src="https://img.icons8.com/sf-black-filled/64/FFFFFF/eraser.png"
          alt="eraser"
          className="size-5"
        />
      </button>
      <button
        className="inline-block border-e p-3 text-gray-700 hover:bg-gray-50 focus:relative dark:border-e-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 hover:border-b-4 hover:border-b-blue-500 transform duration-200 ease-in-out"
        title="Undo"
        onClick={() => undo()}
      >
        <img
          width="30"
          height="30"
          src="https://img.icons8.com/ios-glyphs/30/FFFFFF/undo.png"
          alt="undo"
        />
      </button>
      <button
        className="inline-block border-e p-3 text-gray-700 hover:bg-gray-50 focus:relative dark:border-e-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 hover:border-b-4 hover:border-b-blue-500 transform duration-200 ease-in-out"
        title="Redo"
        onClick={() => redo()}
      >
        <img
          width="30"
          height="30"
          src="https://img.icons8.com/ios-glyphs/30/FFFFFF/redo.png"
          alt="redo"
        />
      </button>
      <button
        className="inline-block border-e p-3 text-gray-700 hover:bg-gray-50 focus:relative dark:border-e-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 hover:border-b-4 hover:border-b-blue-500 transform duration-200 ease-in-out"
        title="color palette"
      >
        <img
          width="50"
          height="50"
          src="https://img.icons8.com/ios-filled/50/FFFFFF/paint-palette.png"
          alt="paint-palette"
          className="size-6"
        />
        <input
          type="color"
          onChange={(e) => setColor(e.target.value)}
          className="inline-block p-3 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800 transform duration-200 ease-in-out absolute top-0 left-0 z-10 opacity-0"
          title="Color Picker"
        />
      </button>
      <input
        type="range"
        min="1"
        max="20"
        onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
        className="inline-block mx-4 p-3 text-gray-700 hover:bg-gray-50 focus:relative dark:text-gray-200 dark:hover:bg-gray-800 transform duration-200 ease-in-out"
        title="Line Width"
      />
      <button
        className="inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative dark:text-gray-200 dark:hover:bg-gray-800 hover:border-b-4 hover:border-b-blue-500 transform duration-200 ease-in-out"
        title="Draw Rect"
        onClick={() => setShape("rect")}
      >
        <img
          width="50"
          height="50"
          src="https://img.icons8.com/ios/50/FFFFFF/stop.png"
          alt="stop"
          className="size-6"
        />
      </button>
      <button
        className="inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative dark:text-gray-200 dark:hover:bg-gray-800 hover:border-b-4 hover:border-b-blue-500 transform duration-200 ease-in-out"
        title="Draw Circle"
        onClick={() => setShape("circle")}
      >
        <img
          width="50"
          height="50"
          src="https://img.icons8.com/ios/50/FFFFFF/circled.png"
          alt="circled"
          className="size-6"
        />
      </button>
    </span>
  );
};

export default ToolBar;
