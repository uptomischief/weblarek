import './scss/styles.scss';
import { Catalog } from './components/models/Catalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { WebLarekApi } from './components/models/WebLarekApi';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, TPayment } from './types';
import { ValidationErrors } from './types';

import { BasketView } from './components/View/BasketView';
import { CardCatalog, CardPreview, CardBasket } from './components/View/Card';
import { ContactsForm } from './components/View/ContactsForm';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { OrderForm } from './components/View/OrderForm';
import { Page } from './components/View/Page';
import { Success } from './components/View/Success';

const events = new EventEmitter();
const catalog = new Catalog (events);
const basket = new Basket(events);
const buyer = new Buyer(events);
const api = new Api(API_URL);
const weblarekapi = new WebLarekApi(api);
const page = new Page(document.body, events);
const header = new Header(ensureElement('.header'), events);
const modal = new Modal(ensureElement('#modal-container'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const constantsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(constantsTemplate), events);

let currentForm: OrderForm | ContactsForm | null = null;

function renderBasket() {
    const items = basket.getItems();

    const cards = items.map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('card:remove', item)
        });
        return card.render({
            id: item.id,
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });

    modal.render({
        content: basketView.render({
            items: cards, 
            total: basket.getTotal(),
            valid: items.length > 0
        })
    });
}

events.on('item:changed', () => {
	const products = catalog.getProducts();
	const cards = products.map((product) => {
		const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', product),
		});
		return card.render({
			id: product.id,
			title: product.title,
			image: CDN_URL + product.image,
			category: product.category,
			price: product.price,
		});
	});
	page.catalog = cards;
});

events.on('card:select', (product: IProduct) => {
    catalog.setSelectedProduct(product);
});

events.on('preview:changed', (product: IProduct) => {
	const inBasket = basket.contains(product.id);

	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (inBasket) {
				events.emit('card:remove', product);
			} else {
				events.emit('card:add', product);
			}
			modal.close();
		},
	});

	modal.render({
        content: card.render ({
            id: product.id,
		    title: product.title,
		    image: CDN_URL + product.image,
		    category: product.category,
		    description: product.description,
		    price: product.price,
		    buttonText:
			    product.price === null
				    ? 'Недоступно'
				    : inBasket
					    ? 'Удалить из корзины'
					    : 'Купить',
        })
	});
});

events.on('card:add', (product: IProduct) => {
    basket.addItem(product);
});

events.on('card:remove', (product: IProduct) => {
    basket.removeItem(product.id);
});

events.on('basket:changed', () => {
    header.counter = basket.getCount();

    const modalElement = modal.render({ content: {} as HTMLElement });

    if (
        modalElement.classList.contains('modal_active') &&
        modalElement.querySelector('.basket')
    ) {
        renderBasket();
    }
});

events.on('basket:open', () => {
    renderBasket();
});

events.on('order:open', () => {
	const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
	currentForm = orderForm;

    let formElement: HTMLElement;

	try {
		const data = buyer.getData();
		formElement = orderForm.render({
			payment: data.payment,
			address: data.address,
			valid: false,
			errors: [],
		});
	} catch {
		formElement = orderForm.render({
			valid: false,
			errors: [],
		});
	}

	modal.render({ content: formElement});
});

events.on('order.payment:change', (data: {target: string}) => {
    buyer.setPayment(data.target as TPayment);
});

events.on('order.address:change', (data: {field: string; value: string}) => {
    buyer.setAddress(data.value);
});

events.on('order:submit', () => {
    currentForm = contactsForm;
    let formElement: HTMLElement;

    try {
        const data = buyer.getData();
        formElement = contactsForm.render({
            email: data.email,
            phone: data.phone,
            valid: false,
            errors: []
        });
    } catch {
        formElement = contactsForm.render({
            valid: false,
            errors: []
        });
    }

    modal.render({content: formElement});
});

