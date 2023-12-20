const list = document.getElementById("list");
const createBtn = document.getElementById("create-btn");

let todos = [];

createBtn.addEventListener("click", createNewTodo);

function createNewTodo() {
  // 새로운 아이템 객체 생성
  const item = { id: new Date().getTime(), text: "", complete: false };

  //배열 처음에 새로운 아이템을 추가
  todos.unshift(item);
  // 데이터만 있으면 화면에 안보임 => 요소 필요

  // 요소 생성하기
  const { itemEl, inputEl, editBtnEl, removeBtnEl } = createTodoElement(item);

  //리스트 요소 안에 방금 생성한 아이템 요소 추가
  list.prepend(itemEl); // prepend: node를 집어넣음((pre)앞에 추가)

  inputEl.removeAttribute("disabled"); // 처음엔 타이핑 되어야함

  inputEl.focus(); // 만들면 바로 타이핑 되게
  saveToLocalStorage();
}

function createTodoElement(item) {
  const itemEl = document.createElement("div");
  itemEl.classList.add("item");

  const checkboxEl = document.createElement("input");
  checkboxEl.type = "checkbox";
  checkboxEl.checked = item.complete;

  if (item.complete) {
    itemEl.classList.add("complete");
  }

  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.value = item.text;
  inputEl.setAttribute("disabled", ""); //disabled있으면 타이핑 안됨

  const actionsEl = document.createElement("div");
  actionsEl.classList.add("actions");

  const editBtnEl = document.createElement("button");
  editBtnEl.classList.add("material-icons");
  editBtnEl.innerText = "edit";

  const removeBtnEl = document.createElement("button");
  removeBtnEl.classList.add("material-icons", "remove-btn");
  removeBtnEl.innerText = "remove_circles";

  // 체크박스 누름에 따라 변경
  checkboxEl.addEventListener("change", () => {
    item.complete = checkboxEl.checked; // 클릭되면 true, 아니면 false

    if (item.complete) {
      itemEl.classList.add("complete");
    } else {
      itemEl.classList.remove("complete");
    }
    saveToLocalStorage();
  });

  // focus 풀면 수정 못하게 disabled 넣기
  inputEl.addEventListener("blur", () => {
    inputEl.setAttribute("disabled", "");
    saveToLocalStorage();
  });

  //타이핑 저장
  inputEl.addEventListener("input", () => {
    item.text = inputEl.value;
  });

  // edit 누르면 disabled 풀고 focus 가게하기
  editBtnEl.addEventListener("click", () => {
    inputEl.removeAttribute("disabled");
    inputEl.focus();
  });

  // remove : 데이터도 지우고 요소도 지워야함
  removeBtnEl.addEventListener("click", () => {
    //클릭하면 데이터지우기
    todos = todos.filter((t) => t.id !== item.id); // 다른것만 반환

    itemEl.remove(); // 요소 지우기

    saveToLocalStorage();
  });
  actionsEl.append(editBtnEl);
  actionsEl.append(removeBtnEl);

  itemEl.append(checkboxEl);
  itemEl.append(inputEl);
  itemEl.append(actionsEl);

  return { itemEl, inputEl, editBtnEl, removeBtnEl };
}

// 정보 저장하기 (새로고침해도)
function saveToLocalStorage() {
  // localstorage에는 항상 string으로 넣어야 함 todos는 배열이므로 변환해줘야함!
  const data = JSON.stringify(todos);

  // window.localStorage.setItem(key,value)로 하면됨 window 생략 가능
  localStorage.setItem("my_todos", data);
}

// 정보 불러오기 (새로고침해도)
function loadFromLocalStorage() {
  const data = localStorage.getItem("my_todos");

  if (data) {
    todos = JSON.parse(data); // string => object 변환
  }
}

function displayTodos() {
  loadFromLocalStorage();
  for (let i = 0; i < todos.length; i++) {
    const item = todos[i];
    const { itemEl } = createTodoElement(item);

    list.append(itemEl);
  }
}

displayTodos();
