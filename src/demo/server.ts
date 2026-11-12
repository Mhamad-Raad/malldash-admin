/**
 * Public demo only (portfolio): a fake MallDash API that runs inside the browser. Every request the
 * dashboard makes through axios is answered here from made-up demo data, kept per visitor in
 * localStorage. No real server, account or data is involved. Turned on with VITE_DEMO=true.
 */
import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios';

export const DEMO = import.meta.env.VITE_DEMO === 'true';
export const DEMO_ACCOUNTS = {
  admin: { email: 'admin@malldash.demo', password: 'demo1234' },
  vendor: { email: 'vendor@malldash.demo', password: 'demo1234' },
};
const STORE_KEY = 'malldash-demo-v3';
const SESSION_KEY = 'malldash-demo-session';

// ---------- made-up pictures (inline SVG, nothing downloaded) ----------
const COLORS = ['#e76f51', '#2a9d8f', '#e9c46a', '#264653', '#8d5cf6', '#f4a261', '#3a86ff', '#ef476f', '#06d6a0', '#118ab2'];
const svg = (body: string, bg: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="18" fill="${bg}"/>${body}</svg>`)}`;
const avatar = (first: string, last: string, i: number) =>
  svg(`<text x="60" y="74" font-family="Arial" font-size="44" font-weight="700" fill="#fff" text-anchor="middle">${first[0]}${last[0]}</text>`, COLORS[i % COLORS.length]!);
const emojiPic = (emoji: string, i: number) =>
  svg(`<text x="60" y="82" font-size="62" text-anchor="middle">${emoji}</text>`, `${COLORS[i % COLORS.length]}33`);

// ---------- seed ----------
type Rec = Record<string, any>;
interface Db {
  users: Rec[]; vendors: Rec[]; categories: Rec[]; products: Rec[]; buildings: Rec[];
  orders: Rec[]; notifications: Rec[]; audit: Rec[]; tickets: Rec[]; staff: Rec[]; seq: number;
}
const FIRST = ['Aram', 'Shilan', 'Karwan', 'Hemin', 'Dilan', 'Rebin', 'Sozan', 'Bakhtyar', 'Lana', 'Soran', 'Naz', 'Azad', 'Rozh', 'Hawre', 'Zhino', 'Dara', 'Avin', 'Kawa', 'Bina', 'Shvan'];
const LAST = ['Ahmed', 'Omar', 'Karim', 'Aziz', 'Rashid', 'Hassan', 'Saleh', 'Jamal', 'Mahmood', 'Ali'];
const VENDORS = [
  ['Demo Burger House', 1, '🍔', 'Burgers and fries made to order.'], ['Sample Coffee Bar', 2, '☕', 'Coffee, tea and sweets.'],
  ['Example Fresh Market', 3, '🛒', 'Groceries, fruit and daily needs.'], ['Demo Bakery', 4, '🥐', 'Fresh bread every morning.'],
  ['Sample Pharmacy', 5, '💊', 'Medicine and personal care.'], ['Example Pizza Corner', 1, '🍕', 'Stone-baked pizza.'],
  ['Demo Juice Point', 2, '🧃', 'Fresh juices and smoothies.'], ['Sample Flower Shop', 6, '💐', 'Flowers and gifts.'],
] as const;
const TYPE_NAMES = ['', 'Restaurant', 'Cafe', 'Market', 'Bakery', 'Pharmacy', 'Other'];
const CATS = [['Food', '🍽️'], ['Drinks', '🥤'], ['Groceries', '🧺'], ['Bakery', '🍞'], ['Health', '🩺'], ['Gifts', '🎁']] as const;
const PRODUCTS: Record<number, [string, string, number, number][]> = {
  0: [['Classic Burger', '🍔', 6.5, 0], ['Cheese Burger', '🍔', 7.5, 0], ['French Fries', '🍟', 2.5, 0], ['Chicken Wrap', '🌯', 5.5, 0]],
  1: [['Latte', '☕', 3.5, 1], ['Iced Coffee', '🧋', 4.0, 1], ['Chocolate Cake', '🍰', 4.5, 0], ['Green Tea', '🍵', 2.0, 1]],
  2: [['Apples (1 kg)', '🍎', 2.0, 2], ['Milk 1 L', '🥛', 1.5, 2], ['Rice 5 kg', '🍚', 9.0, 2], ['Eggs (30)', '🥚', 6.0, 2], ['Tomatoes (1 kg)', '🍅', 1.5, 2]],
  3: [['Croissant', '🥐', 1.25, 3], ['Bread Loaf', '🍞', 1.0, 3], ['Bagel', '🥯', 1.0, 3]],
  4: [['Vitamin C', '💊', 8.0, 4], ['Hand Cream', '🧴', 5.0, 4], ['First Aid Kit', '🩹', 15.0, 4]],
  5: [['Margherita Pizza', '🍕', 9.0, 0], ['Pepperoni Pizza', '🍕', 11.0, 0], ['Garlic Bread', '🧄', 3.0, 0]],
  6: [['Orange Juice', '🍊', 3.0, 1], ['Banana Smoothie', '🍌', 3.5, 1], ['Lemonade', '🍋', 2.5, 1]],
  7: [['Rose Bouquet', '🌹', 25.0, 5], ['Gift Box', '🎁', 18.0, 5], ['Tulips', '🌷', 20.0, 5]],
};
const STATUSES = ['Pending', 'Confirmed', 'Preparing', 'OutForDelivery', 'Delivered', 'Cancelled'];

function rand(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
const daysAgo = (d: number, h = 10) => new Date(Date.now() - d * 86_400_000 - h * 3_600_000).toISOString();

function seed(): Db {
  const r = rand(20261112);
  const pick = <T,>(a: readonly T[]) => a[Math.floor(r() * a.length)]!;
  const users: Rec[] = [];
  const mkUser = (first: string, last: string, role: number, email: string, building = '') => {
    const id = `u-${String(users.length + 1).padStart(4, '0')}`;
    const u: Rec = { id, _id: id, userId: id, firstName: first, lastName: last, email, role, phoneNumber: `0750 000 ${String(1000 + users.length).slice(-4)}`,
      profileImageUrl: avatar(first, last, users.length), buildingName: building, isActive: true };
    u['phone'] = u.phoneNumber;
    users.push(u);
    return u;
  };
  mkUser('Demo', 'Admin', 1, DEMO_ACCOUNTS.admin.email);
  const vendorOwner = mkUser('Demo', 'Vendor', 2, DEMO_ACCOUNTS.vendor.email);
  // Buildings with floors and apartments; tenants live in some of them.
  const buildings: Rec[] = [];
  let aptId = 1, floorId = 1;
  ['Tower A', 'Tower B', 'Garden Residence', 'Sky View'].forEach((name, b) => {
    const floors: Rec[] = [];
    for (let f = 1; f <= 4 + b; f++) {
      const apartments: Rec[] = [];
      for (let a = 1; a <= 4; a++) {
        let occupant = null;
        if (r() < 0.6) {
          const fn = pick(FIRST), ln = pick(LAST);
          const t = mkUser(fn, ln, 3, `${fn}.${ln}${users.length}@example.com`.toLowerCase(), name);
          occupant = { id: t.id, name: `${fn} ${ln}`, email: t.email };
        }
        apartments.push({ id: aptId++, apartmentName: `${f}0${a}`, occupant });
      }
      floors.push({ id: floorId++, floorNumber: f, apartments });
    }
    buildings.push({ id: b + 1, name, floors });
  });
  const vendors = VENDORS.map(([name, type, emoji, description], i) => {
    const owner = i === 0 ? vendorOwner : mkUser(pick(FIRST), pick(LAST), 2, `owner${i + 1}@example.com`);
    return { id: i + 1, name, description, type: TYPE_NAMES[type], typeId: type, profileImageUrl: emojiPic(emoji, i),
      openingTime: `0${7 + (i % 3)}:00:00`, closeTime: `${21 + (i % 3)}:00:00`, userId: owner.id, firstName: owner.firstName,
      lastName: owner.lastName, phone: owner.phoneNumber, email: owner.email, userEmail: owner.email, userProfileImageUrl: owner.profileImageUrl };
  });
  for (let d = 0; d < 3; d++) mkUser(pick(FIRST), pick(LAST), 4, `driver${d + 1}@example.com`);
  const categories = CATS.map(([name, emoji], i) => ({ id: i + 1, name, description: `${name} products`, imageUrl: emojiPic(emoji, i) }));
  let pid = 1;
  const products: Rec[] = [];
  vendors.forEach((v, vi) => (PRODUCTS[vi] ?? []).forEach(([name, emoji, price, cat], k) => {
    products.push({ id: pid, _id: String(pid), name, description: `${name} from ${v.name}.`, price, discountPrice: k === 1 ? Math.round(price * 85) / 100 : null,
      inStock: r() > 0.12, isWeightable: name.includes('kg'), productImageUrl: emojiPic(emoji, pid), imageUrl: emojiPic(emoji, pid),
      vendorId: v.id, vendorName: v.name, categoryId: cat + 1, categoryName: CATS[cat]![0] });
    pid++;
  }));
  const tenants = users.filter((u) => u.role === 3);
  const apartmentsOf = buildings.flatMap((b) => b.floors.flatMap((f: Rec) => f.apartments.filter((a: Rec) => a.occupant).map((a: Rec) => ({ b, f, a }))));
  const orders: Rec[] = [];
  for (let i = 0; i < 60; i++) {
    const v = vendors[i < 3 || i % 5 === 0 ? 0 : Math.floor(r() * vendors.length)]!;
    const vp = products.filter((p) => p.vendorId === v.id);
    const where = pick(apartmentsOf);
    const tenant = tenants.find((t) => t.id === where.a.occupant.id) ?? pick(tenants);
    const items = Array.from({ length: 1 + Math.floor(r() * 3) }, (_, k) => {
      const p = pick(vp); const q = 1 + Math.floor(r() * 3); const unit = p.discountPrice ?? p.price;
      return { id: i * 10 + k + 1, orderId: i + 1, productId: p.id, productName: p.name, productImageUrl: p.productImageUrl, quantity: q, unitPrice: unit, totalPrice: unit * q };
    });
    const subtotal = items.reduce((s, it) => s + it.totalPrice, 0);
    const age = i < 3 ? 0 : Math.floor(r() * 30);
    const status = age === 0 ? pick(STATUSES.slice(0, 4)) : r() < 0.88 ? 'Delivered' : 'Cancelled';
    orders.push({ id: i + 1, orderNumber: `ORD-${String(1000 + i + 1)}`, userId: tenant.id, userEmail: tenant.email, userPhone: tenant.phoneNumber,
      customerName: `${tenant.firstName} ${tenant.lastName}`, userName: `${tenant.firstName} ${tenant.lastName}`, vendorId: v.id, vendorName: v.name,
      deliveryAddress: { id: where.a.id, buildingName: where.b.name, floorNumber: where.f.floorNumber, apartmentName: where.a.apartmentName },
      subtotal: Math.round(subtotal * 100) / 100, deliveryFee: 1.5, totalAmount: Math.round((subtotal + 1.5) * 100) / 100, status, notes: r() < 0.2 ? 'Please ring the bell.' : '', createdAt: daysAgo(age, Math.floor(r() * 10)),
      completedAt: status === 'Delivered' ? daysAgo(age, 1) : undefined, items, itemCount: items.length });
  }
  orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const notifications = [
    ['New order', 'Order ORD-1060 was placed at Demo Burger House.', 'Info'], ['Vendor added', 'Demo Juice Point joined the mall.', 'Success'],
    ['Low stock', 'Sample Pharmacy is out of First Aid Kits.', 'Warning'], ['Support ticket', 'A tenant opened a new support ticket.', 'Info'],
    ['System update', 'The dashboard was updated to the latest version.', 'System'],
  ].map(([title, message, type], i) => ({ id: i + 1, title, message, type, isRead: i > 2, createdAt: daysAgo(i, 2) }));
  const audit = Array.from({ length: 40 }, (_, i) => {
    const kinds = [['Product', 'Update', { price: [6000, 6500] }], ['Vendor', 'Create', { name: [null, 'Demo Juice Point'] }], ['User', 'Update', { phoneNumber: ['0750 000 1001', '0750 000 1002'] }], ['Order', 'Update', { status: ['Preparing', 'OutForDelivery'] }], ['Building', 'Create', { name: [null, 'Sky View'] }]] as const;
    const [entityName, action, change] = kinds[i % kinds.length]!;
    const oldValues: Rec = {}, newValues: Rec = {};
    Object.entries(change).forEach(([k, [o, n]]) => { if (o !== null) oldValues[k] = o; newValues[k] = n; });
    return { id: i + 1, userId: users[0]!.id, userEmail: users[0]!.email, profileImageUrl: users[0]!.profileImageUrl, entityName, entityId: String(1 + (i % 9)), action,
      oldValues, newValues, affectedColumns: Object.keys(change), timestamp: daysAgo(Math.floor(i / 2), i % 8), ipAddress: '10.0.0.1', userAgent: 'Demo browser' };
  });
  const tickets = [
    ['Elevator in Tower A is slow', 2, 1], ['Order arrived cold', 1, 0], ['Cannot change my phone number', 0, 2], ['Parking spot request', 1, 3], ['Water leak on floor 3', 3, 1],
  ].map(([subject, priority, status], i) => {
    const t = tenants[i % tenants.length]!;
    return { id: i + 1, ticketNumber: `TCK-${200 + i + 1}`, subject, status, priority, createdAt: daysAgo(i * 2, 3), resolvedAt: status === 2 || status === 3 ? daysAgo(i, 1) : null,
      userId: t.id, userName: `${t.firstName} ${t.lastName}`, userEmail: t.email, description: `${subject}. Please take a look when you can.`, adminNotes: null, imageUrls: [] };
  });
  const staff = [['Rebin', 'Karim'], ['Lana', 'Omar']].map(([f, l]) => {
    const u = mkUser(f!, l!, 2, `${f!.toLowerCase()}.staff@example.com`);
    return { ...u, vendorId: 1, isActive: true };
  });
  return { users, vendors, categories, products, buildings, orders, notifications, audit, tickets, staff, seq: 10_000 };
}

// ---------- store ----------
let db: Db;
function load(): Db {
  try {
    if (new URLSearchParams(location.search).has('reset')) localStorage.removeItem(STORE_KEY);
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) return JSON.parse(saved) as Db;
  } catch { /* storage blocked: start fresh */ }
  return seed();
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); } catch { /* ignore */ }
}
const session = {
  get: (): string | null => { try { return localStorage.getItem(SESSION_KEY); } catch { return null; } },
  set: (v: string | null) => { try { if (v) localStorage.setItem(SESSION_KEY, v); else localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ } },
};

