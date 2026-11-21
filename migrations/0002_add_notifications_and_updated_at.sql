-- Migration number: 0002
ALTER TABLE orders ADD COLUMN updated_at TEXT NOT NULL DEFAULT '';

CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  status TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_order_id ON notifications(order_id);
