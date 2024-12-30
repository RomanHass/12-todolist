import IconButton from "@mui/material/IconButton";
import { TodolistType } from "../../../../../../app/App";
import DeleteIcon from '@mui/icons-material/Delete';
import { EditableSpan } from "../../../../../../common/components/EditableSpan/EditableSpan";
import { useAppDispatch } from "../../../../../../app/hooks";
import { changeTodolistTitleAC, removeTodolistAC } from "../../../../model/todolists-reducer";
import styles from './TodolistTitle.module.css'

type PropsType = {
	todolist: TodolistType
}

export const TodolistTitle = ({todolist}: PropsType) => {
	const {title, id} = todolist

	const dispatch = useAppDispatch()
	
	const updateTodolist = (title: string) => {
		dispatch(changeTodolistTitleAC(id, title))
	}

	const removeTodolist = () => {
		dispatch(removeTodolistAC(id))
	}

	return (
			<div className={styles.container}>
				<h3><EditableSpan value={title} onChange={updateTodolist}/></h3>
				<IconButton onClick={removeTodolist}>
					<DeleteIcon/>
				</IconButton>
			</div>
	)
}
