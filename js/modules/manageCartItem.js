'use strict';

const cartResults = document.querySelector('.cart__total');
const cartPositions = cartResults.querySelector('.cart__total--postn span');
const cartUnits = cartResults.querySelector('.cart__total--units span');
const cartTotal = cartResults.querySelector('.cart__total--price span');
const cartEmpty = document.querySelector('.cart__empty');
const purgeBtn = document.querySelector('.cart__purge-btn');
const currencyFormatter = new Intl.NumberFormat('ru-RU', {
	style: 'currency',
	currency: 'BYN',
});

initCartPurge();

function initCartPurge() {
	if (purgeBtn) {
		purgeBtn.addEventListener('click', handlePurgeCart);
	}
}

// Функция полной очистки корзины
function handlePurgeCart() {
	// Удаляем все элементы из DOM
	const cartItems = document.querySelectorAll('.cart__item');
	cartItems.forEach((item) => {
		item.remove();
	});

	// Очищаем localStorage
	localStorage.removeItem('cart');

	// Обновляем сводку
	updateCartSummary([]);

	// Показываем блок пустой корзины
	updateEmptyCartVisibility(0);

	console.log('Корзина полностью очищена');
}

function showAddToCartAlert() {
	const currentTotal = cartTotal.textContent;
	const message = `Товар добавлен. Итого по корзине: ${currentTotal}.`;

	alert(message);
}

const manageCartItem = (observe) => {
	observe('.cart__item', (elements) => {
		updateCartSummary(elements);
		setupCartItemsHandlers(elements);
		showAddToCartAlert();
	});
};

function setupCartItemsHandlers(elements) {
	elements.forEach((item) => {
		if (!item.hasAttribute('data-handlers-set')) {
			setupCartItemHandlers(item);
			item.setAttribute('data-handlers-set', 'true');
		}
	});
}

function setupCartItemHandlers(item) {
	const elements = getCartItemElements(item);
	const productId = item.dataset.productId;

	updateDecreaseButtonState(elements.input.value, elements.decrease);

	setupEventListeners(item, elements, productId);
}

function getCartItemElements(item) {
	return {
		decrease: item.querySelector('.decrease'),
		increase: item.querySelector('.increase'),
		input: item.querySelector('.cart__item-count--numb'),
		price: item.querySelector('.cart__item-price'),
		totalPrice: item.querySelector('.cart__item-total span'),
		deleteBtn: item.querySelector('.item__btn--delete'),
	};
}

function setupEventListeners(item, elements, productId) {

	item.addEventListener('click', (e) => {
		if (e.target.closest('.decrease')) {
			handleDecrease(elements, productId, item);
		}

		if (e.target.closest('.increase')) {
			handleIncrease(elements, productId);
		}

		if (e.target.closest('.item__btn--delete')) {
			handleDelete(item, productId);
		}
	});

	// Обработчик изменения input
	elements.input.addEventListener('change', (e) => {
		handleInputChange(elements, productId, item);
	});

	// Обработчик input в реальном времени с debounce
	elements.input.addEventListener(
		'input',
		debounce((e) => {
			handleInputChange(elements, productId, item);
		}, 500)
	);
}

function handleDecrease(elements, productId, item) {
	let newValue = parseInt(elements.input.value) - 1;

	if (newValue < 1) {
	
		handleDelete(item, productId);
		return;
	}

	elements.input.value = newValue;
	updateDecreaseButtonState(newValue, elements.decrease);
	updateCartItem(elements, newValue, productId);
}

function handleIncrease(elements, productId) {
	let newValue = parseInt(elements.input.value) + 1;
	elements.input.value = newValue;

	updateDecreaseButtonState(newValue, elements.decrease);
	updateCartItem(elements, newValue, productId);
}

function handleDelete(item, productId) {
	removeFromLocalStorage(productId);
	item.remove();
	
	updateCartSummary(document.querySelectorAll('.cart__item'));

	console.log(`Товар ${productId} удален из корзины`);
}

function handleInputChange(elements, productId, item) {
	let newValue = parseInt(elements.input.value);

	
	if (newValue === 0) {
		handleDelete(item, productId);
		return;
	}


	if (isNaN(newValue) || newValue < 1) {
		newValue = 1;
	}
	if (newValue > 999) {
		newValue = 999;
	}

	elements.input.value = newValue;
	updateDecreaseButtonState(newValue, elements.decrease);
	updateCartItem(elements, newValue, productId);
}

function updateDecreaseButtonState(value, decreaseBtn) {
	decreaseBtn.disabled = value <= 1;
}

function updateCartItem(elements, newQuantity, productId) {
	updateTotalPrice(elements, newQuantity);
	updateLocalStorage(productId, newQuantity);
	updateCartSummary(document.querySelectorAll('.cart__item'));
}

function updateTotalPrice(elements, quantity) {
	const price = parseInt(elements.price.dataset.price);
	const total = price * quantity;
	elements.totalPrice.textContent = currencyFormatter.format(total);
}

function updateLocalStorage(productId, newQuantity) {
	const cart = JSON.parse(localStorage.getItem('cart') || '{}');

	if (cart[productId]) {
		cart[productId].quantity = newQuantity;
		cart[productId].total = cart[productId].basePrice * newQuantity;
		cart[productId].updatedAt = new Date().toISOString();

		localStorage.setItem('cart', JSON.stringify(cart));
		console.log(`Количество товара ${productId} обновлено: ${newQuantity}`);
	}
}

function removeFromLocalStorage(productId) {
	const cart = JSON.parse(localStorage.getItem('cart') || '{}');

	if (cart[productId]) {
		delete cart[productId];
		localStorage.setItem('cart', JSON.stringify(cart));
		console.log(`Товар ${productId} удален из localStorage`);
	}
}

// Функция для управления видимостью блока пустой корзины
function updateEmptyCartVisibility(itemsCount) {
	if (cartEmpty) {
		if (itemsCount === 0) {
			cartEmpty.classList.remove('hidden');
		} else {
			cartEmpty.classList.add('hidden');
		}
	}
}

function updateCartSummary(elements) {
	updatePositionsCount(elements);
	updateTotalUnits(elements);
	updateTotalCost(elements);
}

function updatePositionsCount(elements) {
	cartPositions.textContent = elements.length;
	updateEmptyCartVisibility(elements.length);
}

function updateTotalUnits(elements) {
	let totalUnitsCount = 0;

	elements.forEach((item) => {
		const quantityInput = item.querySelector('.cart__item-count--numb');
		if (quantityInput) {
			const quantity = parseInt(quantityInput.value) || 0;
			totalUnitsCount += quantity;
		}
	});

	cartUnits.textContent = totalUnitsCount;
}

function updateTotalCost(elements) {
	let totalCost = 0;

	elements.forEach((item) => {
		const totalElement = item.querySelector('.cart__item-total span');
		if (totalElement) {
			// Извлекаем числовое значение из отформатированной строки
			const totalText = totalElement.textContent;
			const totalValue = parseFloat(
				totalText.replace(/[^\d,]/g, '').replace(',', '.')
			);
			if (!isNaN(totalValue)) {
				totalCost += totalValue;
			}
		}
	});

	cartTotal.textContent = currencyFormatter.format(totalCost);
}

// Вспомогательная функция для оптимизации
function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

export { manageCartItem, showAddToCartAlert };
