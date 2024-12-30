import {AddItemForm} from "../../../../../common/components/AddItemForm/AddItemForm";
import { TodolistType } from "../../../../../app/App";
import { useAppDispatch } from "../../../../../app/hooks";
import { TodolistTitle } from "./TodolistTitle/TodolistTitle";
import { Tasks } from "./Tasks/Tasks";
import { FilterTasksButtons } from "./FilterTasksButtons/FilterTasksButtons";
import { addTaskAC } from "../../../model/tasks-reducer";

type PropsType = {
	todolist: TodolistType
}

export const Todolist = ({todolist}: PropsType) => {
	const dispatch = useAppDispatch()

	const addTask = (title: string) => {
		dispatch(addTaskAC({todolistId: todolist.id, title}))
	}

	return (
		<div>
			<TodolistTitle todolist={todolist} />
			<AddItemForm addItem={addTask}/>
			<Tasks todolist={todolist} />
			<FilterTasksButtons todolist={todolist} />
		</div>
	)
}
