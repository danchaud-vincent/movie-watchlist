import { CONFIG } from '/config/main-config.js';

getBackgroundPhoto();

function setHeaderPhoto(imageURL) {
  document.getElementById('hero').style.backgroundImage = `url(${imageURL})`;
}

async function getBackgroundPhoto() {
  const baseURL = `https://api.unsplash.com/photos/random/?query=movie`;
  const response = await fetch(baseURL, {
    headers: {
      Authorization: `Client-ID ${CONFIG.UNSLPASH_API_KEY}`,
    },
  });

  const data = await response.json();
  const imageUnsplash = data.urls.regular;

  setHeaderPhoto(imageUnsplash);
}
