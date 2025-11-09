'use strict';

const cartItems = document.querySelector('.cart__items');

const renderCart = (cart) => {
	const cartArray = Object.entries(cart).map(([key, value]) => ({
		...value,
		key: key,
	}));
	renderCartItem(cartArray);
};

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
	style: 'currency',
	currency: 'BYN',
});

// Храним состояние элементов
const cartItemState = new Map();

function renderCartItem(obj) {
	obj.forEach((element) => {
		const { id, title, total, quantity, basePrice } = element;

		// Проверяем, существует ли уже элемент с таким ID
		const existingItem = cartItems.querySelector(`[data-product-id="${id}"]`);
		if (existingItem) {
			// Обновляем существующий элемент
			updateExistingItem(existingItem, {
				id,
				title,
				total,
				quantity,
				basePrice,
			});
		} else {
			// Создаем новый элемент
			createNewCartItem({ id, title, total, quantity, basePrice });
		}
	});

	// Удаляем элементы, которых нет в новых данных
	cleanupRemovedItems(obj.map((item) => item.id));
}

function createNewCartItem(element) {
	const { id, title, total, quantity, basePrice } = element;
	const formattedPrice = currencyFormatter.format(basePrice);
	const formattedTotalPrice = currencyFormatter.format(total);

	const cartItem = `
        <li class="cart__item" data-product-id="${id}">
            <div class="cart__item-name">
                <h3>${title}</h3>
            </div>
            <div class="cart__item-price" data-price="${basePrice}">
                <p>${formattedPrice}</p> 
            </div>
            <div class="cart__item-count">
                <button class="custom__btn cart__item-btn decrease">-</button> 
                <input class="cart__item-count--numb"
                    type="number"
                    min="1"
                    max="999"
                    step="1" 
                    data-current-quantity="${quantity}"
                    value="${quantity}">
                <button class="custom__btn cart__item-btn increase">+</button> 
            </div> 
            <div class="cart__item-total" data-total-price="${total}">
                <span>${formattedTotalPrice}</span> 
            </div> 
            <button class="custom__btn item__btn--delete">Удалить</button> 
        </li>
    `;

	cartItems.insertAdjacentHTML('beforeend', cartItem);

	// Сохраняем состояние
	cartItemState.set(id, { title, total, quantity, basePrice });
}

function updateExistingItem(itemElement, element) {
	const { id, title, total, quantity, basePrice } = element;
	const formattedPrice = currencyFormatter.format(basePrice);
	const formattedTotalPrice = currencyFormatter.format(total);

	// Получаем текущее состояние
	const currentState = cartItemState.get(id);

	// Обновляем только измененные части
	if (currentState.title !== title) {
		itemElement.querySelector('.cart__item-name h3').textContent = title;
	}

	if (currentState.basePrice !== basePrice) {
		const priceElement = itemElement.querySelector('.cart__item-price');
		priceElement.dataset.price = basePrice;
		priceElement.querySelector('p').textContent = formattedPrice;
	}

	if (currentState.quantity !== quantity) {
		const quantityInput = itemElement.querySelector('.cart__item-count--numb');
		quantityInput.value = quantity;
		quantityInput.dataset.currentQuantity = quantity;
	}

	if (currentState.total !== total) {
		const totalElement = itemElement.querySelector('.cart__item-total');
		totalElement.dataset.totalPrice = total;
		totalElement.querySelector('span').textContent = formattedTotalPrice;
	}

	// Обновляем состояние
	cartItemState.set(id, { title, total, quantity, basePrice });
}

function cleanupRemovedItems(currentIds) {
	const allItems = document.querySelectorAll('.cart__item');

	allItems.forEach((item) => {
		const itemId = item.dataset.productId;
		if (!currentIds.includes(itemId)) {
			item.remove();
			cartItemState.delete(itemId);
		}
	});
}

export { renderCart };
