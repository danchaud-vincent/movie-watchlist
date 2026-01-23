const EMPTY_STATE_TEXT = {
  index: "Unable to find what you're looking for. Please try another search.",
  watchlist: 'Your watchlist is looking a little empty...',
};

export function getMessageContainer(pageType) {
  return `
      <div id="message-container" class="message-container">
          <img class="movie-icon" src="/assets/images/movie-icon.png" alt="movie icon" />
          <p class="message-content">${EMPTY_STATE_TEXT[pageType]}</p>
        </div>
  `;
}
