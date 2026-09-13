import initSqlJs from 'sql.js';
import sqlWasmBrowserUrl from 'sql.js/dist/sql-wasm-browser.wasm?url';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

const STORAGE_KEY = 'biasharapro_db_v2';
const FALLBACK_KEY = 'biasharapro_fallback_db_v2';
let SQL = null;
let db = null;
let useFallback = false;

// Custom event to trigger UI refreshes when DB changes
export const DB_CHANGE_EVENT = 'biasharapro:db-changed';

export function notifyDbChanged(detail = {}) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DB_CHANGE_EVENT, { detail }));
  }
}

const initialProducts = [
  { id: 1, name: 'Unga Pembe 2kg', category: 'Chakula', unit: 'pkts', buy: 180, sell: 210, stock: 24, min_stock: 10, barcode: '616110123456' },
  { id: 2, name: 'Sukari Mara 1kg', category: 'Chakula', unit: 'pkts', buy: 130, sell: 160, stock: 15, min_stock: 10, barcode: '616110987654' },
  { id: 3, name: 'Mafuta Salit 2L', category: 'Chakula', unit: 'litres', buy: 550, sell: 630, stock: 8, min_stock: 10, barcode: '616110555222' },
  { id: 4, name: 'Maziwa KCC 500ml', category: 'Chakula', unit: 'pkts', buy: 55, sell: 65, stock: 3, min_stock: 10, barcode: '616110333111' },
  { id: 5, name: 'Omo Sabuni 500g', category: 'Usafi', unit: 'pkts', buy: 120, sell: 150, stock: 0, min_stock: 5, barcode: '616110444888' },
  { id: 6, name: 'Maji Safi 1L', category: 'Vinywaji', unit: 'litres', buy: 35, sell: 50, stock: 30, min_stock: 10, barcode: '616110777999' },
  { id: 7, name: 'Mchele Pishori 1kg', category: 'Chakula', unit: 'kg', buy: 190, sell: 240, stock: 18, min_stock: 8, barcode: '616110666333' },
  { id: 8, name: 'Chumvi Kensalt 500g', category: 'Chakula', unit: 'pkts', buy: 25, sell: 35, stock: 45, min_stock: 15, barcode: '616110111000' },
  { id: 9, name: 'Sabuni ya Geisha', category: 'Usafi', unit: 'pcs', buy: 70, sell: 95, stock: 12, min_stock: 6, barcode: '616110222333' },
];

function generateId() {
  return Date.now() + Math.floor(Math.random() * 10000);
}

function getFallbackStore() {
  if (typeof window === 'undefined') {
    return { products: initialProducts, sales: [], sale_items: [], expenses: [], adjustments: [], audit_logs: [] };
  }
  try {
    const raw = localStorage.getItem(FALLBACK_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Fallback store parse error', err);
  }

  // Seed sample initial transactions if empty
  const today = new Date().toISOString();
  const sampleSales = [
    {
      id: 101,
      receipt_number: 'REC-2026-001',
      total_amount: 580,
      total_cost: 490,
      payment_method: 'M-Pesa',
      mpesa_reference: 'QKH8912KL',
      customer_name: 'Walk-in',
      status: 'COMPLETED',
      cancel_reason: '',
      cashier_name: 'Wanjiku',
      created_at: today,
    },
    {
      id: 102,
      receipt_number: 'REC-2026-002',
      total_amount: 325,
      total_cost: 270,
      payment_method: 'Cash',
      mpesa_reference: '',
      customer_name: 'Mama Kevin',
      status: 'COMPLETED',
      cancel_reason: '',
      cashier_name: 'Wanjiku',
      created_at: today,
    }
  ];

  const sampleSaleItems = [
    { id: 201, sale_id: 101, product_id: 1, product_name: 'Unga Pembe 2kg', qty: 2, unit_cost: 180, unit_price: 210, line_total: 420 },
    { id: 202, sale_id: 101, product_id: 2, product_name: 'Sukari Mara 1kg', qty: 1, unit_cost: 130, unit_price: 160, line_total: 160 },
    { id: 203, sale_id: 102, product_id: 4, product_name: 'Maziwa KCC 500ml', qty: 5, unit_cost: 55, unit_price: 65, line_total: 325 },
  ];

  const sampleExpenses = [
    { id: 301, description: 'Bili ya Umeme KPLC (Token)', category: 'Umeme', amount: 350, payment_method: 'M-Pesa', created_at: today },
    { id: 302, description: 'Boda boda kusafirisha mzigo', category: 'Usafiri', amount: 200, payment_method: 'Cash', created_at: today },
  ];

  const defaultStore = {
    products: initialProducts,
    sales: sampleSales,
    sale_items: sampleSaleItems,
    expenses: sampleExpenses,
    adjustments: [],
    audit_logs: [
      { id: 1, action: 'SYSTEM_INIT', details: 'Duka la BiasharaPro limezinduliwa', user_role: 'OWNER', created_at: today }
    ],
  };

  try {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(defaultStore));
  } catch {}
  return defaultStore;
}

function saveFallbackStore(store) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(store));
  } catch {}
}