// ---------- helpers ----------
const nextId = () => ++db.seq;
const lower = (v: unknown) => String(v ?? '').toLowerCase();
function page<T>(rows: T[], params: Rec) {
  const p = Number(params['page'] ?? 1) || 1, l = Number(params['limit'] ?? params['take'] ?? 10) || 10;
  return { data: rows.slice((p - 1) * l, p * l), page: p, limit: l, total: rows.length };
}
function bodyOf(config: AxiosRequestConfig): Rec {
  const d = config.data;
  if (!d) return {};
  if (typeof FormData !== 'undefined' && d instanceof FormData) {
    const o: Rec = {};
    d.forEach((v, k) => { o[k.charAt(0).toLowerCase() + k.slice(1)] = v; });
    return o;
  }
  if (typeof d === 'string') { try { return JSON.parse(d); } catch { return {}; } }
  return d as Rec;
}
async function imageOf(v: unknown): Promise<string | undefined> {
  if (typeof File !== 'undefined' && v instanceof File) {
    return new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result)); fr.onerror = () => res(undefined); fr.readAsDataURL(v); });
  }
  return undefined;
}
const me = () => db.users.find((u) => u.email === session.get());
const myVendor = () => db.vendors.find((v) => v.userId === me()?.id) ?? db.vendors[0]!;
const buildingList = () => db.buildings.map((b) => {
  const apts = b.floors.flatMap((f: Rec) => f.apartments);
  return { id: b.id, name: b.name, numberOfFloors: b.floors.length, totalApartments: apts.length, occupants: apts.filter((a: Rec) => a.occupant).length };
});
function audit(entityName: string, entityId: unknown, action: string, newValues: Rec) {
  const u = me();
  db.audit.unshift({ id: nextId(), userId: u?.id, userEmail: u?.email, profileImageUrl: u?.profileImageUrl, entityName, entityId: String(entityId), action,
    oldValues: {}, newValues, affectedColumns: Object.keys(newValues), timestamp: new Date().toISOString(), ipAddress: '10.0.0.1', userAgent: 'Demo browser' });
}
function orderFilter(rows: Rec[], q: Rec) {
  return rows.filter((o) => (!q['status'] || o.status === q['status'] || String(STATUSES.indexOf(o.status)) === String(q['status']))
    && (!q['vendorId'] || o.vendorId === Number(q['vendorId']))
    && (!q['search'] || lower(o.orderNumber + o.customerName + o.vendorName).includes(lower(q['search']))));
}

