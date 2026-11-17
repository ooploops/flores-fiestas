import { asset } from './asset.js';

// Placeholder costs (per guest for dishes, per piece for desserts). Customer price = cost x MARKUP.
export const MARKUP = 2;
export const MAX_GUESTS = 250;

const priced = (item) => ({ ...item, price: Math.round(item.cost * MARKUP * 100) / 100 });
const withImage = (item) => ({ ...item, image: asset(item.image) });

export const services = [
  { id: 'catering', name: 'Catering', blurb: 'Italian and Mexican menus, priced per person.', image: '/images/svc-catering.jpg', focus: '50% 50%' },
  { id: 'dessert', name: 'Dessert table', blurb: 'Pick your favorite sweets, priced per piece.', image: '/images/svc-dessert.jpg', focus: '40% 60%' },
  { id: 'decor', name: 'Decor & tablescapes', blurb: 'Priced after we talk about your space.', image: '/images/svc-decor.jpg', focus: '60% 55%' },
].map(withImage);

export const menus = [
  {
    id: 'italian', name: 'Italian', image: '/images/quote/menu-italian.jpg',
    dishes: [
      { id: 'lasagna', name: 'Lasagna', cost: 8 },
      { id: 'zuppa', name: 'Zuppa Toscana', cost: 4.5 },
      { id: 'rolls', name: 'Bread rolls', cost: 1.5 },
      { id: 'salad', name: 'Salad', cost: 3 },
    ].map(priced),
  },
  {
    id: 'mexican', name: 'Mexican', image: '/images/quote/menu-mexican.jpg',
    dishes: [
      { id: 'menudo', name: 'Menudo', cost: 5.5 },
      { id: 'pupusas', name: 'Pupusas', cost: 5 },
      { id: 'salsa', name: 'Mango salsa', cost: 2 },
      { id: 'beans-rice', name: 'Beans and rice', cost: 3 },
    ].map(priced),
  },
].map(withImage);

export const desserts = [
  { id: 'flans', name: 'Mini flans', cost: 1.75, image: '/images/quote/d-flan.jpg' },
  { id: 'cheesecakes', name: 'Mini cheesecakes', cost: 2.25, image: '/images/quote/d-cheesecake.jpg' },
  { id: 'pudding', name: 'Pudding cups', cost: 1.5, image: '/images/quote/d-pudding.jpg' },
  { id: 'hearts', name: 'Chocolate hearts', cost: 1.25, image: '/images/quote/d-hearts.jpg' },
  { id: 'strawberries', name: 'Chocolate covered strawberries', cost: 1.75, image: '/images/quote/d-strawberries.jpg' },
  { id: 'cannoli', name: 'Cannoli', cost: 2, image: '/images/quote/d-cannoli.jpg' },
  { id: 'pretzels', name: 'Chocolate covered pretzels', cost: 0.9, image: '/images/quote/d-pretzels.jpg' },
  { id: 'cake', name: 'Chocolate cake', cost: 2.25, image: '/images/quote/d-cake.jpg' },
].map(priced).map(withImage);

export const money = (amount) => {
  const value = Math.round(amount * 100) / 100;
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 });
};

// Desserts split evenly across the chosen types; the total covers pieces-per-guest for everyone.
export function buildQuote({ guests, services: chosen, menus: chosenMenus, dishes, desserts: chosenDesserts, pieces }) {
  const lines = [];
  if (chosen.includes('catering')) {
    menus.filter((menu) => chosenMenus.includes(menu.id)).forEach((menu) => {
      menu.dishes.filter((dish) => dishes.includes(dish.id)).forEach((dish) => {
        lines.push({ key: dish.id, label: `${menu.name}: ${dish.name}`, detail: '', perGuest: dish.price, total: dish.price * guests });
      });
    });
  }
  if (chosen.includes('dessert') && chosenDesserts.length) {
    const picked = desserts.filter((dessert) => chosenDesserts.includes(dessert.id));
    const each = Math.ceil((guests * pieces) / picked.length);
    picked.forEach((dessert) => {
      lines.push({ key: dessert.id, label: dessert.name, detail: `${each} pieces`, perGuest: (each * dessert.price) / guests, total: each * dessert.price });
    });
  }
  const total = lines.reduce((sum, line) => sum + line.total, 0);
  return { lines, total, perGuest: guests > 0 ? total / guests : 0 };
}
