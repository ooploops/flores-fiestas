import { asset } from './asset.js';

// Placeholder costs (per guest for dishes, per piece for desserts). Price = cost x markup.
export const MARKUP = 2;
// Long-cook and handmade dishes carry more labor, so they use a higher multiplier.
export const LABOR_MARKUP = 2.5;
// Orders below the minimum are bumped up to it; delivery and setup is added once per order.
export const MIN_ORDER = 350;
export const DELIVERY_SETUP = 100;
export const MAX_GUESTS = 250;
export const JUG_SERVES = 25;

const priced = (item) => ({ ...item, price: Math.round(item.cost * (item.labor ? LABOR_MARKUP : MARKUP) * 100) / 100 });
const withImage = (item) => ({ ...item, image: asset(item.image) });

export const services = [
  { id: 'catering', name: 'Catering', blurb: 'Italian and Mexican menus, priced per person.', image: '/images/svc-catering.jpg', focus: '50% 50%' },
  { id: 'dessert', name: 'Dessert table', blurb: 'Pick your favorite sweets, priced per piece.', image: '/images/svc-dessert.jpg', focus: '40% 60%' },
  { id: 'drinks', name: 'Drinks', blurb: 'Large jugs of horchata, jamaica, coffee, and more.', image: '/images/quote/drinks.jpg', focus: '50% 55%' },
  { id: 'decor', name: 'Decor & tablescapes', blurb: 'Priced after we talk about your space.', image: '/images/svc-decor.jpg', focus: '60% 55%' },
].map(withImage);

export const menus = [
  {
    id: 'italian', name: 'Italian', image: '/images/quote/menu-italian.jpg',
    dishes: [
      { id: 'lasagna', name: 'Lasagna', cost: 8, labor: true, desc: 'Layers of tender pasta, savory sauce, and melted cheese, baked until golden and bubbling.' },
      { id: 'zuppa', name: 'Zuppa Toscana', cost: 4.5, desc: 'A hearty, creamy soup with sausage, potatoes, and tender greens, simmered low and slow.' },
      { id: 'rolls', name: 'Bread rolls', cost: 1.5, desc: 'Warm, soft rolls with a golden crust, made for soaking up every last drop.' },
      { id: 'salad', name: 'Salad', cost: 3, desc: 'Crisp, fresh greens tossed to brighten the plate next to something rich.' },
    ].map(priced),
  },
  {
    id: 'mexican', name: 'Mexican', image: '/images/quote/menu-mexican.jpg',
    dishes: [
      { id: 'menudo', name: 'Menudo', cost: 5.5, labor: true, desc: 'A slow-simmered, deeply savory soup in a bold red chile broth, made the traditional way.' },
      { id: 'pozole', name: 'Pozole', cost: 5.5, labor: true, desc: 'A comforting, slow-cooked hominy soup in a rich, flavorful broth, ready for your favorite toppings.' },
      { id: 'birria', name: 'Birria', cost: 7, labor: true, desc: 'Tender, slow-braised meat in a deep, chile-spiced broth. Rich, juicy, and worth the wait.' },
      { id: 'pupusas', name: 'Pupusas', cost: 5, labor: true, desc: 'Handmade corn pockets griddled until golden and crisp at the edges, with a warm, melty filling.' },
      { id: 'salsa', name: 'Mango salsa and chips', cost: 2.75, desc: 'Sweet, juicy mango with a bright, fresh kick, served with crunchy chips for scooping.' },
      { id: 'beans-rice', name: 'Beans and rice', cost: 3, desc: 'Creamy, savory beans with fluffy rice. The comforting side that goes with everything.' },
    ].map(priced),
  },
].map(withImage);

