import { Card } from "./Card";
import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

export type TCardPreview = Pick<IProduct, 'category' | 'description'> & {
    image: {
        src: string;
        alt?: string;
    };
    buttonText: string;
    buttonNo: boolean;
};

interface ICardPreviewActions {
    onClick: () => void;
}

export class CardPreview extends Card<TCardPreview> {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _text: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardPreviewActions) {
        super(container);

        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._text = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set image(value: { src: string; alt?: string }) {
        this.setImage(this._image, value.src, value.alt);
    }

    set category(value: string) {
        this._category.textContent = value;
        // this._category.className = 'card__category';
        for (const key in categoryMap) {
            this._category.classList.toggle(
                categoryMap[key as keyof typeof categoryMap],
                key === value
            );
        }
    }

    set text(value: string) {
        this._text.textContent = value;
    }

    set buttonText(value: string) {
        this._button.textContent = value;
    }

    set buttonNo(value: boolean) {
        this._button.disabled = value;
    }
}