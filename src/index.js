import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";
import { fatchPixabay } from './pixabay-api';

const form = document.querySelector('#search-form');
const gallary = document.querySelector('.gallery');
const pagination = document.querySelector('.js-pagination');

let inputValue = '';
let currentPage;

var lightbox = new SimpleLightbox('.gallery a');

let options = {
	root: null,
	rootMargin: "200px",
	threshold: 1.0
}
let observer = new IntersectionObserver(onLoad, options);

form.addEventListener('submit', onSubmit)

async function onSubmit(evt) {
	evt.preventDefault();
	currentPage = 1;
	inputValue = evt.currentTarget.children.searchQuery.value;

	try {
		const arr = await fatchPixabay(inputValue)
		if (arr.data.hits.length === 0) {
			throw new Error(error)
		}
		Notiflix.Notify.success(`Hooray! We found ${arr.data.totalHits} images.`, {
			timeout: 3000,
			position: 'center-top', distance: '110px'
		})
		gallary.innerHTML = createMarkup(arr.data.hits)
		lightbox.refresh();
		observer.observe(pagination);

		window.scroll({
			top: 0,
			behavior: "smooth",
		});

	} catch {
		Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
			timeout: 3000,
			position: 'center-top', distance: '110px'
		})
	}
}

function onLoad(entries, observer) {
	entries.forEach(async (element) => {
		if (element.isIntersecting) {
			currentPage += 1;

			try {
				const arr = await fatchPixabay(inputValue, currentPage);

				if (arr.data.hits.length === 0) {
					observer.unobserve(pagination);
					throw new Error(error)
				}
				gallary.insertAdjacentHTML('beforeend', createMarkup(arr.data.hits))
				lightbox.refresh();

			} catch {
				Notiflix.Notify.info('All images are displayed at your request', {
					timeout: 3000,
					position: 'center-top', distance: '110px'
				})
			}

		}
	});
}




function createMarkup(arr) {
	return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
		return `
					<a href="${largeImageURL}" class="photo-card">
						<img src="${webformatURL}" alt="${tags}" loading="lazy" />
				<div class="info">
					<p class="info-item">
						<b>Likes </b>${likes}
					</p>
					<p class="info-item">
						<b>Views </b>${views}
					</p>
					<p class="info-item">
						<b>Comments </b>${comments}
					</p>
					<p class="info-item">
						<b>Downloads </b>${downloads}
					</p>
						</div>
			</a>`
	}).join('');
}





