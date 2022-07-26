import { atom } from "recoil";
import { IToDoState, IDeleteState } from "@models/index";

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "To Do": [],
    Doing: [],
    Done: [],
  },
});

// 삭제 필드..
export const deleteState = atom<IDeleteState>({
  key: "toDelete",
  default: {
    deleteList: [],
  },
});
