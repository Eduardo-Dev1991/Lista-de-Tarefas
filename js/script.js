(() => {
  "use strict";

  const formAddLi = document.querySelector("#todo-add");
  const ulTodoList = document.querySelector(".todo-list");
  const itemInput = document.querySelector("#item-input");
  const lis = ulTodoList.getElementsByClassName("todo-item");
  const tasks = getSavedData();

  function getSavedData() {
    let savedData = localStorage.getItem("tasks");
    savedData = JSON.parse(savedData);
    return savedData && savedData.length
      ? savedData
      : [{ name: "task", createAt: Date.now(), complete: false }];
  }

  function setNewData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function addTask(task) {
    tasks.push({
      name: task,
      createAt: Date.now(),
      complete: false,
    });
    setNewData();
  }

  function renderTasks() {
    ulTodoList.innerHTML = "";
    tasks.forEach((task) => {
      ulTodoList.appendChild(generatedLiTask(task));
    });
    setNewData();
  }

  function generatedLiTask(obj) {
    const liTask = document.createElement("li");
    liTask.classList.add("todo-item");

    const buttonCheck = document.createElement("button");
    buttonCheck.classList = "button-check";
    buttonCheck.setAttribute("data-action", "checkButton");

    const iCheck = document.createElement("i");
    iCheck.className = "fas fa-check displayNone";
    iCheck.setAttribute("data-action", "checkButton");
    buttonCheck.appendChild(iCheck);

    const p = document.createElement("p");
    p.classList = "task-name";
    p.textContent = obj.name;

    const editButton = document.createElement("i");
    editButton.setAttribute("data-action", "editButton");
    editButton.className = "fas fa-edit";

    const buttonDelete = document.createElement("i");
    buttonDelete.setAttribute("data-action", "deleteButton");
    buttonDelete.className = "fas fa-trash-alt";

    liTask.appendChild(buttonCheck);
    liTask.appendChild(p);
    liTask.appendChild(editButton);

    const divContainerEdit = document.createElement("div");
    divContainerEdit.className = "editContainer";

    const editInput = document.createElement("input");
    editInput.className = "editInput";
    editInput.setAttribute("type", "text");
    editInput.value = obj.name;

    const editButtonInContainer = document.createElement("button");
    editButtonInContainer.className = "editButton";
    editButtonInContainer.textContent = "Editar";
    editButtonInContainer.setAttribute("data-action", "editButtonContainer");

    const cancelButton = document.createElement("button");
    cancelButton.className = "cancelButton";
    cancelButton.textContent = "Cancelar";
    cancelButton.setAttribute("data-action", "cancelButton");

    divContainerEdit.appendChild(editInput);
    divContainerEdit.appendChild(editButtonInContainer);
    divContainerEdit.appendChild(cancelButton);

    liTask.appendChild(divContainerEdit);
    liTask.appendChild(buttonDelete);

    ulTodoList.appendChild(liTask);
    return liTask;
  }

  ulTodoList.addEventListener("click", function clickedUl(evt) {
    const dataAction = evt.target.getAttribute("data-action");
    if (!dataAction) return;

    let currentLi = evt.target;
    while (currentLi.nodeName !== "LI") {
      currentLi = currentLi.parentNode;
    }
    const currentIndexLis = [...lis].indexOf(currentLi);

    const actions = {
      checkButton: () => {
        tasks[currentIndexLis].complete = !tasks[currentIndexLis].complete;
        if (tasks[currentIndexLis].complete) {
          currentLi.querySelector("i").classList.remove("displayNone");
        } else {
          currentLi.querySelector("i").classList.add("displayNone");
        }
        setNewData();
      },
      editButton: () => {
        const divContainer = currentLi.querySelector(".editContainer");
        [...ulTodoList.querySelectorAll(".editContainer")].forEach((button) =>
          button.removeAttribute("style")
        );
        const inputEdit = ulTodoList.querySelector(".editInput");
        divContainer.style.display = "flex";
        inputEdit.focus();
      },
      deleteButton: () => {
        tasks.splice(currentIndexLis, 1);
        renderTasks();
        setNewData();
      },
      editButtonContainer: () => {
        const renameEdit = currentLi.querySelector(".editInput").value;
        tasks[currentIndexLis].name = renameEdit;
        renderTasks();
        setNewData();
      },
      cancelButton: () => {
        const divContainer = currentLi.querySelector(".editContainer");
        divContainer.style.display = "none";
        currentLi.querySelector(".editInput").value =
          tasks[currentIndexLis].name;
      },
    };

    if (actions[dataAction]) {
      actions[dataAction]();
    }
  });

  formAddLi.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask(itemInput.value);
    renderTasks();
    itemInput.value = "";
    itemInput.focus();
  });

  renderTasks();
})();