// ---------- routes ----------
type Handler = (m: RegExpMatchArray, q: Rec, b: Rec, c: AxiosRequestConfig) => unknown | Promise<unknown>;
class HttpError {
  status: number;
  data: unknown;
  constructor(status: number, data: unknown) {
    this.status = status;
    this.data = data;
  }
}
const routes: [string, RegExp, Handler][] = [];
const on = (method: string, path: string, h: Handler) => routes.push([method, new RegExp(`^${path.replace(/:id\b/g, '([^/]+)')}/?$`, 'i'), h]);
const authed = () => { if (!me()) throw new HttpError(401, { message: 'Not signed in' }); };

on('post', '/Account/login', (_m, _q, b) => {
  const user = db.users.find((u) => lower(u.email) === lower(b['email']));
  const ok = Object.values(DEMO_ACCOUNTS).some((a) => lower(a.email) === lower(b['email']) && a.password === b['password']);
  if (!user || !ok) throw new HttpError(400, { error: 'Email or password is incorrect', errors: [] });
  session.set(user.email);
  const exp = new Date(Date.now() + 86_400_000).toISOString();
  return { accessToken: 'demo-token', refreshToken: 'demo-refresh', accessTokenExpiresAt: exp, refreshTokenExpiresAt: exp, user,
    vendorProfile: user.role === 2 ? myVendor() : null };
});
on('post', '/Account/logout', () => { session.set(null); return { success: true }; });
on('post', '/Account/(?:Web/refresh|NewRefreshToken)', () => { authed(); return { success: true }; });
on('post', '/Account/(?:forgot-password|reset-password)', () => ({ message: 'In this demo no e-mail is sent.' }));
on('get', '/Account/me', () => { authed(); return { user: me(), vendorProfile: me()!.role === 2 ? myVendor() : null }; });
on('put', '/Account/me', async (_m, _q, b) => { authed(); const u = me()!; Object.assign(u, pickUser(b), { profileImageUrl: (await imageOf(b['profileImageUrl'])) ?? u.profileImageUrl }); return u; });
on('get', '/Account/users', (_m, q) => { authed(); return page(db.users.filter((u) =>
  (q['role'] === undefined || String(u.role) === String(q['role'])) && (!q['searchTerm'] || lower(u.firstName + ' ' + u.lastName + u.email).includes(lower(q['searchTerm'])))
  && (!q['buildingNameSearch'] || lower(u.buildingName).includes(lower(q['buildingNameSearch'])))), q); });
