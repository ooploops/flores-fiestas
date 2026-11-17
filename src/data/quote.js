// Opens the quote builder from anywhere on the page. preset: { answers, step }.
export const openQuote = (preset = {}) => window.dispatchEvent(new CustomEvent('open-quote', { detail: preset }));
