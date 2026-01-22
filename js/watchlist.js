const STORAGE_WATCHLIST_KEY = 'watchlist';

let watchlist = loadWatchlist();

export function loadWatchlist() {
  return JSON.parse(localStorage.getItem(STORAGE_WATCHLIST_KEY)) || [];
}

function saveWatchlist(watchlist) {
  localStorage.setItem(STORAGE_WATCHLIST_KEY, JSON.stringify(watchlist));
}

export function clearWatchlist() {
  watchlist = [];
  saveWatchlist(watchlist);
}

function addMovieToWatchlist(movie) {
  watchlist.push(movie);
  saveWatchlist(watchlist);
}

function removeMovieFromWatchlist(movieId) {
  watchlist = watchlist.filter((movie) => movie.imdbID !== movieId);
  saveWatchlist(watchlist);
}

export function toggleMovieInWatchlist(movie) {
  const isInWatchlist = watchlist.some((movieInWatchlist) => movieInWatchlist.imdbID === movie.imdbID);

  if (isInWatchlist) {
    removeMovieFromWatchlist(movie.imdbID);
  } else {
    addMovieToWatchlist(movie);
  }
}
