import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IDeleteObj } from "@models/index";

const Card = styled.div<{ isDragging: boolean }>`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px;
  background-color: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.05)" : "none"};
`;

const Text = styled.span`
  color: black;
  background-color: white;
  border-radius: 5px;
  text-align: center;
`;

const Button = styled.button`
  background-color: #dc3545;
  border-radius: 5px;
  color: white;
  border-color: #dc3545;
  margin-left: 10px;
`;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
  deleteFN: ({ boardId, toDoId }: IDeleteObj) => void;
}

const DraggableCard = ({
  toDoId,
  toDoText,
  index,
  boardId,
  deleteFN,
}: IDraggableCardProps) => {
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          <Text>{toDoText}</Text>
          <Button onClick={() => deleteFN({ boardId, toDoId })}>Del</Button>
        </Card>
      )}
    </Draggable>
  );
};

export default DraggableCard;
