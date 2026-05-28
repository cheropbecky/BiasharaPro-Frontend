import initSqlJs from 'sql.js';

const STORAGE_KEY = 'biasharapro_db_v1';
let SQL = null;
let db = null;

async function initDB() {
  if (db) return db;
  SQL = await initSqlJs({ locateFile: file => `/node_modules/sql.js/dist/${file}` });

  // Try to load from localStorage
  const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
  if (saved) {
    try {
      const binaryString = atob(saved);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
      db = new SQL.Database(bytes);
    } catch (e) {
      console.error('Failed to load saved DB, creating new one', e);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  // Ensure schema exists
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      buy REAL,
      sell REAL,
      stock INTEGER DEFAULT 0,
      min_stock INTEGER DEFAULT 0
    );
  `);

  // sales table
  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      qty INTEGER,
      unit_price REAL,
      total REAL,
      payment_method TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(product_id) REFERENCES products(id)
    );
  `);

  // expenses table
  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT,
      category TEXT,
      amount REAL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Persist any new DB state
  persist();

  return db;
}

function persist() {
  if (!db || typeof window === 'undefined') return;
  const data = db.export();
  let binary = '';
  const len = data.length;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(data[i]);
  const base64 = btoa(binary);
  window.localStorage.setItem(STORAGE_KEY, base64);
}

async function getProducts() {
  await initDB();
  const res = db.exec('SELECT id, name, category, buy, sell, stock, min_stock FROM products ORDER BY name;');
  if (!res || res.length === 0) return [];
  const cols = res[0].columns;
  return res[0].values.map(row => {
    const obj = {};
    for (let i = 0; i < cols.length; i++) obj[cols[i]] = row[i];
    return {
      id: obj.id,
      name: obj.name,
      category: obj.category,
      buy: Number(obj.buy),
      sell: Number(obj.sell),
      stock: Number(obj.stock),
      min: Number(obj.min_stock),
      status: obj.stock === 0 ? 'out-of-stock' : (obj.stock < obj.min_stock ? 'low-stock' : 'in-stock')
    };
  });
}

async function addProduct({ name, category, buy = 0, sell = 0, initial = 0, min = 0 }) {
  await initDB();
  const stmt = db.prepare('INSERT INTO products (name, category, buy, sell, stock, min_stock) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run([name, category, buy, sell, initial, min]);
  stmt.free();
  persist();
}

async function updateProduct(id, { name, category, buy, sell, stock, min }) {
  await initDB();
  const stmt = db.prepare('UPDATE products SET name=?, category=?, buy=?, sell=?, stock=?, min_stock=? WHERE id=?');
  stmt.run([name, category, buy, sell, stock, min, id]);
  stmt.free();
  persist();
}

async function deleteProduct(id) {
  await initDB();
  const stmt = db.prepare('DELETE FROM products WHERE id=?');
  stmt.run([id]);
  stmt.free();
  persist();
}

// SALES + EXPENSES
async function addSale({ product_id, qty = 1, unit_price = 0, total = 0, payment_method = 'Cash', created_at = null }) {
  await initDB();
  const created = created_at || new Date().toISOString();
  const stmt = db.prepare('INSERT INTO sales (product_id, qty, unit_price, total, payment_method, created_at) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run([product_id, qty, unit_price, total, payment_method, created]);
  stmt.free();
  // decrease product stock
  const upd = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
  upd.run([qty, product_id]);
  upd.free();
  persist();
}

async function getSales() {
  await initDB();
  const res = db.exec('SELECT id, product_id, qty, unit_price, total, payment_method, created_at FROM sales ORDER BY created_at DESC;');
  if (!res || res.length === 0) return [];
  const cols = res[0].columns;
  return res[0].values.map(row => {
    const obj = {};
    for (let i = 0; i < cols.length; i++) obj[cols[i]] = row[i];
    return obj;
  });
}

async function addExpense({ description, category = '', amount = 0, created_at = null }) {
  await initDB();
  const created = created_at || new Date().toISOString();
  const stmt = db.prepare('INSERT INTO expenses (description, category, amount, created_at) VALUES (?, ?, ?, ?)');
  stmt.run([description, category, amount, created]);
  stmt.free();
  persist();
}

async function getExpenses() {
  await initDB();
  const res = db.exec('SELECT id, description, category, amount, created_at FROM expenses ORDER BY created_at DESC;');
  if (!res || res.length === 0) return [];
  const cols = res[0].columns;
  return res[0].values.map(row => {
    const obj = {};
    for (let i = 0; i < cols.length; i++) obj[cols[i]] = row[i];
    return obj;
  });
}

async function getTodaySummary() {
  await initDB();
  const sales = await getSales();
  const expenses = await getExpenses();
  const today = new Date().toISOString().slice(0, 10);
  const todaysSales = sales.filter(s => (s.created_at || '').slice(0, 10) === today);
  const todaysExpenses = expenses.filter(e => (e.created_at || '').slice(0, 10) === today);
  const revenue = todaysSales.reduce((s, r) => s + Number(r.total || 0), 0);
  const cost = todaysExpenses.reduce((s, r) => s + Number(r.amount || 0), 0);
  return { revenue, expenses: cost, profit: revenue - cost };
}

export { initDB, getProducts, addProduct, updateProduct, deleteProduct, addSale, getSales, addExpense, getExpenses, getTodaySummary };