export const desserts = [
  { id: 'flans', name: 'Mini flans', cost: 1.75, desc: 'Silky vanilla custard under a glossy caramel finish.', image: '/images/quote/d-flan.jpg' },
  { id: 'cheesecakes', name: 'Mini cheesecakes', cost: 2.25, desc: 'Creamy, rich, just-sweet-enough bites on a crumbly base.', image: '/images/quote/d-cheesecake.jpg' },
  { id: 'pudding', name: 'Pudding cups', cost: 1.5, desc: 'Smooth, spoonable pudding in sweet little individual cups.', image: '/images/quote/d-pudding.jpg' },
  { id: 'hearts', name: 'Chocolate hearts', cost: 1.25, desc: 'Smooth, glossy chocolate shaped into hearts, made for sharing.', image: '/images/quote/d-hearts.jpg' },
  { id: 'strawberries', name: 'Chocolate covered strawberries', cost: 1.75, desc: 'Juicy, ripe strawberries dipped in rich chocolate.', image: '/images/quote/d-strawberries.jpg' },
  { id: 'cannoli', name: 'Cannoli', cost: 2, desc: 'Crisp, golden shells piled with sweet, creamy filling.', image: '/images/quote/d-cannoli.jpg' },
  { id: 'pretzels', name: 'Chocolate covered pretzels', cost: 0.9, desc: 'Salty crunch meets smooth, sweet chocolate.', image: '/images/quote/d-pretzels.jpg' },
  { id: 'cake', name: 'Chocolate cake', cost: 2.25, desc: 'Moist, deeply chocolatey cake, served by the piece.', image: '/images/quote/d-cake.jpg' },
].map(priced).map(withImage);

// Jugs are priced per jug and sized by guest count; the coffee station is priced per guest.
export const drinks = [
  { id: 'horchata', name: 'Horchata', kind: 'jug', cost: 30, desc: 'Cool, creamy, and cinnamon-sweet. A classic that goes down easy on a warm day.' },
  { id: 'jamaica', name: 'Jamaica', kind: 'jug', cost: 24, desc: 'Bright ruby-red hibiscus tea, tart and refreshing, served ice cold.' },
  { id: 'mocha', name: 'Mocha coffee drink', kind: 'jug', cost: 40, desc: 'Rich coffee meets chocolate in a smooth, sweet, ready-to-pour crowd pleaser.' },
  { id: 'coffee-station', name: 'Self-serve coffee station', kind: 'guest', cost: 1.5, desc: 'Fresh, hot coffee your guests can pour whenever they like, all event long.' },
].map(priced);

export const money = (amount) => {
  const value = Math.round(amount * 100) / 100;
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 });
};

// Desserts split evenly across the chosen types; the total covers pieces-per-guest for everyone.
export function buildQuote({ guests, services: chosen, menus: chosenMenus, dishes, drinks: chosenDrinks = [], desserts: chosenDesserts, pieces }) {
  const lines = [];
  if (chosen.includes('catering')) {
    menus.filter((menu) => chosenMenus.includes(menu.id)).forEach((menu) => {
      menu.dishes.filter((dish) => dishes.includes(dish.id)).forEach((dish) => {
        lines.push({ key: dish.id, label: `${menu.name}: ${dish.name}`, detail: '', perGuest: dish.price, total: dish.price * guests });
      });
    });
  }
  if (chosen.includes('drinks')) {
    const jugs = Math.ceil(guests / JUG_SERVES);
    drinks.filter((drink) => chosenDrinks.includes(drink.id)).forEach((drink) => {
      if (drink.kind === 'jug') lines.push({ key: drink.id, label: drink.name, detail: `${jugs} ${jugs === 1 ? 'jug' : 'jugs'}`, perGuest: (jugs * drink.price) / guests, total: jugs * drink.price });
      else lines.push({ key: drink.id, label: drink.name, detail: '', perGuest: drink.price, total: drink.price * guests });
    });
  }
  if (chosen.includes('dessert') && chosenDesserts.length) {
    const picked = desserts.filter((dessert) => chosenDesserts.includes(dessert.id));
    const each = Math.ceil((guests * pieces) / picked.length);
    picked.forEach((dessert) => {
      lines.push({ key: dessert.id, label: dessert.name, detail: `${each} pieces`, perGuest: (each * dessert.price) / guests, total: each * dessert.price });
    });
  }
  if (lines.length) {
    const perGuest = (amount) => (guests > 0 ? amount / guests : 0);
    const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
    if (subtotal < MIN_ORDER) lines.push({ key: 'minimum', label: 'Order minimum', detail: `Our minimum order is ${money(MIN_ORDER)}`, perGuest: perGuest(MIN_ORDER - subtotal), total: MIN_ORDER - subtotal });
    lines.push({ key: 'delivery', label: 'Delivery and setup', detail: '', perGuest: perGuest(DELIVERY_SETUP), total: DELIVERY_SETUP });
  }
  const total = lines.reduce((sum, line) => sum + line.total, 0);
  return { lines, total, perGuest: guests > 0 ? total / guests : 0 };
}
