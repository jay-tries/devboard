
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const searchInput = document.querySelector("#search-input");
const filterSelect = document.querySelector("#filter-select");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const emptyMessage = document.querySelector("#empty-message");
const totalCount = document.querySelector("#total-count");
const activeCount = document.querySelector("#active-count");
const completedCount = document.querySelector("#completed-count");
const progressLabel = document.querySelector("#progress-label");
const progressBar = document.querySelector("#progress-bar");
const progressTrack = document.querySelector("#progress-track");
const clearCompletedButton = document.querySelector("#clear-completed");

let tasks = JSON.parse(localStorage.getItem("devboard-tasks")) || [];
let nextId = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = input.value.trim();
  if (!title) return;

  tasks.push({
    id: nextId++,
    title,
    completed: false
  });

  input.value = "";
  renderTasks();
});

function renderTasks() {
  const query = searchInput.value.trim().toLowerCase();
  const filter = filterSelect.value;

  const visibleTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(query);
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed);

    return matchesSearch && matchesFilter;
  });

  taskList.replaceChildren();

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = "task-item" + (task.completed ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Complete " + task.title);

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.title;

    const removeButton = document.createElement("button");
    removeButton.className = "delete-btn";
    removeButton.textContent = "Delete";

    removeButton.addEventListener("click", () => {
      tasks = tasks.filter((item) => item.id !== task.id);
      renderTasks();
    });

    item.append(checkbox, text, removeButton);
    taskList.append(item);
  });

  const remaining = tasks.filter((task) => !task.completed).length;
  taskCount.textContent =
    `${tasks.length} tasks · ${remaining} remaining`;
    const completed = tasks.filter(task => task.completed).length;
const total = tasks.length;
const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

totalCount.textContent = total;
activeCount.textContent = remaining;
completedCount.textContent = completed;

progressLabel.textContent = `${progress}%`;
progressBar.style.width = `${progress}%`;
progressTrack.setAttribute("aria-valuenow", progress);

  emptyMessage.hidden = visibleTasks.length > 0;
  localStorage.setItem("devboard-tasks",JSON.stringify(tasks));
}

searchInput.addEventListener("input", renderTasks);
filterSelect.addEventListener("change", renderTasks);

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  renderTasks();
});

renderTasks();