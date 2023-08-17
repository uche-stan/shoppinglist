
const form = document.querySelector('form');
const textInput = document.getElementById('input-item');
const ul = document.querySelector('#item-list');
const error = document.querySelector('.error');
const clearBtn = document.getElementById('clear');
const filter = document.querySelector('#filter');
const formBtn = form.querySelector('.add-btn ');
const icon = document.querySelector('ul button')
let isEditMode = false;



function displayItems(){

    const itemsFromStorage = getItemsFromStorage()
    itemsFromStorage.forEach(item => addItemToDom(item));
    checkUi()
}

const onAddItemSubmit = e => {
    e.preventDefault();

    const newItem = textInput.value

    if (newItem === '') {
        error.textContent = 'Please enter a value';
        error.style.color = 'red';
        textInput.classList.add('input-error');
        return;
    } else {
        error.textContent = '';
        textInput.classList.remove('input-error');

    }
    // Check for edit mode
    if (isEditMode) {
        const itemToEdit = ul.querySelector('.edit-mode')
       removeItemFromStorage(itemToEdit.textContent)
       itemToEdit.classList.remove('edit-mode')
       itemToEdit.remove()
       isEditMode = false
    }else{
        if(checkIfItemExists(newItem)){
            error.textContent = 'Item already exists';
            error.style.color ='red';
            return;
        }
    }

    // Add item to dom element
    addItemToDom(newItem);

    // create local storage
    addItemToStorage(newItem);

    textInput.value = '';
    checkUi()
}

function addItemToDom(item) {
    const button = createButton('remove-btn text-red')

    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    li.appendChild(button)
    ul.appendChild(li)
}


function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage()

    // add new item to array
    itemsFromStorage.push(item);

    // stringify and set to local staorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))

}

function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = []
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }
   
    return itemsFromStorage

}

const createButton = classes => {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa fa-xmark')
    button.appendChild(icon);
    return button;
}

const createIcon = classes => {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function onClickItem(e){
    if (e.target.parentElement.classList.contains('remove-btn')) {
        removeItem(e.target.parentElement.parentElement)
    }else{
        setItemToEdit(e.target)

    }
}

// Prevent duplicate
function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage()
    return itemsFromStorage.includes(item)
}

function setItemToEdit(item) {
    isEditMode = true;
    
    ul.querySelectorAll('li').forEach(item =>item.classList.remove('edit-mode'))

   item.classList.add('edit-mode');
   formBtn.classList.add('form-btn')
   formBtn.innerHTML = '<i class="fa fa-pen"></i> Update Item'
   textInput.value = item.textContent

   
}


function removeItem(item) {
    if (
      confirm(`Are you sure you want to remove the item "${item.textContent}"?`)
    ) {
      // Remove item from DOM
      item.remove();
  
      // Remove item from storage
      removeItemFromStorage(item.textContent);
  
      
    }
    checkUi();
  }

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage()
// Filter out items to be removed
itemsFromStorage = itemsFromStorage.filter((i) => i !== item)   

// Reset to local storage
localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}


function clearItems() {

    if (window.confirm('Are you sure you want to clear all items?')) {
        while (ul.firstChild) { ul.removeChild(ul.firstChild); }
    }

    localStorage.removeItem('items')

    checkUi()

}

function filterItems(e) {

    const text = e.target.value.toLowerCase();
    const li = document.querySelectorAll('li')

    li.forEach(item => {

        const itemName = item.textContent.toLocaleLowerCase();
        if (itemName.includes(text)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    })

}





function checkUi() {
    const li = document.querySelectorAll('li')
    if (li.length === 0) {
        filter.style.display = 'none';
        clearBtn.style.display = 'none';

    } else {

        filter.style.display = 'block';
        clearBtn.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa fa-plus"></i> Add Item';
    formBtn.classList.remove('form-btn')

    isEditMode = false;
}


// Initailize App

function init() {
    form.addEventListener('submit', onAddItemSubmit);
    ul.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    filter.addEventListener('input', filterItems)
    document.addEventListener('DOMContentLoaded', displayItems)
    checkUi()

}


init()

