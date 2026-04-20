import { Card } from "./Card";
import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

export type TCardCatalog = Pick<IProduct, 'category'> & {
    image: {
        src: string;
        alt?: string;
    };
}

    interface ICardCatalogActions {
        onClick: (event: MouseEvent) => void;
    }

    export class CardCatalog extends Card<TCardCatalog> {
        protected _image: HTMLImageElement;
        protected _category: HTMLElement;

        constructor(container: HTMLElement, actions?: ICardCatalogActions) {
            super(container);

            this._image = ensureElement<HTMLImageElement>('.card__image', container);
            this._category = ensureElement<HTMLElement>('.card__category', container);

            if(actions?.onClick) {
                container.addEventListener('click', actions.onClick);
            }
        }

        set image(value: {src: string; alt?: string}) {
            this.setImage(this._image, value.src, value.alt);
        }

        set category(value: string) {
            this._category.textContent = value;
            for (const key in categoryMap) {
                this._category.classList.toggle(
                    categoryMap[key as keyof typeof categoryMap],
                    key === value
                )
            }
        }
    }