on('get', '/Account/user/:id', (m) => db.users.find((u) => u.id === m[1]) ?? notFound());
on('put', '/Account/:id', async (m, _q, b) => { const u = db.users.find((x) => x.id === m[1]) ?? notFound(); Object.assign(u, pickUser(b)); const img = await imageOf(b['profileImageUrl']); if (img) u['profileImageUrl'] = img; audit('User', u['id'], 'Update', pickUser(b)); return u; });
on('delete', '/Account/:id', (m) => { if (m[1] === me()?.id) throw new HttpError(400, { error: 'You cannot delete your own account in the demo.' }); db.users = db.users.filter((u) => u.id !== m[1]); db.staff = db.staff.filter((u) => u.id !== m[1]); return { success: true }; });
on('post', '/Account/register', async (_m, _q, b) => {
  const id = `u-${nextId()}`; const first = String(b['firstName'] ?? 'New'), last = String(b['lastName'] ?? 'User');
  const u = { id, _id: id, userId: id, firstName: first, lastName: last, email: String(b['email'] ?? `${id}@example.com`), role: Number(b['role'] ?? 3),
    phoneNumber: String(b['phoneNumber'] ?? ''), phone: String(b['phoneNumber'] ?? ''), profileImageUrl: (await imageOf(b['profileImageUrl'])) ?? avatar(first, last, db.users.length), buildingName: '', isActive: true };
  db.users.push(u); audit('User', id, 'Create', { email: u.email }); return { user: u, ...u };
});
function pickUser(b: Rec) {
  const o: Rec = {};
  for (const k of ['firstName', 'lastName', 'email', 'phoneNumber', 'role', 'isActive']) if (b[k] !== undefined && b[k] !== '') o[k] = k === 'role' ? Number(b[k]) : k === 'isActive' ? String(b[k]) === 'true' : b[k];
  if (o['phoneNumber']) o['phone'] = o['phoneNumber'];
  return o;
}
function notFound(): never { throw new HttpError(404, { error: 'Not found' }); }

