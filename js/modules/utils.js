'use strict';
//==========================================

// Вывод ошибки
export function showErrorMessage(message) {
	const h1 = document.querySelector('.header__error-msg h1');
	const msg = `<div class="error">
            <p>${message}</p>
        </div>`;
	h1.insertAdjacentHTML('afterend', msg);
}
