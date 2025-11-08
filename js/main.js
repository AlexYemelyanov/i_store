'use strict';

import { manageCard } from './modules/manageCard.js';
import { getProducts } from './modules/getProducts.js';
import { observeCardsAppearance } from './modules/observer.js';
import { renderPage } from './modules/renderCards.js';

window.addEventListener('DOMContentLoaded', () => {
	getProducts(renderPage);
	manageCard(observeCardsAppearance);
});
