const STORAGE_WATCHLIST_KEY = 'watchlist';

export function loadWatchlist() {
  try {
    const dataStorage = localStorage.getItem(STORAGE_WATCHLIST_KEY);
    const data = dataStorage ? JSON.parse(dataStorage) : [];

    // add isSubscribed to true for all movie in watchlist
    return data.length > 0
      ? data.map((movie) => {
          return { ...movie, isSubscribed: true };
        })
      : data;
  } catch (error) {
    console.error('Error when loading the watchlist', error.message);
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
