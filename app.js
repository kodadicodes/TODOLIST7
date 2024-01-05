// HTML form elementini seç
const form = document.getElementById("todoAddForm");

// Todo eklemek için input elementini seç
const addInput = document.getElementById("todoName");

// Todo listesini içeren div'i seç
const todoList = document.querySelector(".list-group");

// İlk card elemanının body'sini seç
const firstCadBody = document.querySelectorAll(".card-body")[0];

// İkinci card elemanının body'sini seç
const secondCardBody = document.querySelectorAll(".card-body")[1];

// Temizleme butonunu seç
const clearButton = document.getElementById("clearButton");

// Filtreleme için input elementini seç
const filterInput = document.getElementById("todoSearch");

// Todo listesini tutan dizi
let todos = [];

// Event dinleyicilerini başlat
runEvents();

// Event dinleyicilerini başlatan fonksiyon
function runEvents() {
    // Todo eklemek için form elemanına submit olayını ekle
    form.addEventListener("submit", addTodo);

    // Sayfa yüklendiğinde Storage'dan todoları al
    document.addEventListener("DOMContentLoaded", pageLoaded);

    // Todo silme işlemleri için click olaylarını ekle
    todoList.addEventListener("click", deleteTodo);
    clearButton.addEventListener("click", deleteTodoAll);

    // Filtreleme işlemi için keyup olayını ekle
    filterInput.addEventListener("keyup", filter);
}

// Filtreleme işlemini gerçekleştiren fonksiyon
function filter(e) {
    // Filtreleme için kullanıcıdan alınan değeri küçük harfe çevir ve boşlukları temizle
    const filterValue = e.target.value.trim().toLowerCase();
    
    // Todo listesindeki her bir elemanı kontrol et
    const todoListItem = document.querySelectorAll(".list-group-item");
    todoListItem.forEach(function (todo) {
        // Eğer filtre değeriyle eşleşiyorsa görünür yap, değilse gizle
        if (todo.textContent.toLowerCase().trim().includes(filterValue)) {
            todo.setAttribute("style", "display : block");
        } else {
            todo.setAttribute("style", "display : none !important");
        }
    });
}

// Tüm todoları silen fonksiyon
function deleteTodoAll() {
    // Todo listesindeki tüm elemanları seç
    const todoListItem = document.querySelectorAll(".list-group-item");
    if (todoListItem.length > 0) {
        // Arayüzden todoları sil
        todoListItem.forEach(function (todo) {
            todo.remove();
        });
        // Storage'dan todoları sil
        todos = [];
        localStorage.setItem("todos", JSON.stringify(todos));
    } else {
        // Silinecek bir şey yoksa kullanıcıya uyarı göster
        showAlert("danger", "Silinecek bir şey yok");
    }
}

// Bir todo'yu silen fonksiyon
function deleteTodo(e) {
    const item = e.target;
    // Eğer tıklanan element "fa-remove" sınıfına sahipse
    if (item.classList.contains("fa-remove")) {
        // Todo elemanını bul ve arayüzden sil (UI)
        const todo = item.parentElement.parentElement;
        todo.remove();
        // Storage'dan todo'yu sil
        deleteTodoToStorage(todo.textContent);
    }
    // Tıklanılan element bir bağlantı değilse sayfanın yeniden yüklenmesini önle
    e.preventDefault();
}

// Storage'dan bir todo'yu silen fonksiyon
function deleteTodoToStorage(newTodo) {
    // Storage'daki todoları kontrol et
    checkTodosFromStorage();
    // Todolar arasında dolaşarak silinecek todo'yu bul ve sil
    todos.forEach(function (todo, index) {
        if (newTodo == todo) {
            todos.splice(index, 1);
        }
    });
    // Güncellenmiş todoları tekrar Storage'a kaydet
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Sayfa yüklendiğinde çalışan fonksiyon
function pageLoaded() {
    // Storage'dan todoları kontrol et ve arayüze ekleyerek göster
    checkTodosFromStorage();
    todos.forEach(function (todo) {
        addTodoToUI(todo);
    });
}

// Todo ekleyen fonksiyon
function addTodo(e) {
    // Input'tan alınan değeri temizle ve küçük harfe çevir
    const inputText = addInput.value.trim().toLowerCase();
    // Eğer input boş ise kullanıcıya uyarı göster
    if (inputText == "") {
        showAlert("danger", "Lütfen bir görev girin");
    } else {
        // Arayüze yeni todo'yu ekle
        addTodoToUI(inputText);
        // Storage'a yeni todo'yu ekle
        addTodoStorage(inputText);
        // Kullanıcıya başarı mesajı göster
        showAlert("success", "Görev eklendi");
    }
    // Formun sayfa yeniden yüklenmesini önle
    e.preventDefault();
}

// Arayüze todo ekleyen fonksiyon
function addTodoToUI(newTodo) {
    // Yeni bir liste elemanı oluştur
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.textContent = newTodo;

    // Silme bağlantısı oluştur
    const a = document.createElement("a");
    a.href = "#";
    a.className = "delete-item";

    // Silme ikonu oluştur
    const i = document.createElement("i");
    i.className = "fa fa-remove";

    // İkonu bağlantıya ve bağlantıyı liste elemanına ekle
    a.appendChild(i);
    li.appendChild(a);

    // Liste elemanını todo listesine ekle
    todoList.appendChild(li);

    // Input'u temizle
    addInput.value = "";
}

// Storage'a todo ekleyen fonksiyon
function addTodoStorage(newTodo) {
    // Storage'daki todoları kontrol et
    checkTodosFromStorage();
    // Yeni todo'yu todolar dizisine ekle
    todos.push(newTodo);
    // Güncellenmiş todoları Storage'a kaydet
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Storage'dan todoları kontrol eden fonksiyon
function checkTodosFromStorage() {
    // Eğer Storage'da "
