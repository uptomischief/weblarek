import { IBuyer, TPayment, ValidationErrors } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
    // Поля класса:
    private _payment: TPayment | null = null;
    private _address: string = '';
    private _email: string = '';
    private _phone: string = '';

    constructor (protected events: IEvents) {}

    // Методы класса:
    setPayment(payment: TPayment): void {
        this._payment = payment;
    }

    setAddress(address: string): void {
        this._address = address;
    }

    setPhone(phone:string): void {
        this._phone = phone;
    }

    setEmail(email:string): void {
        this._email = email;
    }

    getData(): IBuyer {
        return {
            payment: this._payment,
            address: this._address,
            email: this._email,
            phone: this._phone
        }
    }

    clear(): void {
            this._payment = null,
            this._address = '',
            this._email = '',
            this._phone = ''
    }

    validate(): ValidationErrors {
        const errors: ValidationErrors = {};
        if (!this._payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        if (!this._address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this._email) {
            errors.email = 'Необходимо указать почту';
        }
        if (!this._phone) {
            errors.phone = 'Необходимо указать номер телефона';
        }
        return errors;
    }

    changes(): void {
        this.events.emit('buyer:change');
    }
}