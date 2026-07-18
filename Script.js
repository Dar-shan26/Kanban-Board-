const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

let dragElement = null;
let tasksData = {};

function updateCounts() {
    [todo, progress, done].forEach(col => {
        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right");
        count.innerText = tasks.length;
    });
}

function saveTasks() {
    [todo, progress, done].forEach(col => {
        const tasks = col.querySelectorAll(".task");

        tasksData[col.id] = Array.from(tasks).map(task => ({
            title: task.querySelector("h2").innerText,
            desc: task.querySelector("p").innerText
        }));
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

function addDeleteEvent(task) {
    const btn = task.querySelector("button");

    btn.addEventListener("click", () => {
        task.remove();
        updateCounts();
        saveTasks();
    });
}

function addDragEvent(task) {
    task.addEventListener("dragstart", () => {
        dragElement = task;
    });

    addDeleteEvent(task);
}

document.querySelectorAll(".task").forEach(task => {
    addDragEvent(task);
});

function addDragEventsColumn(column) {
    column.addEventListener("dragenter", () => {
        column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", () => {
        column.classList.remove("hover-over");
    });

    column.addEventListener("dragover", e => {
        e.preventDefault();
    });

    column.addEventListener("drop", e => {
        e.preventDefault();

        if (dragElement) {
            column.appendChild(dragElement);
            column.classList.remove("hover-over");
            updateCounts();
            saveTasks();
        }
    });
}

addDragEventsColumn(todo);
addDragEventsColumn(progress);
addDragEventsColumn(done);

updateCounts();
saveTasks();

const toggleModelBtn = document.querySelector("#toggle-model");
const model = document.querySelector(".model");
const modelBg = document.querySelector(".model .bg");
const addTaskBtn = document.querySelector("#add-new-task");

toggleModelBtn.addEventListener("click", () => {
    model.classList.toggle("active");
});

modelBg.addEventListener("click", () => {
    model.classList.remove("active");
});

addTaskBtn.addEventListener("click", () => {
    const taskTitle = document.querySelector("#task-title-input").value.trim();
    const taskDesc = document.querySelector("#task-disc-input").value.trim();

    if (!taskTitle || !taskDesc) {
        alert("Please fill all fields");
        return;
    }

    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = `
        <h2>${taskTitle}</h2>
        <p>${taskDesc}</p>
        <button>Delete</button>
    `;

    todo.appendChild(div);

    addDragEvent(div);

    updateCounts();
    saveTasks();

    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-disc-input").value = "";

    model.classList.remove("active");
});