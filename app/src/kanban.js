import {get, post} from './http.js';
import Card from './card.js';
import Board from './board.js';

export default class Kanban {
    boards;
    url;

    constructor() {
        this.boards = [];
        this.url = 'http://localhost:3000';
    }

    //crear nuevo board
    add(board) {
        this.boards.push(board);

        post(`${this.url}/new-board`, 'json', {
            id: board.id,
            title: board.title
        })
        .then(response => {
            console.log(response)
        })

    }

    //crear nueva card
    addCard(card, indexBoard) {
        this.getBoard(indexBoard).add(card);

        post(`${this.url}/update-all`, 'json', {
            //con this hacemos referencia el metodo propio de la clase toJSON()
            boards: this.toJSON()
        })
        .then(response => {
            console.log(response);
        });

    }

    //devuelve el board con el indice proporcionado, se usa en app.js para poder usar moveCard() y en updateBoard()
    getBoard(index) {
        return this.boards[index];
    }

    //devuelve el index del board encontrado por id, se usa en app.js para poder usar moveCard()
    getIndex(id) {
        return this.boards.findIndex(board => board.id == id);
    }

    //eliminar card
    removeCard(indexBoard, indexCard) {
        //a splice le pasamos el indice a eliminar del arreglo items y la cantidad de elementos a eliminar
        //splice regresa un arreglo de elementos eliminados, entonces recuperamos el elemento 0 o el unico elemento eliminado
        const card = this.getBoard(indexBoard).items.splice(indexCard, 1)[0];
        //devolvemos el card eliminado para poder moverlo despues
        get(`${this.url}/delete-card/${indexBoard}/${indexCard}`)
        .then(response => {
            console.log(response);
        })

        return card;

    }

    //al parecer este metodo solo se usa en moveCard()
    insertCard(card, indexBoard, indexCard) {
        //+1 porque la card se agregara en la siguiente posicion, 0 porque se eliminaran 0 elementos y card es el elemento a agregar
        this.getBoard(indexBoard).items.splice(indexCard + 1, 0, card);
    }

    moveCard(indexBoardSrc, indexCardSrc, indexBoardTarget, indexCardTarget) {
        //guardamos el card eliminado
        const srcCard = this.removeCard(indexBoardSrc, indexCardSrc);
        this.insertCard(srcCard, indexBoardTarget, indexCardTarget);

        post(`${this.url}/update-all`, 'json', {
            //con this hacemos referencia el metodo propio de la clase toJSON()
            boards: this.toJSON()
        })
        .then(response => {
            console.log(response);
        });

    }

    //entonces el id se ocupa en el metodo post para actualizar la bd
    updateBoard(id, index, title) {
        this.getBoard(index).title = title;

        post(`${this.url}/update-board`, 'json', {
            id: id,
            title: title
        })
        .then(response => {
            console.log(response);
        })

    }

    removeBoard(index) {
        const id = this.boards[index].id;
        this.boards.splice(index, 1);

        get(`${this.url}/delete-board/${id}`)
        .then(response => {
            console.log(response)
        })

    }

    updateCard(indexBoard, indexCard, title) {
        const card = this.boards[indexBoard].items[indexCard];
        card.title = title;

        post(`${this.url}/update-card`, 'json', {
            id: card.id,
            title: title,
            indexBoard: indexBoard
        })
        .then(response => {
            console.log(response);
        })

    }

    async loadBoards() {
        try{
            const data = await get(this.url);

            this.boards = data.boards.map(board => {

                const cards = board.cards.map(card => {
                    const newCard = new Card(card.title);
                    //le asignamos el id  original del card
                    newCard.id = card.id;
                    return newCard;
                });

                const newBoard = new Board(board.title, cards);
                //asignamos el id original del board
                newBoard.id = board.id;
                return newBoard;
            })
        }catch(ex){

        }
    }

    //este metodo me devuelve una variable con un arreglo de los boards cuyo cada board tiene su arreglo de sus cards, todo esto en formato tipo json para su posterior transformacion
    toJSON(){
        const json = this.boards.map(board => {

            const cards = board.items.map(card => {
                return {
                    id: card.id,
                    title: card.title
                };
            });

            return {
                id: board.id,
                title: board.title,
                cards: cards
            };

        });
        return json;
    }

}