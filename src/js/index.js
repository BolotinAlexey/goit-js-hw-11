import Notiflix from 'notiflix';
import Api from './fetchApi';
import createGallery from './gallery';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

/* options lightbox*/
const options = {};
const refs = {
  gallery: document.querySelector('.gallery'),
  form: document.querySelector('#search-form'),
  input: document.querySelector('[name="searchQuery"]'),
  button: document.querySelector('.load-more'),
};
const lightbox = new SimpleLightbox('.gallery a', options);
const api = new Api();
refs.form.addEventListener('submit', onSubmit);

async function runScript(word, page) {
  api.qSet = word;
  api.pageSet = page;
  try {
    const { total, totalHits, hits } = await api
      .fetchApi()
      .then(res => res.data);
    if (total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clear();
      return;
    }
    refs.gallery.insertAdjacentHTML('beforeend', createGallery(hits));
    lightbox.refresh();
    if (api.pageGet * 40 > totalHits) {
      refs.button.classList.add('invisible');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
    refs.button.classList.remove('invisible');
    refs.button.addEventListener('click', nextPage);
  } catch (error) {}
}

function onSubmit(e) {
  e.preventDefault();
  const inputWord = e.target.elements.searchQuery.value.trim();
  resetGallery();
  if (!inputWord) return;
  runScript(inputWord, 1);
}

function clear() {
  refs.input.value = '';
  api.qSet = '';
  refs.button.classList.add('invisible');
  resetGallery();
}

function resetGallery() {
  refs.gallery.innerHTML = '';
}

function nextPage(e) {
  api.setIncrPage();
  refs.button.removeEventListener('click', nextPage);
  runScript(api.qGet, api.pageGet);
}
