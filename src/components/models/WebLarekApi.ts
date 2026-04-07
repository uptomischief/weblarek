import { IApi, IProductList, IOrder, IOrderResalt } from "../../types";

export class WebLarekApi {
    // Поля класса:
    private _api: IApi;

    // Конструктор: 
    constructor(api: IApi) {
        this._api = api;
    }

    // Методы класса:
    getProducts(): Promise<IProductList> {
        return this._api.get<IProductList>('/product/')
    }

    createOrder(order: IOrder): Promise<IOrderResalt> {
        return this._api.post<IOrderResalt>('/order/', order)
    }
}