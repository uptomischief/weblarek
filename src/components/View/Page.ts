import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IPage {
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._catalog = container.querySelector('.gallery') as HTMLElement;
        this._wrapper = container.querySelector('.page__wrapper') as HTMLElement;
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