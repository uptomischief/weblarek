import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Header extends Component<null> {
    protected _counter: HTMLElement;
    protected _basket: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._counter = container.querySelector('.header__basket-counter') as HTMLElement;
        this._basket = container.querySelector('.header__basket') as HTMLButtonElement;

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this._counter.textContent = String(value);
    }
}