on('get', '/Dashboard/admin', () => {
  const apts = db.buildings.flatMap((b) => b.floors.flatMap((f: Rec) => f.apartments));
  return { totalUsers: db.users.length, activeVendors: db.vendors.length, totalBuildings: db.buildings.length, totalApartments: apts.length,
    occupiedApartments: apts.filter((a: Rec) => a.occupant).length, totalProducts: db.products.length, pendingRequests: db.tickets.filter((t) => t.status === 0 || t.status === 1).length };
});
on('get', '/Vendor/dashboard', () => {
  authed(); const v = myVendor(); const mine = db.orders.filter((o) => o.vendorId === v.id && o.status !== 'Cancelled');
  const today = new Date().toISOString().slice(0, 10);
  const dailyStats = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(Date.now() - (6 - i) * 86_400_000).toISOString().slice(0, 10);
    const list = mine.filter((o) => o.createdAt.slice(0, 10) === day);
    return { day, orders: list.length, profit: list.reduce((s, o) => s + o.subtotal, 0) };
  });
  return { totalOrders: mine.length, pendingOrders: mine.filter((o) => o.status !== 'Delivered').length, completedOrders: mine.filter((o) => o.status === 'Delivered').length,
    totalProducts: db.products.filter((p) => p.vendorId === v.id).length, totalRevenue: mine.reduce((s, o) => s + o.subtotal, 0),
    todayRevenue: mine.filter((o) => o.createdAt.slice(0, 10) === today).reduce((s, o) => s + o.subtotal, 0), todayOrders: mine.filter((o) => o.createdAt.slice(0, 10) === today).length, dailyStats };
});

