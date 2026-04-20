import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { IOrder } from "../../types"; 
import { TPayment } from "../../types";
import { ensureAllElements } from "../../utils/utils";

export class OrderForm extends Form<IOrder> {
    protected _buttons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        // this._buttons = Array.from(container.querySelectorAll('.button_alt'));
        this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('order.payment:change', { target: button.name });
            });
        });
    }

    set payment(value: TPayment) {
        this._buttons.forEach(button => {
                button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}