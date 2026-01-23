import { loadRandomHeroImage } from '../services/unsplashService.js';
import { renderMovies } from '../components/renderMovies.js';
import { loadWatchlist } from '../services/watchlistService.js';

// set hero background image
loadRandomHeroImage('hero');

// render the watchlist
const watchlist = loadWatchlist();
renderMovies(watchlist, 'watchlist');
