'use strict';

import { NO_PRODUCTS_IN_THIS_CATEGORY } from '../constants.js';
import { showErrorMessage } from './utils.js';

const cards = document.querySelector('.cards');

const renderPage = (data) => {
	if (!data || !data.length) {
		showErrorMessage(NO_PRODUCTS_IN_THIS_CATEGORY);
		return;
	}
	renderCard(data);
};

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
	style: 'currency',
	currency: 'BYN',
});

function renderCard(data) {
	data.forEach((card) => {
		const { id, title, img, description, price } = card;
		const formattedPrice = currencyFormatter.format(price);
		const cardItem = `
					<div class = "card"
					data-product-id = "${id}" >
						<a href = "#">
						<img src = ${img}	alt = "${title}" class = "card__img">
						</a> 
						<div class = "card__name" data-name = "${title}">
						<h3> ${title} </h3> 
						</div> 
						<div class = "card__descr">
						<p> ${description} </p> 
						</div>
						<div class = "card__price" data-price = "${price}">
						<p> ${formattedPrice} </p> 
						</div>
						<div class = "card__count">
						<button class = "custom__btn card__btn decrease"> - </button> 
						<input class = "card__count--numb"
					type = "number"
					min = "1"
					max = "999"
					step = "1"
					value = "1"
					data-current-quantity = "1"
					>
						<button class = "custom__btn card__btn increase"> + </button> 
						</div>
						<div class = "card__total" data-total-price = "${price}"> Итого: <span> ${formattedPrice} </span></div >
						<button class = "custom__btn card__btn--to-cart"> В корзину </button> 
						</div>

						`;
		cards.insertAdjacentHTML('beforeend', cardItem);
	});
}

export { renderPage };
