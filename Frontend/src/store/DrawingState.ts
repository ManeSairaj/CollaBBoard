import { create } from "zustand";

interface Drawing {
  roomId: string;
  img: string;
}

interface DrawingState {
  drawings: Drawing[];
  username: string | undefined;
  roomId: string | number | undefined;
  addDrawing: (drawing: Drawing) => void;
  updateDrawing: (roomId: string, img: string) => void;
  setUserName: (username: string | undefined) => void;
  setRoomId: (roomId: string | number | undefined) => void;
}

export const useDrawingStore = create<DrawingState>((set) => ({
  drawings: [],
  username: "",
  roomId: "",
  addDrawing: (drawing) => set((state) => ({ drawings: [...state.drawings, drawing] })),
  updateDrawing: (roomId, img) =>
    set((state) => ({
      drawings: state.drawings.map((drawing) =>
        drawing.roomId === roomId ? { ...drawing, img } : drawing
      ),
    })),
  setUserName: (username) => set(() => ({ username })),
  setRoomId: (roomId) => set(() => ({ roomId }))
}));
