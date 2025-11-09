'use strict';

const getCartItems = async (renderCart) => {
	try {
		const cart = await JSON.parse(localStorage.getItem('cart') || '{}');
		const cartArray = Object.entries(cart).map(([key, value]) => ({
			...value,
			key: key, // сохраняем исходный ключ если нужно
		}));
		renderCart(cartArray);
	} catch (err) {
		console.log(err);
	}
};

export { getCartItems };
