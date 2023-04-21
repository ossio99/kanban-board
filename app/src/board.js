import { generateId } from "./ids.js";

export default class Board{
    id;
    title;
    items;

    constructor(title, items){
        this.id = generateId();
        this.title = title;
        this.items = [...items];
    }

    getIndex(id){
        return this.items.findIndex(item => item.id == id);
    }

    //devuelve la card en el index proporcionado
    get(index){
        return this.items[index];
    }

    add(card){
        this.items.push(card);
    }

    get length(){
        return this.items.length;
    }

    //se le pasa el id y el board a los botones porque getBoard y updateBoard los ocupara para actualizar el titulo del board
    //el input hidden del final es solo para guardar el boardIndex ya que se ocupa al crear una nueva card desde el form
    getHTML(boardIndex, cards){
        return`<div class="board" id="board--${this.id}">
                    <div class="header">
                        <div class="title">
                            ${this.title}
                        </div>
                        <div class="options">
                            <button class="more-options">...</button>
                            <div class="submenu">
                                <ul>
                                    <li><a href="#" class="board-submenu-edit" data-id="${this.id}" data-index="${boardIndex}">Editar</a></li>
                                    <li><a href="#" class="board-submenu-delete" data-id="${this.id}" data-index="${boardIndex}">Eliminar</a></li>
                                </ul>
                            </div>
                        </div>
                
                    </div>
                
                    <div class="items">
                        ${cards.join('')}
                    </div>
                
                    <div class="new-item">
                        <form action="#" class="form-new">
                            <input type="text" placeholder="+ Añade otra tarjeta" id="" class="new-input text">
                            <input type="hidden" class="index-board" value="${boardIndex}">
                        </form>
                    </div>
                
                </div>`;
    }

}