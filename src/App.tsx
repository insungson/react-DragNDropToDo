import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
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
    // 큰 리스트 드레그 할때 처리
    if (info.type === "List") {
      setToDos((allBoards) => {
        // 기존 객체이름을 리스트로 뽑기
        const nameList = [
          ...Object.keys(allBoards).sort(
            (a, b) => allBoards[a].index - allBoards[b].index
          ),
        ];
        const selectedName = nameList[source?.index];
        nameList.splice(source?.index, 1);
        nameList.splice(destination?.index, 0, selectedName);
        let updatedAllBoards = JSON.parse(JSON.stringify(allBoards));
        nameList.forEach((item, index) => {
          updatedAllBoards[item].index = index;
          // updatedAllBoards[item].list = allBoards[item].list;
        });
        return updatedAllBoards;
      });
    }
    // 카드 드레그 할떄 처리
    if (info.type === "word") {
      if (destination?.droppableId === source.droppableId) {
        // same board movement
        setToDos((allBoards) => {
          const boardCopy = [...allBoards[source.droppableId].list];
          const taskObj = boardCopy[source.index];
          boardCopy.splice(source.index, 1);
          boardCopy.splice(destination?.index, 0, taskObj);
          return {
            ...allBoards,
            [source.droppableId]: {
              ...allBoards[source.droppableId],
              list: boardCopy,
            },
          };
        });
      }
      if (destination.droppableId !== source.droppableId) {
        // 삭제처리 리스트에 드롭할때 아닐때 구분처리
        if (destination.droppableId === "deleteList") {
          // deleteList recoil 에 추가처리
          const selectedObj = toDos[source.droppableId].list[source.index];
          //@ts-ignore
          setDeleteToDos((delBoard) => {
            const updatedList = delBoard.deleteList.concat(selectedObj);
            return {
              [destination.droppableId]: updatedList,
            };
          });
          // 기존 리스트는 삭제처리
          setToDos((allBoards) => {
            const delBoard = [...allBoards[source.droppableId].list];
            console.log("delBoard: ", delBoard);
            delBoard.splice(source.index, 1);
            console.log("afterdelBoard: ", delBoard);
            return {
              ...allBoards,
              [source.droppableId]: {
                ...allBoards[source.droppableId],
                list: delBoard,
              },
            };
          });
        } else {
          // cross board movement
          setToDos((allBoards) => {
            const sourceBoard = [...allBoards[source.droppableId].list];
            const taskObj = sourceBoard[source.index];
            const destinationBoard = [
              ...allBoards[destination.droppableId].list,
            ];
            sourceBoard.splice(source.index, 1);
            destinationBoard.splice(destination?.index, 0, taskObj);
            return {
              ...allBoards,
              [source.droppableId]: {
                ...allBoards[source.droppableId],
                list: sourceBoard,
              },
              [destination.droppableId]: {
                ...allBoards[destination.droppableId],
                list: destinationBoard,
              },
            };
          });
        }
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wapper>
        <Droppable droppableId="TitleDropArea" type="List">
          {(magic, info) => (
            <Boards ref={magic.innerRef} {...magic.droppableProps}>
              {Object.keys(toDos)
                .sort((a, b) => toDos[a].index - toDos[b].index)
                .map((boardId) => (
                  <Draggable draggableId={boardId} index={toDos[boardId].index}>
                    {(magic, snapshot) => (
                      <div
                        style={{
                          borderRadius: "5px",
                          marginBottom: "5px",
                          padding: "10px",
                          backgroundColor: `${
                            snapshot.isDragging ? "red" : "none"
                          }`,
                        }}
                        ref={magic.innerRef}
                        {...magic.dragHandleProps}
                        {...magic.draggableProps}
                      >
                        <Board
                          boardId={boardId}
                          key={boardId}
                          toDos={toDos[boardId].list}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
            </Boards>
          )}
        </Droppable>
      </Wapper>
      <DeleteBoard
        delDropId={"deleteList"}
        delToDos={deleteToDos["deleteList"]}
      />
    </DragDropContext>
  );
}

export default App;