events.on('contacts.email:change', (data: {field: string; value: string}) => {
    buyer.setEmail(data.value);
});

events.on('contacts.phone:change', (data: {field: string; value: string}) => {
    buyer.setPhone(data.value);
});

const success = new Success(cloneTemplate(successTemplate), {
    onClick: () => modal.close()
});

events.on('contacts:submit', () => {
    try {
        const buyerData = buyer.getData();
        const order = {
            ...buyerData,
            items: basket.getItems().map((item) => item.id),
            total: basket.getTotal()
        };

        weblarekapi.createOrder(order)
            .then((result) => {
                modal.render({
                    content: success.render({
                        total: result.total
                    })
                });

                basket.clear();
                buyer.clear();
                currentForm = null;
            })
            .catch((error) => {
                console.error('Ошибка при оформлении:', error);
            });
        } catch (error) {
            console.error('Ошибка при подготовки заказа:', error)
        }
});

events.on('formErrors:change', (errors: ValidationErrors) => {
    if(!currentForm) return;

    const errorMessages: string[] = [];

    if(currentForm instanceof OrderForm) {
        if (errors.payment) errorMessages.push(errors.payment);
        if(errors.address) errorMessages.push(errors.address);
    }

    if(currentForm instanceof ContactsForm) {
        if (errors.email) errorMessages.push(errors.email);
        if(errors.phone) errorMessages.push(errors.phone);
    }
    
    const isValid = errorMessages.length === 0;

    currentForm.render({
        valid: isValid,
        errors: errorMessages
    });
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
    currentForm = null;
})

// // Класс Catalog
// console.log ('Catalog');

// catalog.setProducts(apiProducts.items);
// console.log('масиив товаров каталога: ', catalog.getProducts());

// const firstProduct = catalog.getProducts()[0];
// if (firstProduct) {
//     console.log('Ищем товар по id: ', catalog.getProduct(firstProduct.id));

//     catalog.setSelectedProduct(firstProduct);
//     console.log('выбранный товар: ', catalog.getSelectedProduct());
// }

// // Классс Basket
// console.log ('Basket');

// console.log('У нас в корзине сейчас товаров...: ', basket.getCount());
// console.log('Товары в корзине сейчас стоят: ', basket.getTotal());

// const product1 = catalog.getProducts()[0];
// const product2 = catalog.getProducts()[1];

// if (product1) {
//     basket.addItem(product1);
//     console.log('Добавили товар 1 -> количесвто: ', basket.getCount(), 'со стоимостью: ', basket.getTotal());
// }

// if (product2) {
//     basket.addItem(product2);
//     console.log('Добавили товар 2 -> количесвто: ', basket.getCount(), 'со стоимостью: ', basket.getTotal());
// }

// console.log('товаров в корзине: ', basket.getItems());

// if(product1) {
//     basket.removeItem(product1.id);
//     console.log('товар 1 удалили -> количесвто: ', basket.getCount(), 'со стоимостью: ', basket.getTotal());
// }

// basket.clear();
// console.log('очистили корзину -> количесвто: ', basket.getCount(), 'со стоимостью: ', basket.getTotal());

// // Класс Buyer
// console.log ('Buyer');

// console.log('пустота = ошибочки: ', buyer.validate())

// buyer.setPayment('card');
// buyer.setAddress('Москва-Петушки, Ерофеев, 1');
// buyer.setPhone('+375291111111');
// buyer.setEmail('mail@mail.com');

// console.log('заполненый: ', buyer.validate());

// console.log('Данные: ', buyer.getData());

// buyer.clear();
// console.log('Очистка = ошибочки: ', buyer.validate())

// Класс WebLarekApi
console.log('Api')

weblarekapi.getProducts()
    .then((data) => {
        catalog.setProducts(data.items);
        console.log('Каталог получен с сервера: ', catalog.getProducts());
    })
    .catch((error) => {
        console.error ('Ошибка получения данных с сервера: ', error);
    });
