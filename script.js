const routes = {
    "": "all",
    "#alltask": "all",
    "#onprogress": "onprogress",
    "#completed": "completed"
}

let path;

let closeToggle = document.querySelector('.close_mobile');
let toggle = document.querySelector('.toggle_mobile');

function changeContent(){
    path = window.location.hash;
    const appContainer = document.querySelector('.app_container');
    const type = routes[path];
    const data = getTodoFromLocal()
    appContainer.innerHTML = ""
    checkHash(path) 

    switch(routes[path]){
        case "all":
            let header = `
            <div class="header">
                <div class="title">
                    ☼ All Task
                    <button class="toggle_mobile">
                        <i class="fa-solid fa-bars fa-lg"></i>
                    </button>
                </div>

                <div class="sortBy">
                    <label for="sort">Sort: </label>
                    <select name="sort" id="sort" onchange="changeSort(event)">
                        <option value="date">Date</option>
                        <option value="isCompleted">Status</option>
                    </select>
                </div>
            </div>

            <div class="add_todo">
                <form class="input" onsubmit="addTodo(event)">
                    <input type="text" placeholder="Add Todo" class="todoInput" required maxlength="40">

                    <button class="addBtn" type="submit">Add</button>
                </form>
            </div>
        </div>
        </div>
            `

            appContainer.innerHTML = header;

            renderList({data, type});
            break;
        case "onprogress":
                let onprogressHeader = `
                    <div class="header">
                        <div class="title">
                            ☼ On Progress
                            <button class="toggle_mobile">
                        <i class="fa-solid fa-bars fa-lg"></i>
                    </button>
                        </div>

                        <div class="sortBy">
                            <label for="sort">Sort: </label>
                            <select name="sort" id="sort" onchange="changeSort(event)">
                        <option value="date">Date</option>
                        <option value="isCompleted">Status</option>
                    </select>
                        </div>
                    </div>

                    <div class="add_todo">
                        <form class="input" onsubmit="addTodo(event)">
                            <input type="text" placeholder="Add Todo" class="todoInput" required maxlength="40">

                            <button class="addBtn" type="submit">Add</button>
                        </form>
                    </div>
                </div>
                </div>
                    `

                    appContainer.innerHTML = onprogressHeader;
                    renderList({data, type: "onprogress"})
                break;
        case "completed":
                    let completedHeader = `
                    <div class="header">
                        <div class="title">
                            ☼ Completed To Do
                            <button class="toggle_mobile">
                        <i class="fa-solid fa-bars fa-lg"></i>
                    </button>
                        </div>

                        <div class="sortBy">
                            <label for="sort">Sort: </label>
                            <select name="sort" id="sort" onchange="changeSort(event)">
                        <option value="date">Date</option>
                        <option value="isCompleted">Status</option>
                    </select>
                        </div>
                    </div>

                    <div class="add_todo">
                        <form class="input" onsubmit="addTodo(event)">
                            <input type="text" placeholder="Add Todo" class="todoInput" required maxlength="40">

                            <button class="addBtn" type="submit">Add</button>
                        </form>
                    </div>
                </div>
                </div>
                    `

                    appContainer.innerHTML = completedHeader;
                    renderList({data, type});
                    break;
    }

}

addEventListener('hashchange', 
    changeContent
);

changeContent()


function addTodo(event){
    event.preventDefault()
    const input = document.querySelector('.todoInput');

    if(input.value !== ""){
        const data = getTodoFromLocal() || [];
        const nextId = data.length;
        const date = new Date();

        data.push({
            "id": nextId,
            "isCompleted": false,
            "value": input.value,
            "date": date.toLocaleDateString(),
        });

        saveTodoToLocal(data);

        input.value = "";
        renderList({data});

        showToast({message: "To do added.", color: "green"});
    }
}

function renderList({data, type = "all"}){
    const app = document.querySelector('.app_container');
    closeToggle = document.querySelector('.close_mobile')
    closeToggle.addEventListener('click', closeSide);

    toggle = document.querySelector('.toggle_mobile');

    toggle.addEventListener('click', checkMobile)


    let element = document.querySelector('.todo_list');

    let newData = [];

    if(type !== "all"){
        if(type === "onprogress"){
            newData = data.filter((item) => item.isCompleted === (type !== "onprogress"))
        } else if (type === "completed"){
            newData = data.filter((item) => 
                item.isCompleted === (type === "completed")
            )
        }
    } else {
        newData = data;
    }

    const sort = document.getElementById('sort').value;

        newData.sort((a, b) => {
            return a[sort] - b[sort];
        })

    if(newData.length > 0){
        if(!element){
            const container = document.createElement('div');
            container.classList.add('todo_list');
            app.insertAdjacentElement("beforeend", container);
            element = document.querySelector(".todo_list");
        }

    element.innerHTML = ""

    let elementHTML = "";


    newData.forEach((item, index) => {
        const elementHTMLEntry = `
        <div class="box">
        <label for="${item.id}">
            <input type="checkbox" class="checkbox" id="${item.id}" name="${item.id}" ${item.isCompleted ? "checked" : ""}  data-id="${item.id}" onchange="changeList(event)">
            <span class="checkmark"></span>
            <p class="text">${item.value}</p>
        </label>
        <div class="action">
            <span class="${item.isCompleted ? 'completed' : "onprogress"}"></span>
            <button type="button" class="removeBtn" onclick="removeItem(${item.id})">
                <i class="fa-solid fa-close fa-lg"></i>
            </button>
        </div>
        </div>
        `

        elementHTML += elementHTMLEntry;
    })

    element.innerHTML = elementHTML;
} else {
    element.remove()
    
}
}

function changeList(event){
    const id = event.target.dataset.id;
    const type = routes[path];

    const data = getTodoFromLocal() || [];
    
    data.forEach((item) => {
        if(item.id === parseInt(id)){
            item.isCompleted = !item.isCompleted
        }
    })

    saveTodoToLocal(data);
    renderList({data, type})
    showToast({message: "To do updated.", color: "green"})
}

function changeSort(event){
    path = window.location.hash;
    const sortby = document.getElementById('sort')
    sortby.value = event.target.value;
    const data = getTodoFromLocal();
    const type = routes[path]
    renderList({data, type})
}

function removeItem(id){
    const data = getTodoFromLocal() || [];
    const type = routes[path];

    data.forEach((item, index) => {
        if(item.id === id){
            data.splice(index, 1);
        }
    })

    saveTodoToLocal(data);
    renderList({data, type})
    showToast({message: "To do removed.", color: "red"})
}

function getTodoFromLocal(){
    return JSON.parse(localStorage.getItem('linux_todo'));
}

function saveTodoToLocal(data){
    localStorage.setItem("linux_todo", JSON.stringify(data));
}

function checkHash(path){
    const elements = document.querySelectorAll('.sidebar_menu li a');

    elements.forEach((item) => {
        if(item.hash === path){
            item.classList.add('current');
        } else {
            item.classList.remove('current')
        }
    })
}

function showToast({message, color}){
    let timeout;
    clearTimeout(timeout)
    const toast =document.querySelector('.toast');
    toast.textContent = message;
    toast.classList.add(color);
    toast.style.display = "flex"

    timeout = setTimeout(() => {
        toast.style.display = "none";
        toast.classList.remove(color)
        toast.textContent = "";
    }, 3000);
    
}

function checkMobile(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = "flex";
}



// closeToggle.addEventListener('click', closeSide)

function closeSide(){
    console.log('s')
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    sidebar.style.display = "none";

}