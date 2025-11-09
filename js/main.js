'use strict';

import { manageCard } from './modules/manageCard.js';
import { getProducts } from './modules/getProducts.js';
import { observeCardsAppearance } from './modules/observer.js';
import { renderPage } from './modules/renderCards.js';
import { addToLocalStorage } from './modules/addToLocalStorage.js';
import { getCartItems } from './modules/getCartItems.js';
import { renderCart } from './modules/renderCart.js';
import {
	manageCartItem,
	showAddToCartAlert,
} from './modules/manageCartItem.js';

function setupLocalStorageCleanup() {
	window.addEventListener('beforeunload', function () {
		localStorage.clear();
	});
}

setupLocalStorageCleanup();

window.addEventListener('DOMContentLoaded', () => {
	getProducts(renderPage);

	manageCard(
		observeCardsAppearance,
		addToLocalStorage,
		getCartItems,
		renderCart,
		manageCartItem,
		showAddToCartAlert
	);
});
