import React, {useState, useEffect} from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [date, setDate] = useState('');

  //編集機能の管理
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  
  const [todos, setTodos] = useState(() => {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : {};
  });

  //追加処理
  const handleAdd = () => {
    if(input.trim() === '' || date.trim() === '') return; 

    const newTodo = {id: Date.now(), text: input, isDone: false}; //一意のIDを付与

    setTodos((prevTodos) => {
      const newTodos = {...prevTodos};
      if(!newTodos[date]){
        newTodos[date] = [];
      }
      newTodos[date] = [...newTodos[date], newTodo];
      return newTodos;
    });

    setInput('');
  };

  //削除処理
  const handleDelete = (date, id) => {
    setTodos((prevTodos) => {
      const newTodos = {...prevTodos};
      newTodos[date] = newTodos[date].filter(todo => todo.id !== id);
      if(newTodos[date].length === 0){
        delete newTodos[date]; //空の日付は削除
      }
      return newTodos;
    });
  };

  //完了状態の切り替え処理
  const handleToggleDone = (date, id) => {
    setTodos((prevTodos) => {
      const newTodos = {...prevTodos};
      newTodos[date] = newTodos[date].map(todo =>
        todo.id === id ? {...todo, isDone: !todo.isDone} : todo
      );
      return newTodos;
    });
  }

  //編集処理
  const startEditing = (date, id, text) => {
    setEditingId({date, id});
    setEditingText(text);
  };

  //編集確定
  const handleEdit = () => {
    if(editingText.trim() === '') return;

    setTodos(prevTodos => {
      const newTodos = {...prevTodos};
      newTodos[editingId.date] = newTodos[editingId.date].map((todo) =>
        todo.id === editingId.id ? {...todo, text: editingText} : todo
      );
      return newTodos;
    });
    
    setEditingId(null);
    setEditingText('');
  };

  //todosが変更されるたびにlocalStorageに保存
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  return (
    <div className='App'>
      <h1>カレンダーToDoリスト</h1>
      <input
        type = "date"
        value = {date}
        onChange={(e) => setDate(e.target.value)}
        />
      <input
        type = "text"
        value = {input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter'){
            handleAdd();
          }
        }}
      />
      <button onClick = {handleAdd}>追加</button>

      {Object.keys(todos)
      .sort((a, b) => new Date(a) - new Date(b)) //日付順にソート
      .map((todoDate) => (
        <div key = {todoDate}>
          <h3>{todoDate}</h3>
          <ul>
            {todos[todoDate].map((todo) => (
              <li key = {todo.id}>
                {/*チェックボックスを追加*/}
                <input
                  type = "checkbox"
                  checked = {todo.isDone}
                  onChange={() => handleToggleDone(todoDate, todo.id)}
                />
                {/*編集中の処理*/}
                {editingId && editingId.date === todoDate && editingId.id === todo.id ? (
                  <>
                    <input
                      type = "text"
                      value = {editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleEdit();
                        }
                      }}
                    />
                    <button onClick={handleEdit}>確定</button>
                  </>                  
                ) : (
                  <>
                    <span style = {{textDecoration: todo.isDone ? 'line-through' : 'none'}}>
                      {todo.text}
                    </span>
                    <button onClick={() => startEditing(todoDate, todo.id, todo.text)}>編集</button>                    
                  </>
                )}
                <button onClick={() => handleDelete(todoDate, todo.id)}>削除</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div> 
  );
}


export default App;
