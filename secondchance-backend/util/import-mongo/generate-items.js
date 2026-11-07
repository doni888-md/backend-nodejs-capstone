const fs = require('fs');

const list = [
  ['Wooden Chair', 'Living'],
  ['Sofa Cushion Set', 'Living'],
  ['Floor Lamp', 'Living'],
  ['Coffee Table', 'Living'],
  ['Bookshelf', 'Office'],
  ['Desk Organizer', 'Office'],
  ['Office Chair', 'Office'],
  ['Single Bed Frame', 'Bedroom'],
  ['Bedside Table', 'Bedroom'],
  ['Wardrobe', 'Bedroom'],
  ['Frying Pan Set', 'Kitchen'],
  ['Toaster', 'Kitchen'],
  ['Dinner Plates', 'Kitchen'],
  ['Bath Towels', 'Bathroom'],
  ['Wall Mirror', 'Bathroom'],
  ['Laundry Basket', 'Bathroom'],
];

const conditions = ['New', 'Like New', 'Older'];

const docs = list.map(([name, category], i) => {
  const age_days = (i + 1) * 40;
  return {
    id: String(i + 1),
    name: name,
    category: category,
    condition: conditions[i % 3],
    age_days: age_days,
    age_years: Number((age_days / 365).toFixed(1)),
    description: `${name} in good shape, free to a good home.`,
    image: `/images/item${i + 1}.jpg`,
    zipcode: '10001',
    date_added: Math.floor(Date.now() / 1000),
    posted_by: 'admin',
  };
});

fs.writeFileSync(`${__dirname}/secondChanceItems.json`, JSON.stringify({ docs }, null, 2));
console.log('Created secondChanceItems.json with', docs.length, 'items');