import './scss/styles.scss';
import { Catalog } from './components/base/models/Catalog';
import { Basket } from './components/base/models/Basket';
import { Buyer } from './components/base/models/Buyer';
import { apiProducts } from './utils/data';

const catalog = new Catalog ();
const basket = new Basket();
const buyer = new Buyer();

// Класс Catalog
console.log ('Catalog');

catalog.setProducts(apiProducts.items);
console.log('масиив товаров каталога: ', catalog.getProducts());

const firstProduct = catalog.getProducts()[0];
if (firstProduct) {
    console.log('Ищем товар по id: ', catalog.getProduct(firstProduct.id));

    catalog.setSelectedProduct(firstProduct);
    console.log('выбранный товар: ', catalog.getSelectedProduct());
}

// Классс Basket
console.log ('Basket');

console.log('У нас в корзине сейчас товаров...: ', basket.getCount());
console.log('Товары в корзине сейчас стоят: ', basket.getTotal());

const product1 = catalog.getProducts()[0];
const product2 = catalog.getProducts()[1];

if (product1) {
    basket.addItem(product1);
    console.log('Добавили товар 1 -> количесвто: ', basket.getCount(), 'со стоимостью: ', basket.getTotal());
}

if (product2) {
    basket.addItem(product2);
    console.log('Добавили товар 2 -> количесвто: ', basket.getCount(), 'со стоимостью: ', basket.getTotal());
}

console.log('товаров в корзине: ', basket.getItems());

if(product1) {
    basket.removeItem(product1.id);
    console.log('товар 1 удалили -> количесвто: ', basket.getCount(), 'со стоимостью: ', basket.getTotal());
}

basket.clear();
console.log('очистили корзину -> количесвто: ', basket.getCount(), 'со стоимостью: ', basket.getTotal());

// Класс Buyer
console.log ('Buyer');

console.log('пустота = ошибочки: ', buyer.validate())

buyer.setPayment('card');
buyer.setAddress('Москва-Петушки, Ерофеев, 1');
buyer.setPhone('+375291111111');
buyer.setEmail('mail@mail.com');

console.log('заполненый: ', buyer.validate());

console.log('Данные: ', buyer.getData());

buyer.clear();
console.log('Очистка = ошибочки: ', buyer.validate())
