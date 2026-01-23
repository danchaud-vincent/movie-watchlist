import { loadRandomHeroImage } from '../services/unsplashAPI.js';
import { renderMovies } from '../components/renderMovies.js';
import { loadWatchlist } from '../services/watchlist.js';

// set hero background image
loadRandomHeroImage('hero');

// render the watchlist
const watchlist = loadWatchlist();
renderMovies(watchlist, 'watchlist');
