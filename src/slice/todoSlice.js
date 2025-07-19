import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    todos:[]
}
const todoSlice = createSlice({
    name:'todo',
    initialState,
    reducers:{
        addTodo: (state,action)=>{
            state.todos.push({
                ...action.payload,
                completed: false,
            });
        },
        deleteTodo: (state,action)=>{
            state.todos = state.todos.filter(todo=>todo.id !== action.payload.id);
        },
        editTodo: (state, action) => {
            const { id, text } = action.payload;
            const todo = state.todos.find(todo => todo.id === id);
            if (todo) {
                todo.text = text;
            }
        },
        toggleComplete: (state, action) => {
            const todo = state.todos.find(todo => todo.id === action.payload.id);
            if (todo) {
                todo.completed = !todo.completed;
            }
        }
    }
})
export const {addTodo,deleteTodo,editTodo,toggleComplete}=  todoSlice.actions;
export default todoSlice.reducer;