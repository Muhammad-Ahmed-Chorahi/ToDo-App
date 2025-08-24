const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoListUL = document.getElementById("todo-list");

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo();
});

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    const todoObject ={
        text:todoText,
        completed:false
    }
    allTodos.push(todoObject);
    updateTodoList();
    saveTodos();
    todoInput.value = "";
  }
}

function updateTodoList() {
  todoListUL.innerHTML = "";
  // Split todos into unchecked and checked
  const unchecked = [];
  const checked = [];
  allTodos.forEach((todo, i) => {
    if (todo.completed) {
      checked.push({ ...todo, originalIndex: i });
    } else {
      unchecked.push({ ...todo, originalIndex: i });
    }
  });
  // Render unchecked in original order, checked in most-recently-checked-first order
  unchecked.forEach((todoObj) => {
    todoItem = createTodoItem(todoObj, todoObj.originalIndex);
    todoListUL.append(todoItem);
  });
  checked.forEach((todoObj) => {
    todoItem = createTodoItem(todoObj, todoObj.originalIndex);
    todoListUL.append(todoItem);
  });
}

function createTodoItem(todo, todoIndex) {
    const todoId = "todo-" + todoIndex;
  const todoLI = document.createElement("li");
  const todoText=todo.text;
  todoLI.className = "todo";
  todoLI.innerHTML = `
    <input type="checkbox" name="" id="${todoId}">
                <label for="${todoId}" class="custom-checkbox">
                    <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
                </label>
                <label for="${todoId}" class="todo-text">${todoText}</label>
                <button class="delete-button">
                    <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
    `;

    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click",()=>{
        deleteTodoItem(todoIndex);
    })
    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", () => {
    allTodos[todoIndex].completed = checkbox.checked;
    if (checkbox.checked) {
      // Move to top of checked group
      const checkedTodos = allTodos.filter(t => t.completed && allTodos.indexOf(t) !== todoIndex);
      const uncheckedTodos = allTodos.filter(t => !t.completed || allTodos.indexOf(t) === todoIndex);
      // Remove from current position and add to front of checked group
      const checkedTodo = allTodos[todoIndex];
      allTodos = uncheckedTodos.filter((_, i) => i !== todoIndex)
        .concat(checkedTodos);
      allTodos.push(checkedTodo);
    } else {
      // Move to end of unchecked group
      const uncheckedTodos = allTodos.filter(t => !t.completed && allTodos.indexOf(t) !== todoIndex);
      const checkedTodos = allTodos.filter(t => t.completed);
      const uncheckedTodo = allTodos[todoIndex];
      allTodos = uncheckedTodos.concat([uncheckedTodo]).concat(checkedTodos);
    }
    saveTodos();
    updateTodoList();
  })
    checkbox.checked=todo.completed;
  return todoLI;
}

function deleteTodoItem(todoIndex){
    allTodos=allTodos.filter((_,i)=> i !== todoIndex);
    saveTodos();
    updateTodoList();
}

function saveTodos(){
    const todoJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todoJson);
}

function getTodos(){
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}