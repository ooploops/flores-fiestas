// Prefixes public asset paths so images also work when the site is served from a subpath (GitHub Pages).
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