on('get', '/Vendor', (_m, q) => page(db.vendors.filter((v) => (!q['searchName'] || lower(v.name).includes(lower(q['searchName']))) && (!q['type'] || v.typeId === Number(q['type']))), q));
on('get', '/Vendor/me', () => { authed(); return myVendor(); });
on('put', '/Vendor/profile', async (_m, _q, b) => { authed(); const v = myVendor(); applyVendor(v, b); const img = await imageOf(b['profileImageUrl']); if (img) v['profileImageUrl'] = img; return v; });
on('get', '/Vendor/:id', (m) => db.vendors.find((v) => v.id === Number(m[1])) ?? notFound());
on('post', '/Vendor', async (_m, _q, b) => {
  const owner = db.users.find((u) => u.id === b['userId']) ?? me()!;
  const v: Rec = { id: nextId(), userId: owner.id, firstName: owner.firstName, lastName: owner.lastName, phone: owner.phoneNumber, email: owner.email, userEmail: owner.email, userProfileImageUrl: owner.profileImageUrl, profileImageUrl: null };
  applyVendor(v, b); v['profileImageUrl'] = (await imageOf(b['profileImageUrl'])) ?? emojiPic('🏪', v['id']);
  db.vendors.push(v); audit('Vendor', v['id'], 'Create', { name: v['name'] }); return v;
});
on('put', '/Vendor/:id', async (m, _q, b) => { const v = db.vendors.find((x) => x.id === Number(m[1])) ?? notFound(); applyVendor(v, b); const img = await imageOf(b['profileImageUrl']); if (img) v['profileImageUrl'] = img; audit('Vendor', v['id'], 'Update', { name: v['name'] }); return v; });
on('delete', '/Vendor/:id', (m) => { db.vendors = db.vendors.filter((v) => v.id !== Number(m[1])); return { success: true }; });
function applyVendor(v: Rec, b: Rec) {
  for (const k of ['name', 'description', 'openingTime', 'closeTime']) if (b[k]) v[k] = k.endsWith('Time') && String(b[k]).length === 5 ? `${b[k]}:00` : b[k];
  if (b['type'] !== undefined) { const t = Number(b['type']); if (t) { v['typeId'] = t; v['type'] = TYPE_NAMES[t] ?? 'Other'; } }
  if (b['phone']) v['phone'] = b['phone'];
}

on('get', '/Category', (_m, q) => db.categories.filter((c) => !q['searchName'] || lower(c.name).includes(lower(q['searchName']))));
on('get', '/Category/:id', (m) => db.categories.find((c) => c.id === Number(m[1])) ?? notFound());

const productFilter = (rows: Rec[], q: Rec) => rows.filter((p) => (!q['vendorId'] || p.vendorId === Number(q['vendorId'])) && (!q['categoryId'] || p.categoryId === Number(q['categoryId']))
  && (!q['searchName'] || lower(p.name).includes(lower(q['searchName']))) && (q['inStock'] === undefined || String(p.inStock) === String(q['inStock'])));
on('get', '/Product', (_m, q) => page(productFilter(db.products, q), q));
on('get', '/Product/my-products', (_m, q) => { authed(); return page(productFilter(db.products.filter((p) => p.vendorId === myVendor().id), q), q); });
on('get', '/Product/my-products/:id', (m) => db.products.find((p) => p.id === Number(m[1])) ?? notFound());
on('get', '/Product/:id', (m) => db.products.find((p) => p.id === Number(m[1])) ?? notFound());
on('post', '/Product', async (_m, _q, b) => {
  const v = me()?.role === 2 ? myVendor() : db.vendors.find((x) => x.id === Number(b['vendorId'])) ?? db.vendors[0]!;
  const p: Rec = { id: nextId(), vendorId: v.id, vendorName: v.name };
  applyProduct(p, b); p['productImageUrl'] = p['imageUrl'] = (await imageOf(b['productImageUrl'] ?? b['image'] ?? b['imageFile'])) ?? emojiPic('📦', p['id']);
  db.products.unshift(p); audit('Product', p['id'], 'Create', { name: p['name'] }); return p;
});
on('put', '/Product/(?:admin/)?:id', async (m, _q, b) => {
  const p = db.products.find((x) => x.id === Number(m[1])) ?? notFound(); applyProduct(p, b);
  const img = await imageOf(b['productImageUrl'] ?? b['image'] ?? b['imageFile']); if (img) p['productImageUrl'] = p['imageUrl'] = img;
  audit('Product', p['id'], 'Update', { name: p['name'], price: p['price'] }); return p;
});
on('delete', '/Product/(?:admin/)?:id', (m) => { db.products = db.products.filter((p) => p.id !== Number(m[1])); return null; });
function applyProduct(p: Rec, b: Rec) {
  if (b['name']) p['name'] = b['name'];
  if (b['description'] !== undefined) p['description'] = b['description'];
  if (b['price'] !== undefined && b['price'] !== '') p['price'] = Number(b['price']);
  if (b['discountPrice'] !== undefined) p['discountPrice'] = b['discountPrice'] === '' || b['discountPrice'] === 'null' ? null : Number(b['discountPrice']);
  for (const k of ['inStock', 'isWeightable']) if (b[k] !== undefined) p[k] = String(b[k]) === 'true';
  if (b['categoryId']) { p['categoryId'] = Number(b['categoryId']); p['categoryName'] = db.categories.find((c) => c.id === p['categoryId'])?.name ?? null; }
  p['_id'] = String(p['id']); p['inStock'] ??= true; p['isWeightable'] ??= false; p['discountPrice'] ??= null; p['price'] ??= 0;
}

