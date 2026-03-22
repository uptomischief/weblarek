import { IBuyer, TPayment, ValidationErrors } from "../../../types";

export class Buyer {
    // Поля класса:
    private _payment: TPayment | null = null;
    private _address: string = '';
    private _email: string = '';
    private _phone: string = '';

    // Методы класса:
    setPayment(payment: TPayment): void {
        this._payment = payment
    }

    setAddress(address: string): void {
        this._address = address
    }

    setPhone(phone:string): void {
        this._phone = phone
    }

    setEmail(email:string): void {
        this._email = email;
    }

    getData(): IBuyer {
        if(!this._payment) {
            throw new Error ('Вы не выбрали способ оплаты');
        }
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
            errors.payment = 'Вы не выбрали способ оплаты';
        }
        if (!this._address) {
            errors.address = 'Вы не выбрали адресс доставки';
        }
        if (!this._email) {
            errors.email = 'Вы не вписали почту';
        }
        if (!this._phone) {
            errors.phone = 'Вы не вписали номер телефона';
        }
        return errors;
    }
}