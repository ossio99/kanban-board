import Board from "./board.js";
import Card from "./card.js";
import Kanban from "./kanban.js";

const kanban = new Kanban();

//cargamos los datos del json server
await kanban.loadBoards();

// const card01 = new Card('Tarea 1');
// const card02 = new Card('Tarea 2');
// const card03 = new Card('Tarea 3');
// const card04 = new Card('Tarea 4');
// const card05 = new Card('Tarea 5');
// const card06 = new Card('Tarea 6');

// const board01 = new Board('TODO', [card01, card02]);
// const board02 = new Board('IN PROGRESS', [card03, card04]);
// const board03 = new Board('DONE', [card05, card06]);

// kanban.add(board01);
// kanban.add(board02);
// kanban.add(board03);



const container = document.querySelector('#container');
const newBoardButton = document.querySelector('#new-board-button');
newBoardButton.addEventListener('click', addBoard);

renderUI();

//obtiene un arreglo del html de los boards donde cada board tiene un arreglo de todos sus cards y al final todo es insertado en container
function renderUI() {
    const boardsHTML = kanban.boards.map((board, boardIndex) => {

        const cardsHTML = board.items.map((card, cardIndex) => {
            return card.getHTML(board, boardIndex, cardIndex);
        });

        return board.getHTML(boardIndex, cardsHTML);

    });

    container.innerHTML = boardsHTML.join('');

    enableNewCard();

    enableDragAndDropEvents();

}

function addBoard(e) {
    const name = prompt('Nombre del board');
    if(name) {
        const board = new Board(name, []);
        kanban.add(board);
        renderUI();
    }
}

//metodo para crear una nueva card desde el inputTypeForm de cada board
function enableNewCard() {
    document.querySelectorAll('.form-new').forEach(form => {
        form.addEventListener('submit', e => {

            //evitamos que recargue
            e.preventDefault();

            const text = form.querySelector('.text').value;
            const card = new Card(text);

            //obtenemos el indexBoard del input hidden
            const indexBoard = form.querySelector('.index-board').value;
            kanban.addCard(card, indexBoard);
            renderUI();

        })
    })

    configureSubmenus();

}

//muestra el submenu de opciones y agrega sus correspondientes metodos a los botones
function configureSubmenus() {
    const moreButtons = document.querySelectorAll('.more-options');

    moreButtons.forEach(button => {
        button.addEventListener('click', showMoreOptions);
    })

    //botones de opciones
    const editBoardButton = document.querySelectorAll('.board-submenu-edit');
    const deleteBoardButton = document.querySelectorAll('.board-submenu-delete');
    const editCardButton = document.querySelectorAll('.card-submenu-edit');
    const deleteCardButton = document.querySelectorAll('.card-submenu-delete');

    editBoardButton.forEach(button => {
        button.addEventListener('click', editBoard);
    })

    deleteBoardButton.forEach(button => {
        button.addEventListener('click', deleteBoard);
    })

    editCardButton.forEach(button => {
        button.addEventListener('click', editCard);
    })

    deleteCardButton.forEach(button => {
        button.addEventListener('click', deleteCard);
    })

}

//e es el evento el cual tiene varias propiedades y metodos y una de sus propiedades es el target o el elemento que lo disparo
function showMoreOptions(e) {
    //recuperamos el submenu completo
    const submenu = e.target.nextElementSibling;
    submenu.classList.toggle('submenu-active');
}

//ocultar submenu al hacer click en cualquier parte de la pantalla
window.addEventListener('click', e => {
    //matches() es un metodo que devuelve true o false dependiendo si se cumple con el selector
    if (!e.target.matches('.more-options')) {
        const menus = Array.from(document.querySelectorAll('.submenu-active'));
        menus.forEach(menu => {
            if (menu.classList.contains('submenu-active')) {
                menu.classList.remove('submenu-active');
            }
        })
    }
});


//METODOS DE LOS BOTONES
function editBoard(e) {
    // console.log(e)
    const id = e.target.getAttribute('data-id');
    const index = e.target.getAttribute('data-index');
    const currentTitle = kanban.getBoard(index).title;
    const title = prompt('Nuevo titulo', currentTitle);
    if (title) {
        kanban.updateBoard(id, index, title);
        renderUI();
    }
}

function deleteBoard(e) {
    const index = e.target.getAttribute('data-index');
    kanban.removeBoard(index);
    renderUI();
}

function editCard(e) {
    const indexCard = e.target.getAttribute('data-index');
    const indexBoard = e.target.getAttribute('data-board-index');

    const currentTitle = kanban.getBoard(indexBoard).get(indexCard).title;

    const title = prompt('Nuevo titulo', currentTitle);
    if (title){
        kanban.updateCard(indexBoard, indexCard, title);
        renderUI();
    }
}

function deleteCard(e) {
    const indexCard = e.target.getAttribute('data-index');
    const indexBoard = e.target.getAttribute('data-board-index');
    kanban.removeCard(indexBoard, indexCard);
    renderUI();
}

//DRAG & DROP

let dropOk = false;

