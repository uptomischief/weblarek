import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IHeader {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Header extends Component<IHeader> {
    protected _counter: HTMLElement;
    protected _basket: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter: ensureElement<HTMLElement>('.header__basket-counter', container);
        this._basket: ensureElement<HTMLElement>('.header__basket', container);
        this._catalog: ensureElement<HTMLElement>('.gallery', container);
        this._wrapper: ensureElement<HTMLElement>('.page__wrapper', container);

        this._basket.addEventListener('click', () => {
            events.emit('basket: open');
        })
    }

    set counter(value: number) {
        this._counter.textContent = String(value)
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}