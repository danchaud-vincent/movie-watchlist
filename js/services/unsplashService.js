import { CONFIG } from '../../config/config';

export async function loadRandomHeroImage(elementId, fallbackImageURL = '/assets/images/movies-poster.jpg') {
  const randomImageURL = await fetchRandomBackgroundImage('movie');
  const imageURL = randomImageURL ? randomImageURL : fallbackImageURL;
  setHeroBackground(elementId, imageURL);
}

/**
 * @param {string} elementId - id of the el
 * @param {string} imageURL - url of the image
 */
export function setHeroBackground(elementId, imageURL) {
  const element = document.getElementById(elementId);

  if (!element) {
    console.warn(`Element with ID ${elementId} not found!`);
    return;
  }

  element.style.backgroundImage = ` url(${imageURL})`;
}

/**
 *
 * @param {string} query - query for the api
 * @returns {Promise<string>} - image URL
 */
export async function fetchRandomBackgroundImage(query = 'movie') {
  try {
    // get a random movie image with the unsplash API
    const url = `https://api.unsplash.com/photos/random/?query=${query}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${CONFIG.UNSLPASH_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw Error(`An error occured : Unsplash image not found for the query ${query}`);
    }

    const data = await response.json();
    const imageURL = data.urls.regular;

    return imageURL;
  } catch (err) {
    console.error('Error - fetchRandomMovieImage:', err.message);
    return null;
  }
}
