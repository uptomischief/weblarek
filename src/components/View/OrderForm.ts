import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { IOrder } from "../../types"; 
import { TPayment } from "../../types";

export class OrderForm extends Form<IOrder> {
    protected _buttons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._buttons = Array.from(container.querySelectorAll('.button_alt'));

        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name as TPayment; 
                this.events.emit('order.payment:change', { target: button.name });
            });
        });
    }

    set payment(value: TPayment) {
        this._buttons.forEach(button => {
            if (button.name === value) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}