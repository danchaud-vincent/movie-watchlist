import { getMessageContainer } from './messageComponent.js';
import { createMovieCard } from './movieCard.js';
import { truncateTextToggle } from '../pipes/truncatePipe.js';

export function renderMovies(movies, pageType) {
  const container = document.getElementById('movies');

  if (!movies.length) {
    const messageContent = getMessageContainer(pageType);
    container.innerHTML = messageContent;
    return;
  }

  container.innerHTML = movies.map((movie) => createMovieCard(movie)).join('');

  // init plots
  document.querySelectorAll('.movie-plot').forEach((plot) => {
    truncateTextToggle(plot, 100);
  });
}
