import { searchFoto } from './js/pixabay-api';
import { imagesTemplate } from './js/render-functions';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('.form');
const imagesList = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const btnLoadMore = document.querySelector('.js-btn-load');

const lightbox = new SimpleLightbox('.gallery a', {
    animationSpeed: 200,
    animationSlide: true,
    disableScroll: false,
    history: false,
    captionsData: 'alt',
    captionDelay: 250,
});

let currentPage = 1;
let perPage = 15;
let currentWord = '';
let totalImages = 0;

btnLoadMore.style.display = 'none';

form.addEventListener('submit', async e => {
    e.preventDefault();

    const word = e.target.elements.word.value.trim();
    currentWord = word;
    currentPage = 1;

    imagesList.innerHTML = ''; // Очистити попередні зображення

    if (!word) {
        imagesList.innerHTML = ''; // Очистити попередні зображення при невалідному запиті
        iziToast.error({
            title: 'Error',
            message: 'Sorry, there are no images matching your search query. Please try again!',
            position: 'topRight',
        });
        return;
    }

    loader.classList.remove('hidden');
    loader.style.display = 'block';
    btnLoadMore.style.display = 'none';

    try {
        const data = await searchFoto(word, currentPage);
        if (data.hits.length === 0) {
            imagesList.innerHTML = ''; // Очистити попередні зображення, якщо немає збігів
            iziToast.error({
                title: 'Error',
                message: 'Sorry, there are no images matching your search query. Please try again!',
                position: 'topRight',
            });
        } else {
            totalImages = data.totalHits;
            const markup = imagesTemplate(data.hits);
            imagesList.innerHTML = markup;
            lightbox.refresh();

            if (totalImages >= currentPage * perPage) {
                btnLoadMore.style.display = 'block';
            }
        }

        loader.classList.add('hidden');
        loader.style.display = 'none';
    } catch (error) {
        console.error('Error searching images:', error.message);
        loader.classList.add('hidden');
        loader.style.display = 'none';
    }
});

btnLoadMore.addEventListener('click', async e => {
    currentPage += 1;

    loader.classList.remove('hidden');

    if (totalImages <= currentPage * perPage) {
        btnLoadMore.style.display = 'none';
        iziToast.error({
            title: 'Error',
            message: "We're sorry, but you've reached the end of search results.",
            position: 'topRight',
        });
        loader.classList.add('hidden');
        loader.style.display = 'none';
    }

    try {
        const data = await searchFoto(currentWord, currentPage);
        if (data.hits.length === 0) {
            iziToast.error({
                title: 'Error',
                message: "We're sorry, but you've reached the end of search results.",
                position: 'topRight',
            });
        } else {
            const markup = imagesTemplate(data.hits);
            imagesList.insertAdjacentHTML('beforeend', markup);
            lightbox.refresh();

            const galleryItem = document.querySelector('.gallery-item');
            const galleryItemHeight = galleryItem.getBoundingClientRect().height;
            window.scrollBy({
                top: galleryItemHeight * 2,
                behavior: 'smooth'
            });
        }

        loader.classList.add('hidden');
        loader.style.display = 'none';
    } catch (error) {
        console.error('Error loading more images:', error.message);
        loader.classList.add('hidden');
        loader.style.display = 'none';
    }
});
