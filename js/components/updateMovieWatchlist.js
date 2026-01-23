import { createWatchlistButton } from './movieCard.js';

export function updateMovieWatchlistUI(movieContainer, isInWatchlist) {
  const btn = movieContainer.querySelector('.watchlist-btn');
  btn.innerHTML = createWatchlistButton(isInWatchlist);
}
