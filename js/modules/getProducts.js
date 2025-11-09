'use strict';

// import { ERROR_SERVER } from '../constants';
// import { showErrorMessage } from './utils';

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
	} catch (err) {
		console.log(err);
	}
};

export { getProducts };
