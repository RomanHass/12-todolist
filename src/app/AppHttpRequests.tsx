import Checkbox from '@mui/material/Checkbox'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { AddItemForm } from '../common/components/AddItemForm/AddItemForm'
import { EditableSpan } from '../common/components/EditableSpan/EditableSpan'
import axios from 'axios'

type Task = {
  description: string | null
  title: string
  status: TaskStatus
  priority: number
  startDate: string | null
  deadline: string | null
  id: string
  todoListId: string
  order: number
  addedDate: string
}

type GetTaskResponse = {
  totalCount: number
  error: string | null
  items: Task[]
}

type Todolist = {
  id: string
  addedDate: string 
  order: number
  title: string
}

type FieldError = {
  error: string
  field: string
}

type Response<T = {}> = {
  data: T
  resultCode: number
  fieldsErrors: FieldError[]
  messages: string[]
}

enum TaskStatus {
  New,
  InProgress,
  Completed
}
 
const token = 'b3a0903b-92af-4be8-af69-b509e5efc468'
const apiKey = '60e9df17-577a-4425-a132-c0468cd849f4'
const configs = {
  headers: {
    Authorization: `Bearer ${token}`,
    'API-KEY': apiKey,
  }
}

export const AppHttpRequests = () => {
  const [todolists, setTodolists] = useState<Todolist[]>([])
  const [tasks, setTasks] = useState<{[key: string]: Task[]}>({})
 
  useEffect(() => {
    axios.get<Todolist[]>('https://social-network.samuraijs.com/api/1.1/todo-lists', configs)
      .then((res) => {
        const todolists = res.data
        setTodolists(todolists)
        todolists.forEach(({id}) => {
          axios.get<GetTaskResponse>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${id}/tasks`, configs)
            .then((res) => {
              setTasks({...tasks, [id]: res.data.items})
             })
        })
      })
  }, [])
 
  const createTodolistHandler = (title: string) => {
    axios.post<Response<{item: Todolist}>>('https://social-network.samuraijs.com/api/1.1/todo-lists', {title}, configs)
      .then((res) => {
        const newTodo = res.data.data.item
        setTodolists([newTodo, ...todolists])
      })
  }
 
  const removeTodolistHandler = (id: string) => {
    axios.delete<Response>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${id}`, configs)
    .then(() => {
      setTodolists(todolists.filter(tl => tl.id !== id))
    })
  }
 
  const updateTodolistHandler = (id: string, title: string) => {
    axios.put<Response>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${id}`, {title}, configs)
      .then(() => {
        setTodolists(todolists.map(tl => tl.id === id ? {...tl, title} : tl))
      })
  }
 
  const createTaskHandler = (title: string, todolistId: string) => {
    axios.post<Response<{item: Task}>>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}/tasks`, {title}, configs)
      .then((res) => {
        const newTask = res.data.data.item
        const todolistTasks = tasks[todolistId] || []
        setTasks({...tasks, [todolistId]: [newTask, ...todolistTasks]})
      })
  }
 
  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>, task: Task) => {
    const model = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      status: e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New,
    }
    axios.put<Response<{item: Task}>>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${task.todoListId}/tasks/${task.id}`, model, configs)
      .then((res) => {
        const newTask = res.data.data.item
        setTasks({...tasks, [task.todoListId]: tasks[task.todoListId].map(t => t.id === task.id ? newTask : t)})
      })
  }  
  
  const removeTaskHandler = (taskId: string, todolistId: string) => {
    axios.delete<Response>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}/tasks/${taskId}`, configs)
      .then(() => {
        setTasks({...tasks, [todolistId]: tasks[todolistId].filter(t => t.id !== taskId)})
      })
  }
 
  const changeTaskTitleHandler = (title: string, task: Task) => {
    axios.put<Response<{item: Task}>>(`https://social-network.samuraijs.com/api/1.1//todo-lists/${task.todoListId}/tasks/${task.id}`, {title}, configs)
      .then(() => {
        setTasks({...tasks, [task.todoListId]: tasks[task.todoListId].map(t => t.id === task.id ? {...t, title} : t)})
      })
  }
 
  return (
    <div style={{ margin: '20px' }}>
      <AddItemForm addItem={createTodolistHandler} />
 
      {/* Todolists */}
      {todolists.map((tl) => {
        return (
          <div key={tl.id} style={todolist}>
            <div>
              <EditableSpan
                value={tl.title}
                onChange={(title: string) => updateTodolistHandler(tl.id, title)}
              />
              <button onClick={() => removeTodolistHandler(tl.id)}>x</button>
            </div>
            <AddItemForm addItem={title => createTaskHandler(title, tl.id)} />
 
            {/* Tasks */}
            {!!tasks[tl.id] &&
              tasks[tl.id].map((task) => {
                return (
                  <div key={task.id}>
                    <Checkbox
                      checked={task.status === TaskStatus.Completed}
                      onChange={e => changeTaskStatusHandler(e, task)}
                    />
                    <EditableSpan
                      value={task.title}
                      onChange={title => changeTaskTitleHandler(title, task)}
                    />
                    <button onClick={() => removeTaskHandler(task.id, tl.id)}>x</button>
                  </div>
                )
              })}
          </div>
        )
      })}
    </div>
  )
}
 
// Styles
const todolist: React.CSSProperties = {
  border: '1px solid black',
  margin: '20px 0',
  padding: '10px',
  width: '300px',
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
}

