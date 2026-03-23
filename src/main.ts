import './scss/styles.scss';
import { Catalog } from './components/base/models/Catalog';
import { Basket } from './components/base/models/Basket';
import { Buyer } from './components/base/models/Buyer';
import { apiProducts } from './utils/data';

const catalog = new Catalog ();
// const basket = new Basket();
// const buyer = new Buyer();

// Класс Catalog
console.log ('Catalog')

catalog.setProducts(apiProducts.items);
console.log('масиив товаров каталога: ', catalog.getProducts());

const firstProduct = catalog.getProducts()[0];
if (firstProduct) {
    console.log('Ищем товар по id: ', catalog.getProduct(firstProduct.id));

    catalog.setSelectedProduct(firstProduct);
    console.log('выбранный товар: ', catalog.getSelectedProduct());
}

// Классс Basket


// Класс Buyer
