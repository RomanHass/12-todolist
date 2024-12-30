import { FilterValuesType, TodolistType } from "../../../../../../app/App";
import { useAppDispatch } from "../../../../../../app/hooks";
import { Box, Button } from "@mui/material";
import { changeTodolistFilterAC } from "../../../../model/todolists-reducer";
import { filterButtonsContainerSx } from "./FilterTasksButtons.styles";

type PropsType = {
	todolist: TodolistType
}

export const FilterTasksButtons = ({todolist}: PropsType) => {
	const {filter, id} = todolist
	const dispatch = useAppDispatch()
	
	const changeFilter = (filter: FilterValuesType) => {
		dispatch(changeTodolistFilterAC(id, filter))
	}

	return (
		<Box sx={filterButtonsContainerSx}>
			<Button
				variant={filter === 'all' ? 'outlined' : 'text'}
				color={'inherit'}
				onClick={() => changeFilter('all')}>
				All
			</Button>
			<Button
				variant={filter === 'active' ? 'outlined' : 'text'}
				color={'primary'}
				onClick={() => changeFilter('active')}>
				Active
			</Button>
			<Button
				variant={filter === 'completed' ? 'outlined' : 'text'}
				color={'secondary'}
				onClick={() => changeFilter('completed')}>
				Completed
			</Button>
		</Box>
	)
}
