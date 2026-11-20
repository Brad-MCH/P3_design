-- Migration number: 0001 	 2026-11-20T03:29:01.439Z
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  cake_json TEXT NOT NULL,
  status TEXT NOT NULL,
  total REAL NOT NULL,
  created_at TEXT NOT NULL
);