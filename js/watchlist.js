const STORAGE_WATCHLIST_KEY = 'watchlist';

export function loadWatchlist() {
  try {
    const data = localStorage.getItem(STORAGE_WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Errror when loading the watchlist', error.message);
  }
}

function saveWatchlist(watchlist) {
  localStorage.setItem(STORAGE_WATCHLIST_KEY, JSON.stringify(watchlist));
}

export function clearWatchlist() {
  saveWatchlist([]);
}

export function toggleMovieInWatchlist(movie) {
  const watchlist = loadWatchlist();

  const isInWatchlist = watchlist.some((movieInWatchlist) => movieInWatchlist.imdbID === movie.imdbID);

  const updatedWatchlist = isInWatchlist
    ? watchlist.filter((movieWatchlist) => movieWatchlist.imdbID !== movie.imdbID)
    : [...watchlist, movie];

  // save new watchlist
  saveWatchlist(updatedWatchlist);

  return updatedWatchlist;
}
