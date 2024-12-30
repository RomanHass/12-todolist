import IconButton from "@mui/material/IconButton";
import { TaskType, TodolistType } from "../../../../../../../app/App";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";
import ListItem from "@mui/material/ListItem";
import { EditableSpan } from "../../../../../../../common/components/EditableSpan/EditableSpan";
import { useAppDispatch } from "../../../../../../../app/hooks";
import { ChangeEvent } from "react";
import { removeTaskAC, changeTaskStatusAC, changeTaskTitleAC } from "../../../../../model/tasks-reducer";
import { getListItemSx } from "./Task.styles";

type PropsType = {
  todolist: TodolistType
  task: TaskType
};

export const Task = ({ task, todolist }: PropsType) => {

  const dispatch = useAppDispatch()

	const removeTask = () => {
		dispatch(removeTaskAC({todolistId: todolist.id, taskId: task.id}))
	}

	const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
		const isDone = e.currentTarget.checked
		dispatch(changeTaskStatusAC({todolistId: todolist.id, taskId: task.id, isDone}))
	}

	const updateTask = (title: string) => {
		dispatch(changeTaskTitleAC({todolistId: todolist.id, taskId: task.id, title}))
	}

  return (
    <>
      <ListItem key={task.id} sx={getListItemSx(task.isDone)}>
        <div>
          <Checkbox checked={task.isDone}
            onChange={changeTaskStatus}
          />
          <EditableSpan
            value={task.title}
            onChange={updateTask}
          />
        </div>
        <IconButton onClick={removeTask}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
    </>
  );
};
