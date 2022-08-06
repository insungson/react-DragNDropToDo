import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState, deleteState } from "@atoms/index";
import Board from "@components/board";
import DeleteBoard from "@components/deleteBoard";

const Wapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [deleteToDos, setDeleteToDos] = useRecoilState(deleteState);
  console.log("deleteToDos: ", deleteToDos);

  const onDragEnd = (info: DropResult) => {
    console.log("info: ", info);
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // same board movement
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // 삭제처리 리스트에 드롭할때 아닐때 구분처리
      if (destination.droppableId === "deleteList") {
        // deleteList recoil 에 추가처리
        const selectedObj = toDos[source.droppableId][source.index];
        //@ts-ignore
        setDeleteToDos((delBoard) => {
          const updatedList = delBoard.deleteList.concat(selectedObj);
          return {
            [destination.droppableId]: updatedList,
          };
        });
        // 기존 리스트는 삭제처리
        setToDos((allBoards) => {
          const delBoard = [...allBoards[source.droppableId]];
          console.log("delBoard: ", delBoard);
          delBoard.splice(source.index, 1);
          console.log("afterdelBoard: ", delBoard);
          return {
            ...allBoards,
            [source.droppableId]: delBoard,
          };
        });
      } else {
        // cross board movement
        setToDos((allBoards) => {
          const sourceBoard = [...allBoards[source.droppableId]];
          const taskObj = sourceBoard[source.index];
          const destinationBoard = [...allBoards[destination.droppableId]];
          sourceBoard.splice(source.index, 1);
          destinationBoard.splice(destination?.index, 0, taskObj);
          return {
            ...allBoards,
            [source.droppableId]: sourceBoard,
            [destination.droppableId]: destinationBoard,
          };
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="boardTitle">
        {(magic, info) => (
          <Wapper ref={magic.innerRef} {...magic.droppableProps}>
            <Boards>
              {Object.keys(toDos).map((boardId) => (
                <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
              ))}
            </Boards>
          </Wapper>
        )}
      </Droppable>
      <DeleteBoard
        delDropId={"deleteList"}
        delToDos={deleteToDos["deleteList"]}
      />
    </DragDropContext>
  );
}

export default App;
