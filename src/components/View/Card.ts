import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface ICard {
    // id: string;
    title: string;
    // category: string;
    // description: string;
    // image: string;
    price: number | null;
    // price: string;
    // buttonText?: string;
    // index?: number;
}

export class Card<T = ICard> extends Component<T & ICard> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    // protected _image?: HTMLImageElement | null;
    // protected _category?: HTMLElement | null;
    // protected _description?: HTMLElement | null;
    // protected _button?: HTMLButtonElement | null;
    // protected _index?: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        // this._image = container.querySelector('.card__image');
        // this._category = container.querySelector('.card__category');
        // this._description = container.querySelector('.card__text');
        // this._button = container.querySelector('.card__button');
        // this._index = container.querySelector('.basket__item-index');

        // if (actions?.onClick) {
        //     if (this._button) {
        //         this._button.addEventListener('click', actions.onClick);
        //     } else {
        //         container.addEventListener('click', actions.onClick);
        //     }
        // }
    }

    // set id(value: string) {
    //     this.container.dataset.id = value;
    // }

    // get id(): string {
    //     return this.container.dataset.id || '';
    // }

    set title(value: string) {
        this._title.textContent = String(value);
    }

    // get title(): string {
    //     return this._title.textContent || '';
    // }

    set price(value: number | null) {
            this._price.textContent = value === null? 'Бесценно' : String(value) + ' синапсов';
    }

    // set image(value: string) {
    //     if (this._image) {
    //         this.setImage(this._image, value, this.title);
    //     }
    // }

    // set category(value: string) {
    //     if (this._category) {
    //         this._category.textContent = String(value);
    //         this._category.className = 'card__category';
    //         const modifier = categoryMap[value as keyof typeof categoryMap];
    //         if (modifier) {
    //             this._category.classList.add(modifier);
    //         }
    //     }
    // }

    // set description(value: string) {
    //     if (this._description) {
    //         this._description.textContent = String(value);
    //     }
    // }

    // set buttonText(value: string) {
    //     if (this._button) {
    //         this._button.textContent = String(value);
    //     }
    // }

    // set index(value: number) {
    //     if (this._index) {
    //         this._index.textContent = String(value);
    //     }
    // }
}

// export class CardCatalog extends Card {
//     constructor(container: HTMLElement, actions?: ICardActions) {
//         super(container, actions);
//     }
// }

// export class CardPreview extends Card {
//     constructor(container: HTMLElement, actions?: ICardActions) {
//         super(container, actions);
//     }
// }

// export class CardBasket extends Card {
//     constructor(container: HTMLElement, actions?: ICardActions) {
//         super(container, actions);
//     }
// }