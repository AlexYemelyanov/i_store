'use strict';

const manageCard = (
	observe,
	addToLocalStorage,
	getCartItems,
	renderCart,
	manageCartItem,
	showAddToCartAlert
) => {
	observe('.card', (cardElement) => {
		cardElement.forEach((card) => {
			const count = card.querySelector('.card__count');
			const totalPrice = card.querySelector('.card__total span');
			const totalData = card.querySelector('.card__total');
			const countNum = card.querySelector('.card__count--numb');
			const decrease = card.querySelector('.decrease');
			const increase = card.querySelector('.increase');
			const price = card.querySelector('.card__price');

			if (countNum.value == 1) {
				decrease.disabled = true;
			}

			const currencyFormatter = new Intl.NumberFormat('ru-RU', {
				style: 'currency',
				currency: 'BYN',
			});

			const updateTotal = () => {
				const constPrice = parseInt(price.dataset.price);
				const quantity = parseInt(countNum.value) || 1;
				const total = constPrice * quantity;
				totalPrice.textContent = currencyFormatter.format(total);
				countNum.dataset.currentQuantity = quantity;
				totalData.dataset.totalPrice = total;
			};
			count.addEventListener('click', (e) => {
				if (e.target.closest('.increase')) {
					countNum.value++;
					if (countNum.value > 1) {
						decrease.disabled = false;
					}
				}
				if (e.target.closest('.decrease')) {
					countNum.value--;
					if (countNum.value == 1) {
						decrease.disabled = true;
					}
				}
				updateTotal();
			});
			count.addEventListener('change', (e) => {
				let newValue = parseInt(countNum.value);
				if (isNaN(newValue) || newValue < 1) {
					countNum.value = 1;
				}
				if (newValue > 999) {
					countNum.value = 999;
				}

				countNum.value = e.target.value;
				if (countNum.value > 1) {
					decrease.disabled = false;
				} else {
					decrease.disabled = true;
				}
				updateTotal();
			});
			card.addEventListener('click', (e) => {
				if (e.target.classList.contains('card__btn--to-cart')) {
					addToLocalStorage(card);
					getCartItems(renderCart);
					manageCartItem(
						observe,
						renderCart,
						addToLocalStorage,
						showAddToCartAlert
					);
				}
			});
		});
	});
};

export { manageCard };
