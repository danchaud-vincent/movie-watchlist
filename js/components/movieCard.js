export function createMovieCard(movie) {
  return `
    <div class="movie-container" data-movie-id=${movie.imdbID}>
      <a href="article.html?id=${movie.imdbID}" class="movie-link">
        <img class="movie-poster" alt="movie poster" src="${movie.Poster}">
      </a>
      <div class="movie-content">
        <div class="movie-header">
          <h2>${movie.Title}</h2> 
        </div>
        <div class="movie-description">
          <p class="no-shrink">⭐ ${movie.imdbRating}</p>
          <p class="no-shrink">${movie.Runtime}</p>
        </div>
        <div class="movie-genres">
          ${createGenresHtml(movie.Genre)}
        </div>
        <button class="watchlist-btn">${createWatchlistButton(movie.isSubscribed)}</button>
        <div class="movie-plot">
          <span class="plot-text" data-truncated="false" data-fulltext="${movie.Plot}">${movie.Plot}</span>
          <button class="readmore-btn"></button>
        </div>
      </div>
    </div>
    `;
}

function createGenresHtml(genres) {
  return genres
    .split(',')
    .map((genre) => `<p class="genre">${genre}</p>`)
    .join('');
}

function createWatchlistButton(isSubscribed) {
  return isSubscribed ? `<i class="fa-solid fa-minus"></i> Remove` : `<i class="fa-solid fa-plus"></i> Watchlist`;
}
