import { useState, useEffect } from 'react'

const Form = ({ create })=> {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const submit = async(ev)=> {
    try {
      ev.preventDefault();
      await create({ name });
      setName('');
    }
    catch(ex){
      setError(ex.error);
    }
  };
  return (
    <form onSubmit={ submit }>
      { error }
      <input value={ name } onChange={ ev => setName(ev.target.value)} />
      <button>Save</button>
    </form>
  );
};
function App() {
  const [todos, setTodos] = useState([]);
  useEffect(()=> {
    const fetchTodos = async()=> {
      const response = await fetch('/api/todos');
      const json = await response.json();
      if(response.ok){
        setTodos(json);
      }
    }
    fetchTodos();
  }, []);

  const toggle = async(todo)=> {
    const response = await fetch(`/api/todos/${todo.id}`, {
      method: 'PUT',
      body: JSON.stringify({ isComplete: !todo.isComplete }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json();
    if(response.ok){
      setTodos(todos.map(todo => todo.id === json.id ? json : todo));
    }
  };

  const create = async(todo)=> {
    const response = await fetch('/api/todos/', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json();
    if(response.ok){
      setTodos([...todos, json]);
    }
    else {
      throw json;
    }
  };

  const destroy = async(todo)=> {
    const response = await fetch(`/api/todos/${todo.id}`, {
      method: 'DELETE',
    });
    if(response.ok){
      setTodos(todos.filter(_todo => _todo.id !== todo.id));
    }
    else {
      console.log(json);
    }
  };

  return (
    <>
      <h1>Todos ({ todos.length })</h1>
      <Form create={ create } />
      <ul>
        {
          todos.map( todo => {
            return (
              <li key={ todo.id } className={ todo.isComplete ? 'complete': ''}>{ todo.name }
                <p>
                updated { ((new Date() - new Date(todo.updatedAt))/1000).toFixed(1) } seconds ago
                </p>
                <button onClick={ ()=> toggle(todo)}>toggle</button>
                <button onClick={ ()=> destroy(todo)}>destroy</button>
              </li>
            );
          })
        }
      </ul>
    </>
  )
}

export default App