on('get', '/Order', (_m, q) => { authed(); const rows = me()!.role === 2 ? db.orders.filter((o) => o.vendorId === myVendor().id) : db.orders; return page(orderFilter(rows, q), q); });
on('get', '/Order/:id', (m) => db.orders.find((o) => o.id === Number(m[1])) ?? notFound());
on('put', '/Order/:id/status', (m, _q, b) => {
  const o = db.orders.find((x) => x.id === Number(m[1])) ?? notFound();
  const s = b['status']; o['status'] = typeof s === 'number' ? STATUSES[s] ?? o['status'] : s;
  if (o['status'] === 'Delivered') o['completedAt'] = new Date().toISOString();
  audit('Order', o['id'], 'Update', { status: o['status'] }); return o;
});

on('get', '/Building', (_m, q) => page(buildingList().filter((b) => !q['searchName'] || lower(b.name).includes(lower(q['searchName']))), q));
on('get', '/Building/:id', (m) => db.buildings.find((b) => b.id === Number(m[1])) ?? notFound());
on('post', '/Building', (_m, _q, b) => {
  const floors = (Array.isArray(b['floors']) ? b['floors'] : []).map((f: Rec) => ({ id: nextId(), floorNumber: Number(f['floorNumber']),
    apartments: Array.from({ length: Number(f['numberOfApartments']) || 0 }, (_, i) => ({ id: nextId(), apartmentName: `${f['floorNumber']}0${i + 1}`, occupant: null })) }));
  const bld = { id: nextId(), name: String(b['name'] ?? 'New building'), floors }; db.buildings.push(bld); audit('Building', bld.id, 'Create', { name: bld.name }); return bld;
});
on('put', '/Building/BuildingName/:id', (m, _q, b) => { const bld = db.buildings.find((x) => x.id === Number(m[1])) ?? notFound(); bld['name'] = b['name']; return bld; });
on('delete', '/Building/:id', (m) => { db.buildings = db.buildings.filter((b) => b.id !== Number(m[1])); return { success: true }; });
on('post', '/Building/:id/floor', (m) => { const bld = db.buildings.find((x) => x.id === Number(m[1])) ?? notFound(); const f = { id: nextId(), floorNumber: bld['floors'].length + 1, apartments: [] }; bld['floors'].push(f); return f; });
on('delete', '/Building/floor/:id', (m) => { db.buildings.forEach((b) => { b.floors = b.floors.filter((f: Rec) => f.id !== Number(m[1])); }); return { success: true }; });
on('post', '/Building/floor/:id/apartment', (m, _q, b) => { const f = db.buildings.flatMap((x) => x.floors).find((x: Rec) => x.id === Number(m[1])) ?? notFound(); const a = { id: nextId(), apartmentName: b['apartmentName'], occupant: null }; f.apartments.push(a); return a; });
on('put', '/Building/apartment/:id', (m, _q, b) => {
  const a = db.buildings.flatMap((x) => x.floors.flatMap((f: Rec) => f.apartments)).find((x: Rec) => x.id === Number(m[1])) ?? notFound();
  a['apartmentName'] = b['apartmentName'] ?? a['apartmentName'];
  const u = db.users.find((x) => x.id === b['userId']); a['occupant'] = u ? { id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email } : null; return a;
});
on('delete', '/Building/apartment/:id', (m) => { db.buildings.forEach((b) => b.floors.forEach((f: Rec) => { f.apartments = f.apartments.filter((a: Rec) => a.id !== Number(m[1])); })); return { success: true }; });

