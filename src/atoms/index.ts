import { atom } from "recoil";
import { IToDoState, IDeleteState } from "@models/index";

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "To Do": {
      index: 0,
      list: [],
    },
    Doing: {
      index: 1,
      list: [],
    },
    Done: {
      index: 2,
      list: [],
    },
  },
});

// 삭제 필드..
export const deleteState = atom<IDeleteState>({
  key: "toDelete",
  default: {
    deleteList: [],
  },
});
