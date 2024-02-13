'use strict';
const navLinks = document.querySelector('.nav__links');
const navLink = document.querySelectorAll('.nav__links .nav__link');
const btnMenu = document.querySelector('.nav__btn-menu');
const btnClose = document.querySelector('.nav__btn-close');
const aboutusBox = document.querySelector('.aboutus__text-box');
const aboutusBtn = document.querySelector('.aboutus__btn');
const search = document.querySelector('.travelList__search');
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const contactSendBtn = document.querySelector('.contact__send-btn');
const contactCloseBtn = document.querySelector('.contact__clear-btn');
const contacMmessage = document.querySelector('#message');
const contactPopup = document.querySelector('.contact__popup');
const travelName = document.querySelectorAll('.travelList__place-title');

AOS.init();

const handleClickNavigation = () => {
	navLinks.classList.toggle('nav__links-active');
};
const removeClassOnDesktop = () => {
	const mediaQuery = window.matchMedia('(min-width: 1200px)');
	if (mediaQuery.matches) {
		navLinks.classList.remove('nav__links-active');
	}
};
navLink.forEach(link => {
	link.addEventListener('click', handleClickNavigation);
});
const handleDestinations = () => {
	const linkBtn = document.querySelector('.nav__links-col');
	const destinations = document.querySelector('.nav__destinations-box');
	const navArrow = document.querySelector('.nav__arrow');
	const handleDestinationsBtn = () => {
		destinations.classList.toggle('nav__acitive-destinations-btn');
		navArrow.classList.toggle('nav__active-arrow');
	};
	const removeHandleDestinationsBtn = () => {
		if (destinations.classList.contains('nav__acitive-destinations-btn')) {
			destinations.classList.remove('nav__acitive-destinations-btn');
			navArrow.classList.remove('nav__active-arrow');
		}
	};
	linkBtn.addEventListener('click', event => {
		event.stopPropagation();
		handleDestinationsBtn();
	});
	window.addEventListener('click', removeHandleDestinationsBtn);
};
handleDestinations();
const aboutusHandlebtn = () => {
	aboutusBox.classList.toggle('aboutus__add-text');
};

const showError = (input, msg) => {
	const formBox = input.parentElement;
	const errorMsg = formBox.querySelector('.contact__error-text');
	formBox.classList.add('contact__error');
	errorMsg.textContent = msg;
};
const clearError = input => {
	const formBox = input.parentElement;
	formBox.classList.remove('contact__error');
};
const checkForm = input => {
	input.forEach(el => {
		if (el.value === '') {
			showError(el, el.placeholder);
		} else {
			clearError(el);
		}
	});
};
const checkMail = email => {
	const re =
		/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	if (re.test(email.value)) {
		clearError(email);
	} else {
		showError(email, 'E-mail jest niepoprawny');
	}
};
const checkErrors = () => {
	const allInputs = document.querySelectorAll('.contact__form-group');
	let errorCount = 0;
	allInputs.forEach(el => {
		if (el.classList.contains('contact__error')) {
			errorCount++;
		}
	});
	if (errorCount === 0) {
		contactPopup.classList.add('contact__show-popup');
	}
};

const handleTravelList = e => {
	const text = e.target.value.toLowerCase();
	travelName.forEach(el => {
		if (el.textContent.toLowerCase().indexOf(text) !== -1) {
			el.closest('.travelList__place').style.display = 'block';
		} else {
			el.closest('.travelList__place').style.display = 'none';
		}
	});
};

const updateDate = () => {
	let currentDateElement = document.querySelector('.footer__currentDate');
	let currentDate = new Date();
	let formattedDate = currentDate.toLocaleString('pl-PL', { day: 'numeric', month: 'numeric', year: 'numeric' });
	currentDateElement.textContent = formattedDate;
};
updateDate();
setInterval(updateDate, 1000);

btnClose.addEventListener('click', handleClickNavigation);
btnMenu.addEventListener('click', handleClickNavigation);
window.addEventListener('resize', removeClassOnDesktop);
document.addEventListener('DOMContentLoaded', () => {
	const search = document.querySelector('#category');
	if (search) {
		search.addEventListener('keyup', e => {
			handleTravelList(e);
			console.log('sadasdas');
		});
	}
});
document.addEventListener('DOMContentLoaded', () => {
	const contact = document.querySelector('#contact');
	if (contact) {
		contactSendBtn.addEventListener('click', e => {
			e.preventDefault();
			checkForm([username, email, contacMmessage]);
			checkMail(email);
			checkErrors();
		});
	}
});
