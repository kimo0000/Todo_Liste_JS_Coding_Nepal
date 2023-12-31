const inputField = document.querySelector("header input"),
  filters = document.querySelectorAll(".controls span"),
  clear = document.querySelector(".clear"),
  taskEl = document.querySelector(".tasks");

console.log(filters);

let editId,
  isEditableTask = false;

let todos = JSON.parse(localStorage.getItem("todo_liste") || "[]");

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    btn.classList.add("active");
    addTodo(btn.id);
  });
});
function addTodo(filter) {
  let liTag = "";
  todos.forEach((todo, index) => {
    const { name, status } = todo;
    let isCompleted = status === "completed" ? "checked" : "";
    console.log(filter + " => " + status);
    if (filter === status || filter == "all") {
      liTag += ` <li class="task">
              <label for="${index}">
                  <input type="checkbox" onclick="completedTask(this)" id="${index}">
                  <p class="task_text ${isCompleted}">${name}</p>
              </label>
              <div class="elipsis">
                  <i class="fa-solid fa-ellipsis" onclick="showMenu(this)"></i>
                  <ul class="setting">
                     <li onclick="editTask(${index}, '${name}')">
                      <i class="fa-regular fa-pen-to-square"></i>Edit
                     </li>
                     <li onclick="deleteTask(${index})">
                      <i class="fa-solid fa-trash-can"></i>Delete
                     </li>
                  </ul>
              </div>
          </li>`;
    }
  });

  taskEl.innerHTML = liTag || `<span>is no task here!</span>`;
}

addTodo("all");

function deleteTask(id) {
  todos.splice(id, 1);
  localStorage.setItem("todo_liste", JSON.stringify(todos));
  addTodo("all");
}

clear.addEventListener("click", () => {
  todos.splice(0, todos.length);
  localStorage.setItem("todo_liste", JSON.stringify(todos));
  addTodo("all");
});

function editTask(taskId, taskText) {
  isEditableTask = true;
  editId = taskId;
  inputField.value = taskText;
}

function completedTask(selectedTodo) {
  console.log(selectedTodo);
  let taskText = selectedTodo.nextElementSibling;
  if (selectedTodo.checked) {
    taskText.classList.add("checked");
    todos[selectedTodo.id].status = "completed";
  } else {
    taskText.classList.remove("checked");
    todos[selectedTodo.id].status = "pending";
  }

  localStorage.setItem("todo_liste", JSON.stringify(todos));
}

function showMenu(taskIcon) {
  let taskMenu = taskIcon.nextElementSibling;
  taskMenu.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != taskIcon) {
      taskMenu.classList.remove("show");
    }
  });
}

inputField.addEventListener("keyup", (e) => {
  let userTask = inputField.value.trim();
  if (e.key == "Enter" && userTask) {
    if (!isEditableTask) {
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo);
    } else {
      todos[editId].name = userTask;
      isEditableTask = false;
    }

    localStorage.setItem("todo_liste", JSON.stringify(todos));
    addTodo("all");

    inputField.value = "";
  }
});
