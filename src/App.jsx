import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [fetched, setFetched] = useState([]);
  const [isAsc, setIsAsc] = useState(false);
  const [todoLoader, setTodoLoader] = useState(false);

  useEffect(() => {
    setTodoLoader(true);
    fetchTodos().then((data) => {
      setTodos(data);
      setFetched(data);
      setTodoLoader(false);
    });
  }, []);

  useEffect(() => {
    search();
  }, [keyword]);

  const sort = async () => {
    if (todos[0]?.id > todos[todos.length - 1]?.id || isAsc === true) {
      setIsAsc(false);
    } else if (todos[0]?.id < todos[todos.length - 1]?.id || isAsc === false) {
      setIsAsc(true);
    }
    const result = todos.reverse();
    setTodos(result);
  };

  const fetchTodos = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos");
    const result = await res.json();
    return result;
  };

  const getUserDetails = async (todo) => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users/${todo.userId}`
    );
    const result = await res.json();
    setUser({ ...result, todoId: todo.id, todoTitle: todo.title });
  };

  const search = async (e) => {
    setTodoLoader(true);
    const newTodos = fetched.filter((todo) => {
      let string = `${todo.id} ${todo.title}`;
      string = string.toLowerCase();
      const res = string.match(keyword.toLowerCase());
      const status = todo.completed ? "complete" : "incomplete";
      return res || status === keyword.toLowerCase();
    });
    setTodos(newTodos);
    setTodoLoader(false);
  };

  return (
    <div className="App">
      <div className="todo-list">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <h3>All Todos</h3>
          <input
            type="text"
            className="search-field"
            placeholder="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <table className="todo-list-table">
          <thead>
            <tr>
              <th>
                Todo ID{" "}
                <span className="sort-btn" onClick={sort}>
                  {isAsc ? "ASC" : "DESC"}
                </span>
              </th>
              <th>Title</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          {todos && todos?.length > 0 ? (
            <tbody>
              {todos.map(
                (todo) =>
                  todo && (
                    <tr key={todo.id}>
                      <td>{todo.id}</td>
                      <td>{todo.title}</td>
                      <td>{todo.completed ? "Complete" : "Incomplete"}</td>
                      <td>
                        <button
                          className="view-btn"
                          onClick={() => getUserDetails(todo)}
                        >
                          view user
                        </button>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          ) : todoLoader ? (
            <tbody>
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Loading...!
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No data found!
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      {user && (
        <div className="user-details">
          <h3>User Details</h3>
          <p>
            <b>Todo Id : </b>
            {user.todoId}
          </p>
          <p>
            <b>Todo title: </b>
            {user.todoTitle}
          </p>
          <br />
          <p>
            <b>userId : </b>
            {user.id}
          </p>
          <p>
            <b>Name: </b>
            {user.name}
          </p>
          <p>
            <b>Email : </b>
            {user.email}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
