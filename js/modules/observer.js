const observeCardsAppearance = (selector, callback) => {
	const observer = new MutationObserver((mutations) => {
		const card = document.querySelectorAll(selector);
		if (card) {
			callback(card);
			observer.disconnect();
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
};

export { observeCardsAppearance };