async function loadSqlWasmBinary() {
  const urlsToTry = [
    sqlWasmBrowserUrl,
    sqlWasmUrl,
    '/sql-wasm-browser.wasm',
    '/sql-wasm.wasm',
    'https://cdn.jsdelivr.net/npm/sql.js@1.14.2/dist/sql-wasm-browser.wasm',
    'https://cdn.jsdelivr.net/npm/sql.js@1.14.2/dist/sql-wasm.wasm',
  ];

  for (const url of urlsToTry) {
    if (!url) continue;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const buf = await res.arrayBuffer();
      const bytes = new Uint8Array(buf);
      // Check for WebAssembly magic header: \0asm (0x00, 0x61, 0x73, 0x6d)
      if (
        bytes.length >= 4 &&
        bytes[0] === 0x00 &&
        bytes[1] === 0x61 &&
        bytes[2] === 0x73 &&
        bytes[3] === 0x6d
      ) {
        return buf;
      }
    } catch {
      // Continue to next candidate
    }
  }
  return null;
}

export async function initDB() {
  if (db) return db;

  try {
    const wasmBinary = await loadSqlWasmBinary();
    if (wasmBinary) {
      SQL = await initSqlJs({
        wasmBinary,
      });
    } else {
      SQL = await initSqlJs({
        locateFile: file => {
          if (file.includes('browser')) return sqlWasmBrowserUrl || `/${file}`;
          return sqlWasmUrl || `/${file}`;
        },
      });
    }

    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      try {
        const binaryString = atob(saved);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
        db = new SQL.Database(bytes);
      } catch (e) {
        console.warn('Failed to parse saved DB, creating fresh DB', e);
        db = new SQL.Database();
      }
    } else {
      db = new SQL.Database();
    }

    // Run schema creation
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'Chakula',
        unit TEXT NOT NULL DEFAULT 'pcs',
        buy REAL NOT NULL DEFAULT 0,
        sell REAL NOT NULL DEFAULT 0,
        stock REAL NOT NULL DEFAULT 0,
        min_stock REAL NOT NULL DEFAULT 5,
        barcode TEXT DEFAULT '',
        is_archived INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        receipt_number TEXT UNIQUE NOT NULL,
        total_amount REAL NOT NULL DEFAULT 0,
        total_cost REAL NOT NULL DEFAULT 0,
        payment_method TEXT NOT NULL DEFAULT 'Cash',
        mpesa_reference TEXT DEFAULT '',
        customer_name TEXT DEFAULT 'Mteja',
        status TEXT NOT NULL DEFAULT 'COMPLETED',
        cancellation_reason TEXT DEFAULT '',
        cashier_name TEXT DEFAULT 'Owner',
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS sale_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sale_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        qty REAL NOT NULL DEFAULT 1,
        unit_cost REAL NOT NULL DEFAULT 0,
        unit_price REAL NOT NULL DEFAULT 0,
        line_total REAL NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS stock_adjustments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        adjustment_type TEXT NOT NULL,
        quantity_changed REAL NOT NULL,
        previous_quantity REAL NOT NULL,
        new_quantity REAL NOT NULL,
        reason TEXT DEFAULT '',
        recorded_by TEXT DEFAULT 'Owner',
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'Nyingine',
        amount REAL NOT NULL DEFAULT 0,
        payment_method TEXT NOT NULL DEFAULT 'Cash',
        mpesa_reference TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        details TEXT DEFAULT '',
        user_role TEXT DEFAULT 'OWNER',
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);

    // Check if products need seeding
    const res = db.exec('SELECT count(*) as cnt FROM products;');
    const count = res?.[0]?.values?.[0]?.[0] || 0;
    if (count === 0) {
      for (const p of initialProducts) {
        db.run(
          'INSERT INTO products (name, category, unit, buy, sell, stock, min_stock, barcode, is_archived) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [p.name, p.category, p.unit || 'pcs', p.buy, p.sell, p.stock, p.min_stock, p.barcode || '', 0]
        );
      }
      // Seed sample sales
      const now = new Date().toISOString();
      db.run(
        'INSERT INTO sales (receipt_number, total_amount, total_cost, payment_method, mpesa_reference, customer_name, status, cashier_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        ['REC-2026-001', 580, 490, 'M-Pesa', 'QKH8912KL', 'Walk-in', 'COMPLETED', 'Wanjiku', now]
      );
      db.run(
        'INSERT INTO sale_items (sale_id, product_id, product_name, qty, unit_cost, unit_price, line_total) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [1, 1, 'Unga Pembe 2kg', 2, 180, 210, 420]
      );
      db.run(
        'INSERT INTO sale_items (sale_id, product_id, product_name, qty, unit_cost, unit_price, line_total) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [1, 2, 'Sukari Mara 1kg', 1, 130, 160, 160]
      );

      db.run(
        'INSERT INTO sales (receipt_number, total_amount, total_cost, payment_method, mpesa_reference, customer_name, status, cashier_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        ['REC-2026-002', 325, 275, 'Cash', '', 'Mama Kevin', 'COMPLETED', 'Wanjiku', now]
      );
      db.run(
        'INSERT INTO sale_items (sale_id, product_id, product_name, qty, unit_cost, unit_price, line_total) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [2, 4, 'Maziwa KCC 500ml', 5, 55, 65, 325]
      );

      // Seed sample expenses
      db.run(
        'INSERT INTO expenses (description, category, amount, payment_method, created_at) VALUES (?, ?, ?, ?, ?)',
        ['Bili ya Umeme KPLC (Token)', 'Umeme', 350, 'M-Pesa', now]
      );
      db.run(
        'INSERT INTO expenses (description, category, amount, payment_method, created_at) VALUES (?, ?, ?, ?, ?)',
        ['Boda boda kusafirisha mzigo', 'Usafiri', 200, 'Cash', now]
      );

      db.run(
        'INSERT INTO audit_logs (action, details, user_role, created_at) VALUES (?, ?, ?, ?)',
        ['SYSTEM_INIT', 'Duka la BiasharaPro limezinduliwa', 'OWNER', now]
      );
    }

    persist();
    return db;
  } catch (err) {
    console.warn('WASM SQLite init issue, using local persistent fallback store', err);
    useFallback = true;
    return null;
  }
}

