// Quick database viewer script
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database/userportal.db');
const db = new Database(dbPath);

console.log('📊 DATABASE VIEWER\n');

// View users
console.log('=== USERS ===');
const users = db.prepare('SELECT id, username, email, created_at, is_active FROM users').all();
console.table(users);

// View JWT Tokens
console.log('\n=== JWT TOKENS ===');
const tokens = db.prepare('SELECT id, user_id, created_at, expires_at, is_revoked FROM jwt_tokens').all();
console.table(tokens);

// View API Keys
console.log('\n=== API KEYS ===');
const apiKeys = db.prepare('SELECT id, user_id, name, status, current_month_usage, monthly_quota, quota_reset_date FROM api_keys').all();
console.table(apiKeys);

// View specific tables count
console.log('\n=== STATISTICS ===');
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
const tokenCount = db.prepare('SELECT COUNT(*) as count FROM jwt_tokens').get();
const apiKeyCount = db.prepare('SELECT COUNT(*) as count FROM api_keys').get();

console.log(`Total Users: ${userCount.count}`);
console.log(`Total Tokens: ${tokenCount.count}`);
console.log(`Total API Keys: ${apiKeyCount.count}`);

db.close();
