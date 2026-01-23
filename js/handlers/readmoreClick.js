import { truncateTextToggle } from '../pipes/truncatePipe.js';

export function handleReadMoreClick(e) {
  const moviePlotEl = e.target.closest('.movie-plot');
  truncateTextToggle(moviePlotEl, 100);
}
