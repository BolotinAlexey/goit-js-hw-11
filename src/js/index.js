import Notiflix from 'notiflix';
import Api from './fetchApi';
import createGallery from './gallery';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import getRefs from './getRefs';

const refs = getRefs();
const lightbox = new SimpleLightbox('.gallery a');
const api = new Api();
refs.form.addEventListener('submit', onSubmit);

// Main script
async function runScript(word, page) {
  api.q = word;
  api.page = page;
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

    if (api.page === 1)
      Notiflix.Notify.success(` Hooray! We found ${totalHits} images.`);
    else shiftGallery();

    if (api.page * 40 > totalHits) {
      refs.button.classList.add('invisible');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
    refs.button.classList.remove('invisible');
    refs.button.addEventListener('click', nextPage);
  } catch (error) {
    console.log(error);
  }
}

// "submit" event handler
function onSubmit(e) {
  e.preventDefault();
  const inputWord = e.target.elements.searchQuery.value.trim();
  resetGallery();
  if (!inputWord) return;
  runScript(inputWord, 1);
}

// Leads the contents of the gallery to the initial state
function clear() {
  refs.input.value = '';
  api.q = '';
  refs.button.classList.add('invisible');
  resetGallery();
}

// Cleans the contents of the gallery
function resetGallery() {
  refs.gallery.innerHTML = '';
}

// Increments the current page by one and restarts the gallery rendering script
function nextPage() {
  api.incrementPage();
  refs.button.removeEventListener('click', nextPage);
  runScript(api.q, api.page);
}

// Shifts the gallery by 2 cards up
function shiftGallery() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