function persist() {
  if (!db || typeof window === 'undefined') return;
  try {
    const data = db.export();
    let binary = '';
    const len = data.length;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(data[i]);
    const base64 = btoa(binary);
    window.localStorage.setItem(STORAGE_KEY, base64);
  } catch (e) {
    console.warn('Failed to persist SQLite DB', e);
  }
}

// -------------------------------------------------------------
// PRODUCT OPERATIONS
// -------------------------------------------------------------
export async function getProducts(options = {}) {
  await initDB();
  const { includeArchived = false } = options;

  if (useFallback || !db) {
    const store = getFallbackStore();
    return store.products
      .filter(p => includeArchived ? true : !p.is_archived)
      .map(p => {
        const stock = Number(p.stock || 0);
        const min = Number(p.min_stock ?? p.min ?? 5);
        let status = 'in-stock';
        if (stock === 0) status = 'out-of-stock';
        else if (stock < min) status = 'low-stock';

        return {
          id: p.id,
          name: p.name,
          category: p.category || 'Chakula',
          unit: p.unit || 'pcs',
          buy: Number(p.buy || 0),
          sell: Number(p.sell || 0),
          stock,
          min,
          min_stock: min,
          barcode: p.barcode || '',
          is_archived: p.is_archived ? 1 : 0,
          status,
        };
      });
  }

  const query = includeArchived
    ? 'SELECT * FROM products ORDER BY name;'
    : 'SELECT * FROM products WHERE is_archived = 0 ORDER BY name;';

  const res = db.exec(query);
  if (!res || res.length === 0) return [];

  const cols = res[0].columns;
  return res[0].values.map(row => {
    const obj = {};
    for (let i = 0; i < cols.length; i++) obj[cols[i]] = row[i];
    const stock = Number(obj.stock || 0);
    const min = Number(obj.min_stock || 0);
    let status = 'in-stock';
    if (stock === 0) status = 'out-of-stock';
    else if (stock < min) status = 'low-stock';

    return {
      id: obj.id,
      name: obj.name,
      category: obj.category,
      unit: obj.unit || 'pcs',
      buy: Number(obj.buy || 0),
      sell: Number(obj.sell || 0),
      stock,
      min,
      min_stock: min,
      barcode: obj.barcode || '',
      is_archived: obj.is_archived,
      status,
    };
  });
}

