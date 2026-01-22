const STORAGE_WATCHLIST_KEY = 'watchlist';

let watchlist = loadWatchlist();

function loadWatchlist() {
  return JSON.parse(localStorage.getItem(STORAGE_WATCHLIST_KEY)) || [];
}

function saveWatchlist(watchlist) {
  localStorage.setItem(STORAGE_WATCHLIST_KEY, JSON.stringify(watchlist));
}

function addMovieToWatchlist(movie) {
  watchlist.push(movie);
  saveWatchlist(watchlist);
}

function removeMovieFromWatchlist(movieId) {
  watchlist.filter((movie) => movie.imdbID === movieId);
  saveWatchlist(watchlist);
}
