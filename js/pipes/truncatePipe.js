function truncatePipe(text, maxLength = 100) {
  return text.length > maxLength ? text.slice(0, 100) + '...' : text;
}

export function truncateTextToggle(element, maxLength = 100) {
  // Get movie plot text
  const plotTextEl = element.querySelector('.plot-text');
  const readmoreBtn = element.querySelector('.readmore-btn');

  const plotText = plotTextEl.textContent.trim();
  const fullText = plotTextEl.dataset.fulltext;
  let isTruncated = plotTextEl.dataset.truncated === 'true';

  if (isTruncated) {
    plotTextEl.textContent = fullText;
    readmoreBtn.textContent = 'READ LESS';
  } else {
    plotTextEl.textContent = truncatePipe(plotText, maxLength);
    readmoreBtn.textContent = 'READ MORE';
  }

  isTruncated = !isTruncated;
  plotTextEl.dataset.truncated = isTruncated.toString();
}
