export interface ITodo {
  id: number;
  text: string;
}

export interface IToDoState {
  [key: string]: {
    index: number;
    list: ITodo[];
  };
}

export interface IDeleteObj {
  boardId: string;
  toDoId: number;
}

export interface IDeleteState {
  deleteList: ITodo[];
}
