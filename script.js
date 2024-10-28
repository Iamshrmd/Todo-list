let todoInput=document.querySelector('.add-input');
const todoForm=document.querySelector('.todo-form');
const todosContainer=document.querySelector('.todos-container');
const filterOptions=document.querySelector('.filter-option');
const updateModal=document.querySelector('.update-modal');
const exitBtn=document.querySelector('.exit-btn');
const updateInput=document.querySelector(".update-input");
const updateDateSpan=document.querySelector(".update-date-span");
const confirmBtn=document.querySelector(".confirm-btn");
let filterOption='all';

document.addEventListener('DOMContentLoaded',()=>{
  const todos= JSON.parse(localStorage.getItem("todos"));
  addTaskUi(todos);
})

filterOptions.addEventListener('change',(e)=>{
  filterOption=e.target.value;
  filterTodos();
});

function filterTodos() {
  const todos=getLocal();
  switch (filterOption) {
    case 'all':
      addTaskUi(todos);
      break;
    case 'completed':
      const comFilteredTodos = todos.filter((t)=>{
         return t.isCompleted;
      })
      addTaskUi(comFilteredTodos);
      break;
    case 'uncompleted':
    const uncomFilteredTodos=todos.filter((t)=>{
      return !t.isCompleted;
    })
      addTaskUi(uncomFilteredTodos);
      break;
    default:
      addTaskUi(todos);
      break;
  }
}
todoForm.addEventListener('submit',addTask);
function addTask(e) {
  e.preventDefault();
  if (!todoInput.value) return null;
  const todo={
    id:Date.now(),
    createdAt:new Date().toISOString(),
    title:todoInput.value,
    isCompleted:false,
  };
  const todos = getLocal();
  todos.push(todo);
  saveLocal(todos);
  filterTodos();
}

function addTaskUi(todos) {
  let result='';
  todos.forEach(t => {
    result+=`<div class="todo-list ${t.isCompleted ? 'complete':''}">
    <p class="list-task">${t.title}</p>
    <div>
      <span>${new Date(t.createdAt).toLocaleDateString("fa-IR",{
        hour:"2-digit",
        minute:'2-digit',
        year:"numeric",
        month:'numeric',
        day:'numeric',
      })}</span>
      <img class="check-img" data-todo-id="${t.id}"  src="./img/icons8-check-22.png">
      <img  class="delete-img" data-todo-id="${t.id}" src="./img/icons8-trash-22.png" alt="">
      <img  class="update-img" data-todo-id="${t.id}" src="./img/icons8-pencil-22.png" alt="">
      </div>
      </div> `;
    });
    todosContainer.innerHTML=result;
    todoInput.value='';
    const delimgs=document.querySelectorAll('.delete-img');
    const checkimgs=document.querySelectorAll('.check-img');
    const updateImgS=document.querySelectorAll('.update-img');
    delimgs.forEach(b => {
      b.addEventListener('click',deleteTodo)
    });
    checkimgs.forEach(b => {
      b.addEventListener('click',checkTodo)
    });
    updateImgS.forEach((b)=>{
      b.addEventListener('click',updateTodo)
    })
}
  
function deleteTodo(e) {
  let todos=getLocal();
  delId=parseInt(e.target.dataset.todoId);
  todos=todos.filter((t)=>{
    return t.id !== delId
  })
  saveLocal(todos);
  filterTodos();
}

function checkTodo(e) {
  todos=getLocal();
  const checkId=parseInt(e.target.dataset.todoId);
  const checkParent=e.target.parentElement.parentElement;
  console.log(checkParent);
  checkParent.classList.toggle("complete");
  const filteredTodo=todos.find(t=>t.id === checkId)
  filteredTodo.isCompleted= !filteredTodo.isCompleted;
  saveLocal(todos);
  filterTodos();
}

function updateTodo(e) {
  let todos=getLocal();
  updateModal.classList.add('show');
  const checkId= parseInt(e.target.dataset.todoId);
  console.log(checkId);
  const findTodo = todos.find(t=> t.id === checkId);
   console.log(findTodo);
   updateInput.value=findTodo.title; 
  updateDateSpan.innerText=new Date(findTodo.createdAt).toLocaleDateString('fa-IR');
  confirmBtn.addEventListener('click',(()=>{
    console.log(updateInput.value,findTodo.title);
    findTodo.title=updateInput.value;
    removeModal();
    saveLocal(todos);
    filterTodos();
  }))

}

exitBtn.addEventListener('click',(()=>{
  removeModal();
}))
function removeModal() {
  updateModal.classList.remove('show');
}

function saveLocal(todos) {
   localStorage.setItem('todos',JSON.stringify(todos))
}
function getLocal() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

  