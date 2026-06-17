// ---------- price data (mock) ----------
// In production this comes from flyer_extractions JSONB + Billa product API.

const STORES = {
  hofer: { id: "hofer", name: "Hofer",  address: "Mariahilfer Straße 120, 1070 Wien", area: "Neubau",      walk: "4 min", color: "#d8462a" },
  lidl:  { id: "lidl",  name: "Lidl",   address: "Landstraßer Hauptstr. 1b, 1030 Wien", area: "Landstraße", walk: "9 min", color: "#2a64b4" },
  spar:  { id: "spar",  name: "Spar",   address: "Neubaugasse 25, 1070 Wien",          area: "Neubau",      walk: "6 min", color: "#1f8a5b" },
  billa: { id: "billa", name: "Billa",  address: "Westbahnstraße 35, 1070 Wien",        area: "Neubau",      walk: "7 min", color: "#e0a43a" },
};

// regular = "statt" price, promo = best current promotional price, store = where it's cheapest
const CATALOG = [
  { id: "parmesan", name: "Parmigiano Reggiano", unit: "80 g",   cat: "Käse",     regular: 2.99, promo: 2.29, store: "hofer", emoji: "🧀" },
  { id: "milch",    name: "Frische Bio-Milch",   unit: "1 L",    cat: "Molkerei", regular: 1.39, promo: 0.99, store: "hofer", emoji: "🥛" },
  { id: "bananen",  name: "Bananen",             unit: "1 kg",   cat: "Obst",     regular: 1.79, promo: 1.29, store: "lidl",  emoji: "🍌" },
  { id: "kaffee",   name: "Kaffee, ganze Bohne", unit: "500 g",  cat: "Kaffee",   regular: 7.49, promo: 4.99, store: "spar",  emoji: "☕" },
  { id: "eier",     name: "Freiland-Eier",       unit: "10 Stk", cat: "Molkerei", regular: 3.49, promo: 2.79, store: "hofer", emoji: "🥚" },
  { id: "butter",   name: "Teebutter",           unit: "250 g",  cat: "Molkerei", regular: 2.79, promo: 1.99, store: "billa", emoji: "🧈" },
  { id: "brot",     name: "Bauernbrot",          unit: "1 kg",   cat: "Backwaren",regular: 3.29, promo: 2.49, store: "spar",  emoji: "🍞" },
  { id: "aepfel",   name: "Äpfel, Gala",         unit: "1 kg",   cat: "Obst",     regular: 2.49, promo: 1.79, store: "hofer", emoji: "🍎" },
  { id: "huhn",     name: "Hühnerfilet",         unit: "500 g",  cat: "Fleisch",  regular: 6.49, promo: 4.49, store: "lidl",  emoji: "🍗" },
  { id: "joghurt",  name: "Naturjoghurt",        unit: "500 g",  cat: "Molkerei", regular: 1.49, promo: 0.99, store: "hofer", emoji: "🥣" },
  { id: "olivenoel",name: "Olivenöl extra",      unit: "750 ml", cat: "Vorrat",   regular: 8.99, promo: 6.49, store: "billa", emoji: "🫒" },
  { id: "pasta",    name: "Pasta Penne",         unit: "500 g",  cat: "Vorrat",   regular: 1.69, promo: 0.89, store: "hofer", emoji: "🍝" },
  { id: "tomaten",  name: "Rispentomaten",       unit: "500 g",  cat: "Gemüse",   regular: 2.29, promo: 1.69, store: "spar",  emoji: "🍅" },
  { id: "kaese",    name: "Bergkäse",            unit: "200 g",  cat: "Käse",     regular: 3.99, promo: 2.99, store: "hofer", emoji: "🧀" },
  { id: "saft",     name: "Orangensaft",         unit: "1 L",    cat: "Getränke", regular: 2.19, promo: 1.49, store: "lidl",  emoji: "🍊" },
  { id: "muesli",   name: "Bircher Müsli",       unit: "750 g",  cat: "Vorrat",   regular: 3.79, promo: 2.79, store: "hofer", emoji: "🥫" },
  { id: "spinat",   name: "Babyspinat",          unit: "200 g",  cat: "Gemüse",   regular: 2.49, promo: 1.89, store: "billa", emoji: "🥬" },
  { id: "lachs",    name: "Räucherlachs",        unit: "100 g",  cat: "Fisch",    regular: 3.99, promo: 2.79, store: "spar",  emoji: "🐟" },
];

const fmt = (n) => "€" + n.toFixed(2);
const savingsOf = (p) => Math.max(0, p.regular - p.promo);
const discountPct = (p) => Math.round((1 - p.promo / p.regular) * 100);

// Basket optimiser: group items by their cheapest store, recommend the store
// covering the most items, then one second stop. Max 2 stops (per the plan).
function optimiseBasket(items) {
  if (!items.length) return { stops: [], leftover: [], totalSaving: 0, totalSpend: 0 };
  const byStore = {};
  items.forEach((it) => {
    (byStore[it.store] = byStore[it.store] || []).push(it);
  });
  // rank stores by item count, then by savings
  const ranked = Object.keys(byStore)
    .map((sid) => {
      const list = byStore[sid];
      return {
        store: STORES[sid],
        items: list,
        saving: list.reduce((s, p) => s + savingsOf(p), 0),
        spend: list.reduce((s, p) => s + p.promo, 0),
      };
    })
    .sort((a, b) => b.items.length - a.items.length || b.saving - a.saving);

  const stops = ranked.slice(0, 2);
  const leftover = ranked.slice(2).flatMap((r) => r.items);
  // fold any leftover items into the 2nd stop so nothing is lost in the demo
  if (leftover.length && stops[1]) {
    stops[1] = {
      ...stops[1],
      items: [...stops[1].items, ...leftover],
      saving: stops[1].saving + leftover.reduce((s, p) => s + savingsOf(p), 0),
      spend: stops[1].spend + leftover.reduce((s, p) => s + p.promo, 0),
    };
  }
  const totalSaving = items.reduce((s, p) => s + savingsOf(p), 0);
  const totalSpend = items.reduce((s, p) => s + p.promo, 0);
  return { stops, leftover: stops[1] ? [] : leftover, totalSaving, totalSpend, covered: items.length };
}

Object.assign(window, { STORES, CATALOG, fmt, savingsOf, discountPct, optimiseBasket });
