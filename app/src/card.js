import { generateId } from "./ids.js";

export default class Card {
    id;
    title;

    constructor(title) {
        this.title = title;
        this.id = generateId();
    }

    //parametros pa que???
    getHTML(board, boardIndex, index) {
        //id se ocupa para obtener el card en dragover
        const id = `card--${this.id}`;
        //se marcan todos los componentes con dataid todos los elementos en los que el cursor puede identificar y puede obtener el dato de id de la tarjeta al hacer drag and drop
        const dataid = `data-id="${id}"`;
        return `<div class="card" id="${id}" data-boardid="board--${board.id}" draggable="true">
                    <div class="card-wrapper" ${dataid}>
                        <div class="title" ${dataid}>${this.title}</div>
                        <div class="options" ${dataid}>
                            <button class="more-options" ${dataid}>...</button>
                            <div class="submenu">
                                <ul>
                                    <li><a href="#" class="card-submenu-edit" ${dataid} data-index="${index}" data-board-index="${boardIndex}">Editar</a></li>
                                    <li><a href="#" class="card-submenu-delete" ${dataid} data-index="${index}" data-board-index="${boardIndex}">Eliminar</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="placeholder" data-id="${id}" id="${generateId()}"></div>
                </div>`;
    }

}