import { asset } from './asset.js';

export const siteContent = {
  brand: {
    name: 'Flores Fiestas',
    statement: 'Catering, desserts, and events.',
    email: '[Email address to be added]',
    phone: '[Phone number to be added]',
    social: '[Social profile to be added]',
  },
  hero: { image: '/images/hero.jpg', alt: 'Sunlit round table with white flowers, pillar candles and a clear table number card (stock photo placeholder)' },
  intro: { image: '/images/intro.jpg', focus: '60% 62%', alt: 'White lilies and roses in glass vases beside a sheer curtain (stock photo placeholder)' },
  navigation: [
    { label: 'Services', href: '#services' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Our Process', href: '#process' },
    { label: 'Get a Quote', href: '#quote' },
    { label: 'Contact', href: '#contact' },
  ],
  services: [
    { number: '01', title: 'Dessert Tables', description: 'Dessert displays that become the centerpiece of your party.', note: 'A little sweetness, beautifully presented', image: '/images/svc-dessert.jpg', focus: '40% 60%' },
    { number: '02', title: 'Candy & Treat Displays', description: 'Sweets and treats arranged to look as good as they taste.', note: 'Color, texture, and a touch of whimsy', image: '/images/svc-candy.jpg', focus: '50% 45%' },
    { number: '03', title: 'Event Styling & Decor', description: 'Decor that turns any space into the setting for your event.', note: 'The atmosphere lives in the details', image: '/images/svc-decor.jpg', focus: '60% 55%' },
    { number: '04', title: 'Tablescapes', description: 'Complete table settings for dinners and parties.', note: 'Made for lingering a little longer', image: '/images/svc-table.jpg', focus: '50% 70%' },
    { number: '05', title: 'Catering', description: 'Food prepared and presented for your event.', note: 'A thoughtful welcome at every place', image: '/images/svc-catering.jpg', focus: '50% 50%' },
  ],
  gallery: [
    { title: 'Wedding table', detail: 'Tablescape', kind: 'wedding', shape: 'portrait', occasion: 'Wedding', image: '/images/wedding.jpg', focus: '55% 50%', alt: 'Round wedding table with tall white calla lilies, tulips, orchids and candles (stock photo placeholder)' },
    { title: 'Dessert display', detail: 'Dessert table', kind: 'dessert', shape: 'landscape', occasion: 'Birthday', image: '/images/dessert.jpg', focus: '50% 82%', alt: 'Dessert table with gold stands, crystal trays and a large white floral arrangement (stock photo placeholder)' },
    { title: 'Baby shower', detail: 'Styling', kind: 'baby', shape: 'square', occasion: 'Baby shower', image: '/images/baby.jpg', focus: '50% 60%', alt: 'Baby shower table with white baby booties on a mirrored tray beside a sage and gold cake (stock photo placeholder)' },
    { title: 'Quinceañera', detail: 'Tablescape', kind: 'quince', shape: 'portrait', occasion: 'Quinceañera', image: '/images/quince.jpg', focus: '50% 70%', alt: 'Round table in blush linen with a rose centerpiece in an elegant ballroom (stock photo placeholder)' },
    { title: 'Dinner party', detail: 'Tablescape', kind: 'dinner', shape: 'landscape', occasion: 'Intimate gathering', image: '/images/dinner.jpg', focus: '40% 55%', alt: 'Long garden dining table with floral runner and string lights at golden hour (stock photo placeholder)' },
    { title: 'Place settings', detail: 'Details', kind: 'detail', shape: 'square', occasion: 'Other', image: '/images/detail.jpg', focus: '50% 62%', alt: 'Place settings with folded napkins and a white floral runner (stock photo placeholder)' },
  ],
  process: [
    { number: '01', title: 'Tell us your plans', description: 'Share the occasion, the date, and your ideas.' },
    { number: '02', title: 'We make a plan', description: 'We put together the styling, desserts, and food.' },
    { number: '03', title: 'Enjoy your party', description: 'We set everything up so you can enjoy it.' },
  ],
  eventTypes: ['Baby shower', 'Birthday', 'Wedding', 'Quinceañera', 'Bridal shower', 'Graduation', 'Corporate event', 'Intimate gathering', 'Other'],
};

siteContent.hero.image = asset(siteContent.hero.image);
siteContent.intro.image = asset(siteContent.intro.image);
[...siteContent.services, ...siteContent.gallery].forEach((item) => { item.image = asset(item.image); });