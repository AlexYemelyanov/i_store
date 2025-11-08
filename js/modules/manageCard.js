'use strict';

const manageCard = (observe) => {
	observe('.card', (cardElement) => {
		cardElement.forEach((card) => {
			const count = card.querySelector('.card__count');
			const totalPrice = card.querySelector('.card__total span');
			const countNum = card.querySelector('.card__count--numb');
			const decrease = card.querySelector('.decrease');
			const increase = card.querySelector('.increase');
			const price = card.querySelector('.card__price p');

			if (countNum.value == 1) {
				decrease.disabled = true;
			}

			const updateTotal = () => {
				const constPrice = parseFloat(price.textContent);
				const quantity = parseInt(countNum.value) || 1;
				const total = constPrice * quantity;
				totalPrice.textContent = total.toFixed(1);
				card.dataset.currentQuantity = quantity;
				card.dataset.totalPrice = total;
				console.log(card.dataset.currentQuantity, card.dataset.totalPrice);
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
				if (typeof countNum.value != number) {
					countNum.value = 1;
				}
				countNum.value = e.target.value;
				if (countNum.value > 1) {
					decrease.disabled = false;
				} else {
					decrease.disabled = true;
				}
				updateTotal();
			});
			card.addEventListener('click', (e) => {});
		});
	});
};

export { manageCard };
