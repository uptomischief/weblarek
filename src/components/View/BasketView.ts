import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    valid: boolean;
}

export class BasketView extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._list = container.querySelector('.basket__list') as HTMLElement;
        this._total = container.querySelector('.basket__price') as HTMLElement;
        this._button = container.querySelector('.basket__button') as HTMLButtonElement;

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this.valid = true;
        } else {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Корзина пуста';
            this._list.replaceChildren(emptyMessage);
            this.valid = false;
        }
    }

    set total(value: number) {
        this._total.textContent = String(value) + ' синапсов';
    }

    set valid(value: boolean) {
        if (this._button) {
            this._button.disabled = !value;
        }
    }
}