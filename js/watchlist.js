const STORAGE_WATCHLIST_KEY = 'watchlist';

function loadWatchlist() {
  return JSON.parse(localStorage.getItem(STORAGE_WATCHLIST_KEY)) || [];
}

function saveWatchlist(watchlist) {
  localStorage.setItem(STORAGE_WATCHLIST_KEY, JSON.stringify(watchlist));
}
