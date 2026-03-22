import { IProduct } from "../../../types";

export class Basket {
    // Поля класса:
    private _items: IProduct[] = []

    // Методы класса:
    getItems(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct): void {
        if (!this.contains(item.id)) {
            this._items.push(item);
        }
    }

    removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
    }

    clear(): void {
        this._items = [];
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