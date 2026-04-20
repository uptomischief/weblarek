import './scss/styles.scss';
import { Catalog } from './components/models/Catalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { WebLarekApi } from './components/models/WebLarekApi';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, TPayment } from './types';
import { ValidationErrors } from './types';

import { BasketView } from './components/View/BasketView';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { CardBasket } from './components/View/CardBasket';
import { ContactsForm } from './components/View/ContactsForm';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { OrderForm } from './components/View/OrderForm';
// import { Page } from './components/View/Page';
import { Success } from './components/View/Success';

const events = new EventEmitter();
const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);
const api = new Api(API_URL);
const weblarekapi = new WebLarekApi(api);
// const page = new Page(document.body, events);
const header = new Header(ensureElement('.header'), events);
const modal = new Modal(ensureElement('#modal-container'));
const gallery = ensureElement<HTMLElement>('.gallery')

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basketView = new BasketView(cloneTemplate(basketTemplate), events);
basketView.render({ items: [], total: 0, valid: false });
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('preview:buttonClick')
})

// function Price(price: number | null): string {
//     return price === null ? 'Бесценно' : `${price} синапсов`;
// }

// function Image(src: string, alt: string): {src: string; alt: string} {
//     return {
//         src: CDN_URL + src,
//         alt
//     };
// }

function renderBasket() {
    const items = basket.getItems();

    const cards = items.map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('card:remove', item)
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });

    // modal.render({
    //     content: basketView.render({
    //         items: cards, 
    //         total: basket.getTotal(),
    //         valid: items.length > 0
    //     })
    // });

    basketView.render({
        items: cards,
        total: basket.getTotal(),
        valid: items.length > 0
    });
}

events.on('item:changed', () => {
    const products = catalog.getProducts();
    const cards = products.map((product) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', product),
        });
        return card.render({
            price: product.price,
            title: product.title,
            image: {src: CDN_URL + product.image, alt: product.title},
            category: product.category,
        });
    });
    gallery.replaceChildren(...cards);
});

events.on('card:select', (product: IProduct) => {
    catalog.setSelectedProduct(product);
});

events.on('preview:changed', () => {
    const product = catalog.getSelectedProduct();
    if (!product) return;

    const inBasket = basket.contains(product.id);
    
    const content = cardPreview.render({
            title: product.title,
            image: {src: CDN_URL + product.image, alt: product.title},
            category: product.category,
            description: product.description,
            price: product.price,
            buttonText: product.price === null ? 'Недоступно' : inBasket ? 'Удалить из корзины' : 'Купить',
            buttonNo: product.price === null
        });

        modal.render({ content });
    });

events.on('preview:buttonClick', () => {
    const product = catalog.getSelectedProduct();
    if(!product) return;

    if(basket.contains(product.id)) {
        basket.removeItem(product.id);
    } else {
        basket.addItem(product);
    }
    modal.close();
})

events.on('card:add', (product: IProduct) => {
    basket.addItem(product);
});

events.on('card:remove', (product: IProduct) => {
    basket.removeItem(product.id);
});

events.on('basket:changed', () => {
    header.counter = basket.getCount();
    renderBasket();
});

events.on('basket:open', () => {
    modal.render({ content: basketView.render() })
});

events.on('order:open', () => {
    const data = buyer.getData();

    orderForm.payment = data.payment;
    orderForm.address = data.address;

    modal.render({
        content: orderForm.render({ valid: false, errors: [] })
    })
});

events.on('order.payment:change', (data: {target: string}) => {
    buyer.setPayment(data.target as TPayment);
    buyer.changes();
});

events.on('order.address:change', (data: {field: string; value: string}) => {
    buyer.setAddress(data.value);
    buyer.changes();
});

events.on('order:submit', () => {
    const data = buyer.getData();

    contactsForm.email = data.email;
    contactsForm.phone = data.phone;

    modal.render({
        content: contactsForm.render({ valid: false, errors: [] })
    })
});

events.on('contacts.email:change', (data: {field: string; value: string}) => {
    buyer.setEmail(data.value);
    buyer.changes();
});

events.on('contacts.phone:change', (data: {field: string; value: string}) => {
    buyer.setPhone(data.value);
    buyer.changes();
});

events.on('contacts:submit', () => {
        const buyerData = buyer.getData();
        const order = {
            ...buyerData,
            items: basket.getItems().map((item) => item.id),
            total: basket.getTotal()
        };

        weblarekapi.createOrder(order)
            .then((result) => {
                const success = new Success(cloneTemplate(successTemplate), {
                    onClick: () => modal.close()
                });

                modal.render({
                    content: success.render({
                        total: result.total
                    })
                });

                basket.clear();
                buyer.clear();
            })
            .catch((error) => {
                console.error('Ошибка при оформлении:', error);
            });
});

events.on('buyer:change', () => {
    const errors = buyer.validate();
    const data = buyer.getData();

    const orderErrors: string[] = [];
        if (errors.payment) orderErrors.push(errors.payment);
        if(errors.address) orderErrors.push(errors.address);

    orderForm.payment = data.payment;
    orderForm.address = data.address;
    orderForm.render({ valid: orderErrors.length === 0, errors: orderErrors });

    const contactsErrors: string[] = [];
        if (errors.email) contactsErrors.push(errors.email);
        if(errors.phone) contactsErrors.push(errors.phone);

    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    contactsForm.render({ valid: contactsErrors.length === 0, errors: contactsErrors })
});

console.log('Api');

weblarekapi.getProducts()
    .then((data) => {
        catalog.setProducts(data.items);
        console.log('Каталог получен с сервера: ', catalog.getProducts());
    })
    .catch((error) => {
        console.error('Ошибка получения данных с сервера: ', error);
    });