import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export abstract class Card<T> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _id: string = '';

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._title = container.querySelector('.card__title') as HTMLElement;
        this._price = container.querySelector('.card__price') as HTMLElement;
    }

    set id(value: string) {
        this.id = value;
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.id;
    }
    
    // Доработать и readme
}