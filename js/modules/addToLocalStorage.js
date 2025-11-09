'use strict';

const addToLocalStorage = (cardElement, manageCartItem) => {
	try {
		if (!cardElement || !cardElement.classList.contains('card')) {
			throw new Error('Неверный элемент карточки');
		}
		const productId = cardElement.dataset.productId;
		if (!productId) {
			throw new Error('Отсутствует data-product-id');
		}

		const price = cardElement.querySelector('.card__price'),
			current = cardElement.querySelector('.card__count--numb'),
			total = cardElement.querySelector('.card__total'),
			title = cardElement.querySelector('.card__name');

		const productData = {
			id: productId,
			basePrice: parseFloat(price.dataset.price),
			quantity: parseInt(current.dataset.currentQuantity) || 1,
			total: parseFloat(total.dataset.totalPrice),
			title: title.dataset.name,
			// available: cardElement.dataset.available !== 'false',
		};

		if (isNaN(productData.basePrice) || productData.basePrice <= 0) {
			throw new Error('Неверная цена товара');
		}

		if (isNaN(productData.quantity) || productData.quantity < 1) {
			throw new Error('Неверное количество товара');
		}

		const cart = JSON.parse(localStorage.getItem('cart') || '{}');

		// Проверяем, есть ли уже такой товар в корзине
		if (cart[productId]) {
			// Обновляем количество и итог
			cart[productId].quantity += productData.quantity;
			cart[productId].total =
				cart[productId].basePrice * cart[productId].quantity;
			cart[productId].updatedAt = new Date().toISOString();
		} else {
			// Добавляем новый товар
			cart[productId] = productData;
		}

		// Сохраняем в Local Storage
		localStorage.setItem('cart', JSON.stringify(cart));

		console.log('✅ Товар успешно добавлен в корзину:', productData);

		return { success: true, data: productData };
	} catch (err) {}
};

export { addToLocalStorage };
