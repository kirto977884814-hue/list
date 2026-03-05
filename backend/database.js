const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('已连接到SQLite数据库');
    initDb();
  }
});

function initDb() {
  // 创建会员表
  db.run(`CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    nickname TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('创建会员表失败:', err.message);
    } else {
      console.log('会员表创建成功');
    }
  });

  // 创建观看记录表
  db.run(`CREATE TABLE IF NOT EXISTS view_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_name TEXT,
    import_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_members INTEGER DEFAULT 0,
    viewed_count INTEGER DEFAULT 0,
    missed_count INTEGER DEFAULT 0
  )`, (err) => {
    if (err) {
      console.error('创建观看记录表失败:', err.message);
    } else {
      console.log('观看记录表创建成功');
    }
  });

  // 创建观看详情表
  db.run(`CREATE TABLE IF NOT EXISTS view_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (record_id) REFERENCES view_records(id) ON DELETE CASCADE
  )`, (err) => {
    if (err) {
      console.error('创建观看详情表失败:', err.message);
    } else {
      console.log('观看详情表创建成功');
    }
  });
}

module.exports = db;
