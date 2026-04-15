import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
    // Поля класса:
    private _items: IProduct[] = []

    constructor (protected events: IEvents) {}

    // Методы класса:
    getItems(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct): void {
        if (!this.contains(item.id)) {
            this._items.push(item);
            this.events.emit('basket:changed', this._items);
        }
    }

    removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this.events.emit('basket:changed', this._items);
    }

    clear(): void {
        this._items = [];
        this.events.emit('basket:changed', this._items);
    }

    getTotal(): number {
        return this._items.reduce((sum, item) => sum + (item.price || 0), 0)
    }

    getCount(): number {
        return this._items.length;
    }

    contains(id: string): boolean {
        return this._items.some (item => item.id === id)
    }
}