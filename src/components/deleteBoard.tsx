import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { ITodo } from "@models/index";
import { useSetRecoilState } from "recoil";
import { deleteState } from "@atoms/index";
import { IDeleteObj } from "@models/index";

const Wrapper = styled.div`
  width: 100%;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Button = styled.button`
  background-color: #dc3545;
  border-radius: 5px;
  color: white;
  border-color: #dc3545;
  margin-left: 10px;
`;

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "b2bec3"
      : "transparent"};
  flex-flow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

interface IDeletePorps {
  delToDos: ITodo[];
  delDropId: string;
}

const DeleteBoard = ({ delDropId, delToDos }: IDeletePorps) => {
  console.log("delToDos: ", delToDos);
  const setDelToDos = useSetRecoilState(deleteState);

  const onClickDelete = (delObj: ITodo) => {
    const { id, text } = delObj;
    //@ts-ignore
    setDelToDos((delState) => {
      const updatedList = [...delState.deleteList];
      console.log("updatedList: ", updatedList);
      const delIndex = delState.deleteList.findIndex((item) => item.id === id);
      updatedList.splice(delIndex, 1);
      console.log("afterupdatedList: ", updatedList);

      return {
        //@ts-ignore
        deleteList: updatedList,
      };
    });
  };

  return (
    <Wrapper>
      <Title>{delDropId}</Title>
      {/* 아래에서 드롭할 아이디를 지정해준다 */}
      <Droppable droppableId="deleteList">
        {(provided, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {delToDos.map((delTodo, index) => (
              <div key={delTodo.id}>
                <Button onClick={() => onClickDelete(delTodo)}>
                  DEL {delTodo.text}
                </Button>
              </div>
            ))}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
};

export default DeleteBoard;