export async function addProduct({ name, category = 'Chakula', unit = 'pcs', buy = 0, sell = 0, initial = 0, stock = 0, min = 5, min_stock = 5, barcode = '' }) {
  await initDB();
  const initialStock = Number(initial || stock || 0);
  const minStock = Number(min || min_stock || 5);
  const buyPrice = Number(buy || 0);
  const sellPrice = Number(sell || 0);

  if (useFallback || !db) {
    const store = getFallbackStore();
    const newId = store.products.length ? Math.max(...store.products.map(p => Number(p.id) || 0)) + 1 : 1;
    const newP = {
      id: newId,
      name,
      category,
      unit,
      buy: buyPrice,
      sell: sellPrice,
      stock: initialStock,
      min_stock: minStock,
      barcode,
      is_archived: 0,
      created_at: new Date().toISOString(),
    };
    store.products.push(newP);
    if (initialStock > 0) {
      store.adjustments.unshift({
        id: generateId(),
        product_id: newId,
        product_name: name,
        adjustment_type: 'RESTOCK',
        quantity_changed: initialStock,
        previous_quantity: 0,
        new_quantity: initialStock,
        reason: 'Stock ya kwanza (Initial stock)',
        recorded_by: 'Owner',
        created_at: new Date().toISOString(),
      });
    }
    saveFallbackStore(store);
    notifyDbChanged({ type: 'product_added', id: newId });
    return newId;
  }

  const stmt = db.prepare('INSERT INTO products (name, category, unit, buy, sell, stock, min_stock, barcode, is_archived) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)');
  stmt.run([name, category, unit, buyPrice, sellPrice, initialStock, minStock, barcode]);
  stmt.free();

  const idRes = db.exec('SELECT last_insert_rowid();');
  const newId = idRes?.[0]?.values?.[0]?.[0];

  if (initialStock > 0 && newId) {
    const adj = db.prepare('INSERT INTO stock_adjustments (product_id, product_name, adjustment_type, quantity_changed, previous_quantity, new_quantity, reason, recorded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    adj.run([newId, name, 'RESTOCK', initialStock, 0, initialStock, 'Stock ya kwanza', 'Owner']);
    adj.free();
  }

  persist();
  notifyDbChanged({ type: 'product_added', id: newId });
  return newId;
}

export async function updateProduct(id, { name, category, unit, buy, sell, stock, min, min_stock, barcode }) {
  await initDB();
  const buyPrice = Number(buy);
  const sellPrice = Number(sell);
  const minStock = Number(min_stock ?? min ?? 5);

  if (useFallback || !db) {
    const store = getFallbackStore();
    const idx = store.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      const prev = store.products[idx];
      store.products[idx] = {
        ...prev,
        name: name !== undefined ? name : prev.name,
        category: category !== undefined ? category : prev.category,
        unit: unit !== undefined ? unit : (prev.unit || 'pcs'),
        buy: !isNaN(buyPrice) ? buyPrice : prev.buy,
        sell: !isNaN(sellPrice) ? sellPrice : prev.sell,
        stock: stock !== undefined ? Number(stock) : prev.stock,
        min_stock: minStock,
        barcode: barcode !== undefined ? barcode : prev.barcode,
      };
      saveFallbackStore(store);
      notifyDbChanged({ type: 'product_updated', id });
    }
    return;
  }

  const p = (await getProducts({ includeArchived: true })).find(x => x.id === id);
  if (!p) return;

  const finalName = name !== undefined ? name : p.name;
  const finalCategory = category !== undefined ? category : p.category;
  const finalUnit = unit !== undefined ? unit : p.unit;
  const finalBuy = !isNaN(buyPrice) ? buyPrice : p.buy;
  const finalSell = !isNaN(sellPrice) ? sellPrice : p.sell;
  const finalStock = stock !== undefined ? Number(stock) : p.stock;
  const finalMin = minStock;
  const finalBarcode = barcode !== undefined ? barcode : p.barcode;

  const stmt = db.prepare('UPDATE products SET name=?, category=?, unit=?, buy=?, sell=?, stock=?, min_stock=?, barcode=?, updated_at=datetime("now") WHERE id=?');
  stmt.run([finalName, finalCategory, finalUnit, finalBuy, finalSell, finalStock, finalMin, finalBarcode, id]);
  stmt.free();
  persist();
  notifyDbChanged({ type: 'product_updated', id });
}

export async function adjustStock(productId, { type = 'RESTOCK', qtyChanged = 0, reason = '', recordedBy = 'Owner' }) {
  await initDB();
  const delta = Number(qtyChanged);

  if (useFallback || !db) {
    const store = getFallbackStore();
    const p = store.products.find(x => x.id === productId);
    if (!p) throw new Error('Product not found');

    const prevQty = Number(p.stock || 0);
    const newQty = Math.max(0, prevQty + delta);
    p.stock = newQty;

    store.adjustments.unshift({
      id: generateId(),
      product_id: productId,
      product_name: p.name,
      adjustment_type: type,
      quantity_changed: delta,
      previous_quantity: prevQty,
      new_quantity: newQty,
      reason,
      recorded_by: recordedBy,
      created_at: new Date().toISOString(),
    });
    saveFallbackStore(store);
    notifyDbChanged({ type: 'stock_adjusted', productId });
    return newQty;
  }

  const prodRes = db.exec(`SELECT id, name, stock FROM products WHERE id = ${productId};`);
  if (!prodRes || !prodRes[0]?.values?.length) throw new Error('Product not found');
  const [pId, pName, currentStock] = prodRes[0].values[0];
  const prevQty = Number(currentStock || 0);
  const newQty = Math.max(0, prevQty + delta);

  db.run('UPDATE products SET stock = ?, updated_at = datetime("now") WHERE id = ?;', [newQty, pId]);
  db.run(
    'INSERT INTO stock_adjustments (product_id, product_name, adjustment_type, quantity_changed, previous_quantity, new_quantity, reason, recorded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
    [pId, pName, type, delta, prevQty, newQty, reason, recordedBy]
  );
  persist();
  notifyDbChanged({ type: 'stock_adjusted', productId });
  return newQty;
}

export async function getStockAdjustments(productId = null) {
  await initDB();
  if (useFallback || !db) {
    const store = getFallbackStore();
    if (productId) {
      return store.adjustments.filter(a => a.product_id === productId);
    }
    return store.adjustments;
  }

  const query = productId
    ? `SELECT * FROM stock_adjustments WHERE product_id = ${productId} ORDER BY created_at DESC;`
    : 'SELECT * FROM stock_adjustments ORDER BY created_at DESC LIMIT 50;';

  const res = db.exec(query);
  if (!res || res.length === 0) return [];
  const cols = res[0].columns;
  return res[0].values.map(row => {
    const obj = {};
    for (let i = 0; i < cols.length; i++) obj[cols[i]] = row[i];
    return obj;
  });
}

