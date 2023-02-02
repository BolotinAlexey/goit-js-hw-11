export default function createGallery(arr) {
  return (injectStr = arr.map(createCard).join(''));
}

function createCard({ webformatURL, tags, likes, views, comments, downloads }) {
  return `
   <a href="" class="gallery__item">
    <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>
</a>
    `;
}
