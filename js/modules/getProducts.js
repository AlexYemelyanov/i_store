'use strict';

let productsData = [];

const getProducts = async (renderPage) => {
	try {
		if (!productsData.length) {
			const res = await fetch('../../data/issues.json');
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			productsData = await res.json();
		}
		renderPage(productsData);
		console.log(productsData);
	} catch (err) {
		showErrorMessage(ERROR_SERVER);
	}
};

export { getProducts };