on('get', '/Notification', (_m, q) => db.notifications.slice(Number(q['skip'] ?? 0), Number(q['skip'] ?? 0) + Number(q['take'] ?? 20)));
on('get', '/Notification/unread-count', () => ({ count: db.notifications.filter((n) => !n.isRead).length }));
on('put', '/Notification/mark-all-read', () => { db.notifications.forEach((n) => { n.isRead = true; }); return null; });
on('put', '/Notification/:id/read', (m) => { const n = db.notifications.find((x) => x.id === Number(m[1])); if (n) n.isRead = true; return null; });
on('delete', '/Notification/:id', (m) => { db.notifications = db.notifications.filter((n) => n.id !== Number(m[1])); return null; });

on('get', '/Audit', (_m, q) => page(db.audit.filter((a) => (!q['entityName'] || a.entityName === q['entityName']) && (!q['action'] || a.action === q['action'])
  && (!q['fromDate'] || a.timestamp >= q['fromDate']) && (!q['toDate'] || a.timestamp <= q['toDate'])), q));
on('get', '/Audit/:id', (m) => db.audit.find((a) => String(a.id) === m[1]) ?? notFound());

on('get', '/SupportTicket', (_m, q) => page(db.tickets.filter((t) => (q['status'] === undefined || String(t.status) === String(q['status'])) && (!q['search'] || lower(t.subject + t.ticketNumber).includes(lower(q['search'])))), q));
on('get', '/SupportTicket/:id', (m) => db.tickets.find((t) => t.id === Number(m[1])) ?? notFound());
on('put', '/SupportTicket/:id/status', (m, _q, b) => { const t = db.tickets.find((x) => x.id === Number(m[1])) ?? notFound(); t['status'] = Number(b['status']); t['adminNotes'] = b['adminNotes'] ?? null; if (t['status'] >= 2) t['resolvedAt'] = new Date().toISOString(); return t; });

on('get', '/VendorStaff/my-staff', (_m, q) => { authed(); return page(db.staff.filter((s) => !q['searchTerm'] || lower(s.firstName + ' ' + s.lastName + s.email).includes(lower(q['searchTerm']))), q); });
on('get', '/VendorStaff/:id', (m) => db.staff.find((s) => s.id === m[1] || String(s.userId) === m[1]) ?? notFound());
on('post', '/VendorStaff', async (_m, _q, b) => {
  const id = `u-${nextId()}`; const first = String(b['firstName'] ?? 'New'), last = String(b['lastName'] ?? 'Staff');
  const s = { id, _id: id, userId: id, firstName: first, lastName: last, email: String(b['email'] ?? `${id}@example.com`), role: 2, phoneNumber: String(b['phoneNumber'] ?? ''), phone: String(b['phoneNumber'] ?? ''),
    profileImageUrl: (await imageOf(b['profileImageUrl'])) ?? avatar(first, last, db.staff.length + 3), buildingName: '', isActive: true, vendorId: myVendor().id };
  db.staff.push(s); return s;
});
on('put', '/VendorStaff/:id', (m, _q, b) => { const s = db.staff.find((x) => x.id === m[1]) ?? notFound(); Object.assign(s, pickUser(b)); return s; });
on('delete', '/VendorStaff/:id', (m) => { db.staff = db.staff.filter((s) => s.id !== m[1]); return null; });

// ---------- the axios adapter ----------
export const demoAdapter: AxiosAdapter = async (config) => {
  db ??= load();
  const url = new URL(config.url ?? '', 'http://demo.local/');
  const path = url.pathname.replace(/^.*?\/MalDashApi/i, '').replace(/^\/api/i, '') || '/';
  const q: Rec = { ...Object.fromEntries(url.searchParams), ...(config.params ?? {}) };
  for (const k of Object.keys(q)) if (q[k] === undefined || q[k] === null || q[k] === '') delete q[k];
  const method = (config.method ?? 'get').toLowerCase();
  await new Promise((r) => setTimeout(r, 120 + Math.random() * 180));
  const reply = (status: number, data: unknown): AxiosResponse => ({ data, status, statusText: String(status), headers: {}, config: config as never, request: {} });
  for (const [m, re, h] of routes) {
    const match = path.match(re);
    if (m !== method || !match) continue;
    try {
      const data = await h(match, q, bodyOf(config), config);
      save();
      return reply(data === null ? 204 : 200, data);
    } catch (e) {
      if (e instanceof HttpError) {
        const err: any = new Error(`Request failed with status code ${e.status}`);
        err.response = reply(e.status, e.data); err.config = config; err.isAxiosError = true;
        throw err;
      }
      throw e;
    }
  }
  console.warn('[demo] no fake answer for', method.toUpperCase(), path);
  return reply(200, {});
};

/** Clears this visitor's demo data and signs them out. */
export function resetDemo(): void {
  try { localStorage.removeItem(STORE_KEY); localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  location.href = '/login';
}
