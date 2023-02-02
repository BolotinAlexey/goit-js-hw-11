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
};
const lightbox = new SimpleLightbox('.gallery a', options);
const api = new Api();
refs.form.addEventListener('submit', onSubmit);

async function runScript(word) {
  api.qSet = word;
  try {
    const { total, totalHits, hits } = await api
      .fetchApi()
      .then(res => res.data);
    if (total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clearFieldInput();
      return;
    }
    console.log(total, totalHits, hits);
    refs.gallery.insertAdjacentHTML('beforeend', createGallery(hits));
    // lightbox.refresh();
  } catch (error) {}
}

function onSubmit(e) {
  e.preventDefault();
  const inputWord = e.target.elements.searchQuery.value.trim();
  runScript(inputWord);
}

function clearFieldInput() {
  refs.input.value = '';
  api.qSet = '';
  refs.gallery.innerHTML = '';
  // lightbox.refresh();
}
