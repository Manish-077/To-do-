import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import{ useDispatch , useSelector } from 'react-redux'
import { addTodo ,deletetodo} from './slice/todoSlice';
import {v4 as uuid } from 'uuid';
function App() {
  const[inputText,sertinputText] = useState();
  const dispatch = useDispatch();
  const state = useSelector(state=>state);
  console.log(state);
  const onAddClick = ()=>{
   dispatch(addTodo({
    id: uuid(),
    todo: inputText,

   }))
   sertinputText('');
  }
  const onDeleteClick =(id)=>{
    dispatch(deletetodo(id));
  }
  return (
    <div className="App bg-slate-200 w-screen h-screeen">
      <h1 className='text-purple-950 mt-4'>Todo App</h1>
      <div>
        <input value={inputText} onChange={(e)=>{sertinputText(e.target.value)} } placeholder='Enter todo..' />
        <button onClick={onAddClick}>Add</button>
      </div>
      {
        todos.length > 0 && todos.map(todo=>{
          <div>
            <span>{todo.todo}</span>
            <button onClick={()=>{onDeleteClick(todo.id)}}>Delete</button>
            <div/>
        })
      }
    </div>
    
  );
}

export default App;
