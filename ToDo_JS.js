document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const itemCount = document.getElementById('item-count');
    const deleteAllBtn = document.getElementById('delete-all');
    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    function renderTodos() {
        todoList.innerHTML = '';
        
        if (todos.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'No todos yet!';
            emptyMessage.classList.add('empty-message');
            todoList.appendChild(emptyMessage);
        } else {
            todos.forEach(todo => {
                const todoItem = document.createElement('li');
                todoItem.classList.add('todo-item');
                todoItem.dataset.id = todo.id;
                
                todoItem.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                `;
                
                todoList.appendChild(todoItem);
            });
        }
        
        updateItemCount();
    }
    
    function updateItemCount() {
        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        itemCount.textContent = `${completed} of ${total} ${total === 1 ? 'item' : 'items'} completed`;
    }
    
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({
                id: Date.now(),
                text: text,
                completed: false
            });
            saveTodos();
            todoInput.value = '';
            renderTodos();
        }
    }
    
    function toggleComplete(todoId) {
        todos = todos.map(todo => {
            if (todo.id === todoId) {
                return {...todo, completed: !todo.completed};
            }
            return todo;
        });
        saveTodos();
        renderTodos();
    }
    
    function deleteTodo(todoId) {
        todos = todos.filter(todo => todo.id !== todoId);
        saveTodos();
        renderTodos();
    }
    
    function deleteAllTodos() {
        if (todos.length > 0 && confirm('Are you sure you want to delete all todos?')) {
            todos = [];
            saveTodos();
            renderTodos();
        }
    }
    
    addBtn.addEventListener('click', addTodo);
    
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    todoList.addEventListener('click', function(e) {
        const todoItem = e.target.closest('.todo-item');
        if (!todoItem) return;
        
        const todoId = parseInt(todoItem.dataset.id);
        
        if (e.target.classList.contains('delete-btn') || e.target.classList.contains('fa-trash')) {
            deleteTodo(todoId);
        } else if (e.target.classList.contains('todo-checkbox')) {
            toggleComplete(todoId);
        }
    });
    
    deleteAllBtn.addEventListener('click', deleteAllTodos);
    
    renderTodos();
});