export async function deleteProduct(id) {
  await initDB();
  if (useFallback || !db) {
    const store = getFallbackStore();
    store.products = store.products.filter(p => p.id !== id);
    saveFallbackStore(store);
    notifyDbChanged({ type: 'product_deleted', id });
    return;
  }
  db.run('UPDATE products SET is_archived = 1 WHERE id = ?;', [id]);
  persist();
  notifyDbChanged({ type: 'product_deleted', id });
}

// -------------------------------------------------------------
// SALES & POS OPERATIONS
// -------------------------------------------------------------
export async function createSale({
  items = [], // [{ product_id, qty, unit_price, unit_cost, product_name }]
  payment_method = 'Cash',
  mpesa_reference = '',
  customer_name = 'Mteja',
  cashier_name = 'Owner'
}) {
  if (!items || items.length === 0) {
    throw new Error('Mauzo lazima yawe na angalau bidhaa moja (Sale must have items)');
  }

  await initDB();

  // Validate stock first
  const products = await getProducts();
  for (const item of items) {
    const p = products.find(prod => prod.id === item.product_id);
    if (!p) throw new Error(`Bidhaa #${item.product_id} haipatikani`);
    if (p.stock < item.qty) {
      throw new Error(`Stoki haitoshi kwa ${p.name}. Zilizobaki: ${p.stock}`);
    }
  }

  const totalAmount = items.reduce((sum, item) => sum + (Number(item.unit_price) * Number(item.qty)), 0);
  const totalCost = items.reduce((sum, item) => sum + (Number(item.unit_cost || 0) * Number(item.qty)), 0);
  const dateStr = new Date().toISOString();
  const receiptNumber = `REC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 90 + 10)}`;

  if (useFallback || !db) {
    const store = getFallbackStore();
    const saleId = generateId();
    const newSale = {
      id: saleId,
      receipt_number: receiptNumber,
      total_amount: totalAmount,
      total_cost: totalCost,
      payment_method,
      mpesa_reference,
      customer_name,
      status: 'COMPLETED',
      cancellation_reason: '',
      cashier_name,
      created_at: dateStr,
    };
    store.sales.unshift(newSale);

    items.forEach(item => {
      const lineTotal = Number(item.unit_price) * Number(item.qty);
      store.sale_items.push({
        id: generateId(),
        sale_id: saleId,
        product_id: item.product_id,
        product_name: item.product_name,
        qty: Number(item.qty),
        unit_cost: Number(item.unit_cost || 0),
        unit_price: Number(item.unit_price),
        line_total: lineTotal,
      });

      // Reduce product stock
      const prod = store.products.find(p => p.id === item.product_id);
      if (prod) {
        prod.stock = Math.max(0, Number(prod.stock) - Number(item.qty));
      }
    });

    store.audit_logs.unshift({
      id: generateId(),
      action: 'SALE_CREATED',
      details: `Mauzo ${receiptNumber}: KSh ${totalAmount} (${payment_method})`,
      user_role: cashier_name === 'Cashier' ? 'CASHIER' : 'OWNER',
      created_at: dateStr,
    });

    saveFallbackStore(store);
    notifyDbChanged({ type: 'sale_created', saleId });
    return { saleId, receiptNumber, totalAmount, items };
  }

  // SQLite execution
  const saleStmt = db.prepare(
    'INSERT INTO sales (receipt_number, total_amount, total_cost, payment_method, mpesa_reference, customer_name, status, cashier_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  saleStmt.run([receiptNumber, totalAmount, totalCost, payment_method, mpesa_reference, customer_name, 'COMPLETED', cashier_name, dateStr]);
  saleStmt.free();

  const idRes = db.exec('SELECT last_insert_rowid();');
  const saleId = idRes?.[0]?.values?.[0]?.[0];

  for (const item of items) {
    const lineTotal = Number(item.unit_price) * Number(item.qty);
    db.run(
      'INSERT INTO sale_items (sale_id, product_id, product_name, qty, unit_cost, unit_price, line_total) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [saleId, item.product_id, item.product_name, Number(item.qty), Number(item.unit_cost || 0), Number(item.unit_price), lineTotal]
    );

    // Reduce stock
    db.run('UPDATE products SET stock = stock - ?, updated_at = datetime("now") WHERE id = ?', [Number(item.qty), item.product_id]);
  }

  db.run(
    'INSERT INTO audit_logs (action, details, user_role, created_at) VALUES (?, ?, ?, ?)',
    ['SALE_CREATED', `Mauzo ${receiptNumber}: KSh ${totalAmount} (${payment_method})`, cashier_name === 'Cashier' ? 'CASHIER' : 'OWNER', dateStr]
  );

  persist();
  notifyDbChanged({ type: 'sale_created', saleId });
  return { saleId, receiptNumber, totalAmount, items };
}

export async function cancelSale(saleId, reason = 'Customer returned goods') {
  await initDB();
  if (useFallback || !db) {
    const store = getFallbackStore();
    const sale = store.sales.find(s => s.id === saleId);
    if (!sale) throw new Error('Sale not found');
    if (sale.status === 'CANCELLED') throw new Error('Sale already cancelled');

    sale.status = 'CANCELLED';
    sale.cancellation_reason = reason;

    // Restore stock
    const items = store.sale_items.filter(it => it.sale_id === saleId);
    items.forEach(it => {
      const prod = store.products.find(p => p.id === it.product_id);
      if (prod) {
        prod.stock = Number(prod.stock || 0) + Number(it.qty);
      }
    });

    store.audit_logs.unshift({
      id: generateId(),
      action: 'SALE_CANCELLED',
      details: `Mauzo ${sale.receipt_number} yamefutwa. Sababu: ${reason}`,
      user_role: 'OWNER',
      created_at: new Date().toISOString(),
    });

    saveFallbackStore(store);
    notifyDbChanged({ type: 'sale_cancelled', saleId });
    return true;
  }

  const res = db.exec(`SELECT receipt_number, status FROM sales WHERE id = ${saleId};`);
  if (!res || !res[0]?.values?.length) throw new Error('Sale not found');
  const [receiptNumber, currentStatus] = res[0].values[0];
  if (currentStatus === 'CANCELLED') throw new Error('Sale already cancelled');

  db.run('UPDATE sales SET status = "CANCELLED", cancellation_reason = ? WHERE id = ?;', [reason, saleId]);

  // Restore inventory
  const itemsRes = db.exec(`SELECT product_id, qty FROM sale_items WHERE sale_id = ${saleId};`);
  if (itemsRes && itemsRes[0]?.values) {
    for (const [pId, qty] of itemsRes[0].values) {
      db.run('UPDATE products SET stock = stock + ? WHERE id = ?;', [qty, pId]);
    }
  }

  db.run(
    'INSERT INTO audit_logs (action, details, user_role) VALUES (?, ?, ?);',
    ['SALE_CANCELLED', `Mauzo ${receiptNumber} yamefutwa. Sababu: ${reason}`, 'OWNER']
  );

  persist();
  notifyDbChanged({ type: 'sale_cancelled', saleId });
  return true;
}

export async function getSales(options = {}) {
  await initDB();
  const { limit = 100, date = null, status = null } = options;

  if (useFallback || !db) {
    const store = getFallbackStore();
    return store.sales
      .filter(s => {
        if (date && (s.created_at || '').slice(0, 10) !== date) return false;
        if (status && s.status !== status) return false;
        return true;
      })
      .slice(0, limit)
      .map(s => {
        const items = store.sale_items.filter(it => it.sale_id === s.id);
        return { ...s, items };
      });
  }

  let query = 'SELECT * FROM sales ';
  const whereClauses = [];
  if (date) whereClauses.push(`substr(created_at, 1, 10) = '${date}'`);
  if (status) whereClauses.push(`status = '${status}'`);
  if (whereClauses.length) query += 'WHERE ' + whereClauses.join(' AND ') + ' ';
  query += `ORDER BY created_at DESC LIMIT ${limit};`;

  const res = db.exec(query);
  if (!res || res.length === 0) return [];
  const cols = res[0].columns;
  const salesList = res[0].values.map(row => {
    const obj = {};
    for (let i = 0; i < cols.length; i++) obj[cols[i]] = row[i];
    return obj;
  });

  // Attach items
  for (const s of salesList) {
    const itemRes = db.exec(`SELECT * FROM sale_items WHERE sale_id = ${s.id};`);
    if (itemRes && itemRes[0]) {
      const itCols = itemRes[0].columns;
      s.items = itemRes[0].values.map(r => {
        const itemObj = {};
        for (let j = 0; j < itCols.length; j++) itemObj[itCols[j]] = r[j];
        return itemObj;
      });
    } else {
      s.items = [];
    }
  }

  return salesList;
}

// -------------------------------------------------------------
// EXPENSES OPERATIONS
// -------------------------------------------------------------
export async function getExpenses(options = {}) {
  await initDB();
  const { period = 'all' } = options;

  if (useFallback || !db) {
    const store = getFallbackStore();
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    return store.expenses
      .filter(e => {
        const d = (e.created_at || '').slice(0, 10);
        if (period === 'today') return d === todayStr;
        if (period === 'week') return d >= sevenDaysAgo;
        if (period === 'month') return d >= thirtyDaysAgo;
        return true;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  let query = 'SELECT * FROM expenses ORDER BY created_at DESC;';
  const res = db.exec(query);
  if (!res || res.length === 0) return [];
  const cols = res[0].columns;
  const list = res[0].values.map(row => {
    const obj = {};
    for (let i = 0; i < cols.length; i++) obj[cols[i]] = row[i];
    return obj;
  });

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  if (period === 'today') return list.filter(e => (e.created_at || '').slice(0, 10) === todayStr);
  if (period === 'week') return list.filter(e => (e.created_at || '').slice(0, 10) >= sevenDaysAgo);
  if (period === 'month') return list.filter(e => (e.created_at || '').slice(0, 10) >= thirtyDaysAgo);

  return list;
}

export async function addExpense({ description, category = 'Nyingine', amount = 0, payment_method = 'Cash', mpesa_reference = '', date = null }) {
  await initDB();
  const numAmount = Number(amount);
  const createdAt = date ? `${date}T12:00:00Z` : new Date().toISOString();

  if (useFallback || !db) {
    const store = getFallbackStore();
    const newId = generateId();
    store.expenses.unshift({
      id: newId,
      description,
      category,
      amount: numAmount,
      payment_method,
      mpesa_reference,
      created_at: createdAt,
    });
    saveFallbackStore(store);
    notifyDbChanged({ type: 'expense_added', id: newId });
    return newId;
  }

  const stmt = db.prepare('INSERT INTO expenses (description, category, amount, payment_method, mpesa_reference, created_at) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run([description, category, numAmount, payment_method, mpesa_reference, createdAt]);
  stmt.free();
  persist();
  notifyDbChanged({ type: 'expense_added' });
}

export async function deleteExpense(id) {
  await initDB();
  if (useFallback || !db) {
    const store = getFallbackStore();
    store.expenses = store.expenses.filter(e => e.id !== id);
    saveFallbackStore(store);
    notifyDbChanged({ type: 'expense_deleted', id });
    return;
  }

  db.run('DELETE FROM expenses WHERE id = ?;', [id]);
  persist();
  notifyDbChanged({ type: 'expense_deleted', id });
}

// -------------------------------------------------------------
// DASHBOARD & REPORTS METRICS
// -------------------------------------------------------------
export async function getDashboardMetrics() {
  await initDB();
  const todayStr = new Date().toISOString().slice(0, 10);

  const allSales = await getSales({ limit: 500 });
  const allExpenses = await getExpenses();
  const products = await getProducts();

  const activeSales = allSales.filter(s => s.status !== 'CANCELLED');
  const todaySales = activeSales.filter(s => (s.created_at || '').slice(0, 10) === todayStr);
  const todayExpenses = allExpenses.filter(e => (e.created_at || '').slice(0, 10) === todayStr);

  const todayRevenue = todaySales.reduce((acc, s) => acc + Number(s.total_amount || 0), 0);
  const todayCost = todaySales.reduce((acc, s) => acc + Number(s.total_cost || 0), 0);
  const todayExpenseTotal = todayExpenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);

  // Gross profit = (Revenue - COGS) - Operating Expenses
  const todayGrossProfit = (todayRevenue - todayCost) - todayExpenseTotal;

  // Breakdown by payment
  const cashCollected = todaySales
    .filter(s => s.payment_method === 'Cash')
    .reduce((acc, s) => acc + Number(s.total_amount || 0), 0);

  const mpesaCollected = todaySales
    .filter(s => s.payment_method === 'M-Pesa')
    .reduce((acc, s) => acc + Number(s.total_amount || 0), 0);

  // Items sold
  let totalItemsSold = 0;
  todaySales.forEach(s => {
    (s.items || []).forEach(it => {
      totalItemsSold += Number(it.qty || 0);
    });
  });

  // Low stock and out of stock counts
  const lowStockCount = products.filter(p => p.status === 'low-stock').length;
  const outOfStockCount = products.filter(p => p.status === 'out-of-stock').length;

  // Top products calculation
  const productSalesMap = {};
  activeSales.forEach(s => {
    (s.items || []).forEach(it => {
      if (!productSalesMap[it.product_name]) {
        productSalesMap[it.product_name] = { name: it.product_name, qty: 0, revenue: 0 };
      }
      productSalesMap[it.product_name].qty += Number(it.qty || 0);
      productSalesMap[it.product_name].revenue += Number(it.line_total || 0);
    });
  });

  const bestSellers = Object.values(productSalesMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return {
    todayRevenue,
    todayCost,
    todayExpenses: todayExpenseTotal,
    todayGrossProfit,
    salesCount: todaySales.length,
    totalItemsSold,
    cashCollected,
    mpesaCollected,
    lowStockCount,
    outOfStockCount,
    recentSales: allSales.slice(0, 10),
    bestSellers,
    productsCount: products.length,
  };
}

export async function getReportsData() {
  await initDB();
  const sales = await getSales({ limit: 1000 });
  const expenses = await getExpenses();
  const products = await getProducts();

  const activeSales = sales.filter(s => s.status !== 'CANCELLED');

  const totalRevenue = activeSales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);
  const totalCost = activeSales.reduce((sum, s) => sum + Number(s.total_cost || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const grossProfit = totalRevenue - totalCost;
  const netProfit = grossProfit - totalExpenses;

  // Stock valuation
  const totalStockBuyValue = products.reduce((sum, p) => sum + (Number(p.buy) * Number(p.stock)), 0);
  const totalStockSellValue = products.reduce((sum, p) => sum + (Number(p.sell) * Number(p.stock)), 0);
  const potentialProfitInStock = totalStockSellValue - totalStockBuyValue;

  // Payment method totals
  const paymentBreakdown = {
    Cash: 0,
    'M-Pesa': 0,
    Card: 0,
    Other: 0,
  };

  activeSales.forEach(s => {
    const method = s.payment_method || 'Cash';
    paymentBreakdown[method] = (paymentBreakdown[method] || 0) + Number(s.total_amount || 0);
  });

  // Expense categories breakdown
  const expenseByCategory = {};
  expenses.forEach(e => {
    const cat = e.category || 'Nyingine';
    expenseByCategory[cat] = (expenseByCategory[cat] || 0) + Number(e.amount || 0);
  });

  return {
    totalRevenue,
    totalCost,
    grossProfit,
    totalExpenses,
    netProfit,
    totalStockBuyValue,
    totalStockSellValue,
    potentialProfitInStock,
    paymentBreakdown,
    expenseByCategory,
    salesCount: activeSales.length,
    expensesCount: expenses.length,
  };
}

// -------------------------------------------------------------
// SUBSCRIPTION & M-PESA
// -------------------------------------------------------------
const SUBSCRIPTION_KEY = 'biasharapro_subscription_state_v1';

export function getSubscriptionInfo() {
  if (typeof window === 'undefined') return { status: 'TRIAL', daysLeft: 14 };

  try {
    const raw = localStorage.getItem(SUBSCRIPTION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  // Default 14-day trial from initial install
  const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  const defaultSub = {
    status: 'TRIAL',
    planName: 'Mpango wa Msingi / Basic Plan',
    price: 500,
    trialEndsAt: trialEnd,
    expiresAt: trialEnd,
    history: [
      { date: 'Nov 24, 2025', amount: 'Ksh 500', mpesa: 'QJH5K9', status: 'Paid' },
      { date: 'Oct 24, 2025', amount: 'Ksh 500', mpesa: 'P8X2ZT', status: 'Paid' },
    ],
  };

  try {
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(defaultSub));
  } catch {}
  return defaultSub;
}

export function saveSubscriptionPayment({ phone, amount = 500, mpesaCode = '' }) {
  const current = getSubscriptionInfo();
  const code = mpesaCode || `QKH${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date();
  const newExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const updated = {
    ...current,
    status: 'ACTIVE',
    expiresAt: newExpiry,
    lastPayment: {
      date: now.toISOString(),
      amount: `Ksh ${amount}`,
      mpesa: code,
      phone,
    },
    history: [
      {
        date: now.toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: `Ksh ${amount}`,
        mpesa: code,
        status: 'Paid',
      },
      ...(current.history || []),
    ],
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(updated));
    notifyDbChanged({ type: 'subscription_updated' });
  }

  return updated;
}

// -------------------------------------------------------------
// BACKUP & RESTORE
// -------------------------------------------------------------
export async function exportDatabaseBackup() {
  await initDB();
  const products = await getProducts({ includeArchived: true });
  const sales = await getSales({ limit: 10000 });
  const expenses = await getExpenses({ period: 'all' });
  const adjustments = await getStockAdjustments();
  const subscription = getSubscriptionInfo();

  const backupData = {
    version: '2.0',
    exported_at: new Date().toISOString(),
    store: {
      products,
      sales,
      expenses,
      adjustments,
      subscription,
    },
  };

  return JSON.stringify(backupData, null, 2);
}

export async function restoreDatabaseFromBackup(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!data.store || !Array.isArray(data.store.products)) {
      throw new Error('Faili hii ya backup haina mfumo sahihi wa BiasharaPro (Invalid backup format)');
    }

    const store = getFallbackStore();
    store.products = data.store.products;
    store.sales = data.store.sales || [];
    store.sale_items = data.store.sale_items || [];
    store.expenses = data.store.expenses || [];
    store.adjustments = data.store.adjustments || [];
    saveFallbackStore(store);

    if (data.store.subscription) {
      localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(data.store.subscription));
    }

    // Reset sqlite if available
    if (db) {
      db.run('DELETE FROM products;');
      db.run('DELETE FROM sales;');
      db.run('DELETE FROM sale_items;');
      db.run('DELETE FROM expenses;');
      db.run('DELETE FROM stock_adjustments;');

      for (const p of data.store.products) {
        db.run(
          'INSERT INTO products (id, name, category, unit, buy, sell, stock, min_stock, barcode, is_archived) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [p.id, p.name, p.category, p.unit || 'pcs', p.buy, p.sell, p.stock, p.min_stock || p.min, p.barcode || '', p.is_archived || 0]
        );
      }
      persist();
    }

    notifyDbChanged({ type: 'backup_restored' });
    return true;
  } catch (err) {
    throw new Error(`Kosa la kusoma backup: ${err.message}`, { cause: err });
  }
}

export async function resetDatabaseToSampleData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(FALLBACK_KEY);
  }
  db = null;
  await initDB();
  notifyDbChanged({ type: 'database_reset' });
  return true;
}

export const exportFullDatabase = exportDatabaseBackup;
export const importFullDatabase = restoreDatabaseFromBackup;