const classes = {
    hide: 'hide',
    placeholder: 'placeholder',
    active: 'placeholder-active'
}

function enableDragAndDropEvents(){
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('dragstart', dragstart);
        card.addEventListener('dragend', dragend);
    })

    const boards = document.querySelectorAll('.board');

    boards.forEach(board => {
        board.addEventListener('dragenter', dragenter);
        board.addEventListener('dragover', dragover);
        board.addEventListener('dragleave', dragleave);
        board.addEventListener('drop', drop);
    })

}

//EVENTOS CARDS
//este evento lo dispara el elemento arrastrado
function dragstart(e){
    //obtenemos estos valores para pasar cuando hagamos el drop
    const boardId = e.target.getAttribute('data-boardid');
    const cardId = e.target.id;

    //metodo del evento drag and drop para transferir informacion
    e.dataTransfer.setData('text/plain', JSON.stringify({boardId, cardId}));
    e.target.classList.add(classes.hide);

}

function dragend(e){
    e.target.classList.remove(classes.hide);
}


//EVENTOS BOARDS
function dragenter(e){
    e.preventDefault();
    const item = e.target;
    dropOk = true;

    //porque detecta a item como el div class placeholder si item es el board???? 
    if(item.classList.contains(classes.placeholder)){
        item.classList.add(classes.active);
    }
}

function dragover(e){
    e.preventDefault();
    const item = e.target;

    //metodo mrr
    //porque vuelve a añadir active a los elementos con la clase place holder si ya se les añadio en dragenter???
    // if(item.classList.contains(classes.placeholder) || item.classList.contains('board')){
    //     item.classList.add(classes.active);
    // }

    if(item.classList.contains('board')){
        item.classList.add(classes.active);
        //si estamos encima de una tarjeta ilumine su placeholder
    }else if(item.getAttribute('data-id') != undefined){
        //en id estamos cuardando el valor de data-id el cual es el id, no estamos haciendo referencia al atributo dada-id
        const id = item.getAttribute('data-id');
        //esto funciona ya que aqui estamos haciendo referencia al id mas no a la propiedad data-id, entonces estamos haciendo referencia al card completo
        document.querySelector(`#${id}`).querySelector('.placeholder').classList.add(classes.active);
    }
}

function dragleave(e){
    // const item = e.target;
    // if(item.classList.contains(classes.active)){
    //     item.classList.remove(classes.active);
    // }

    document.querySelectorAll(`.${classes.active}`).forEach(element => element.classList.remove(classes.active));
}

function drop(e){
    e.preventDefault();
    let target, id;

    //si no existe data-id se esta agregando sobre el tablero, si si entonces sobre la tarjeta
    if(e.target.getAttribute('data-id') == undefined){
        target = e.target;
    }else{
        id = e.target.getAttribute('data-id');
        target = document.querySelector(`#${id}`);
    }

    //validamos dropOk
    //dropOk es true cuando dragEnter
    if(!dropOk) return false;

    //recuperamos la data transferida por el card arrastrado
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    //guardamos el id del card arrastrado
    const draggable = document.querySelector(`#${data.cardId}`);

    //valores del destino
    let targetBoardId, targetCardId;

    //si el elemento que dispara el drop tiene la clase card entonces estamos agregando sobre el card
    if(target.classList.contains('card')){
        //para obtener el targetBoardId usamos navegacion por dom para subir hasta el board ya que es elemento padre del card que disparo el evento
        targetBoardId = target.parentElement.parentElement.id;
        targetCardId = target.id;

        //insertamos el card
        target.insertAdjacentElement('afterend', draggable);

        //si no estamos insertando en el board
    }else if(target.classList.contains('board')){
        targetBoardId = target.id;
        targetCardId = undefined;
        target.querySelector('.items').appendChild(draggable);
    }

    //ACTUALIZACION DE LOS DATOS

    //validacion para ver si soltamos la card en un elemento no valido
    if(!targetCardId && !targetBoardId) return false;

    //esto devolvera un arreglo de 2 elementos por eso accedemos al 1 ya que es el id
    targetBoardId = targetBoardId.split('--')[1];
    //-1 significa que no hay card en el lugar en donde queremos poner la tarjeta que estamos arrastrando
    targetCardId = targetCardId?.split('--')[1] ?? -1;
    data.cardId = data.cardId.split('--')[1];
    data.boardId = data.boardId.split('--')[1];

    const indexBoardSrc = kanban.getIndex(data.boardId);
    const indexBoardTarget = kanban.getIndex(targetBoardId);
    //primero obtenemos el src board y despues obtenemos el indice el index del src card
    const indexCardSrc = kanban.getBoard(indexBoardSrc).getIndex(data.cardId);
    const indexCardTarget = targetCardId === -1 ? kanban.getBoard(indexBoardTarget).length : kanban.getBoard(indexBoardTarget).getIndex(targetCardId);

    kanban.moveCard(indexBoardSrc, indexCardSrc, indexBoardTarget, indexCardTarget);
    //le removemos la clase hide que se le agrego en el dragstart
    draggable.classList.remove(classes.hide);
    renderUI();

}