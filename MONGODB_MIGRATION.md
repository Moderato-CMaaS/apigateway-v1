# MongoDB Migration Guide

## ✅ What We Changed

- **Replaced SQLite** with MongoDB using Mongoose ODM
- **Updated JWT** to use standard `jsonwebtoken` library
- **Added Models** for User, JWTToken, and ApiKey
- **Made all database operations async/await**

---

## 🚀 Installation & Setup

### **Step 1: Install Dependencies**

```bash
cd nodejs-backend
npm install
```

This will install:
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - Standard JWT library
- `express-rate-limit` - Rate limiting (security)

### **Step 2: Set Up MongoDB**

#### **Option A: MongoDB Atlas (Cloud - Recommended)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a free cluster
4. Get connection string like:
   ```
   mongodb+srv://username:password@cluster0.abc123.mongodb.net/userportal
   ```
5. Update `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/userportal
   ```

#### **Option B: Local MongoDB**

1. Download & install from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Connection string (default):
   ```
   mongodb://localhost:27017/userportal
   ```
4. Update `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/userportal
   ```

### **Step 3: Update .env File**

Edit `nodejs-backend/.env`:

```env
PORT=8080
NODE_ENV=development

# MongoDB URI
MONGO_URI=mongodb://localhost:27017/userportal

# JWT Configuration (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-key-min-32-chars-really-long
JWT_EXPIRY_TIME=3600
JWT_ISSUER=userportal-auth
JWT_AUDIENCE=userportal-users

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### **Step 4: Start the Backend**

```bash
cd nodejs-backend
npm start
```

Expected output:
```
✅ MongoDB connected successfully
✅ Server running on http://localhost:8080
📊 API Health: http://localhost:8080/api/health
```

---

## 📊 File Structure Changes

### **New Files Created:**
```
nodejs-backend/
├── models/
│   ├── User.js           ✨ NEW
│   ├── JWTToken.js       ✨ NEW
│   └── ApiKey.js         ✨ NEW
├── database.js           ✏️ UPDATED (MongoDB)
├── auth.js               ✏️ UPDATED (Standard JWT)
├── apikeys.js            ✏️ UPDATED (Async)
├── middleware.js         ✏️ UPDATED (Async)
├── server.js             ✏️ UPDATED (Async init)
└── routes/
    └── auth.routes.js    ✏️ UPDATED (Async/await)
```

---

## 🔄 Data Migration from SQLite

If you have existing SQLite data and want to migrate:

```javascript
// migration-script.js
const Database = require('better-sqlite3');
const mongoose = require('mongoose');
const User = require('./models/User');
const ApiKey = require('./models/ApiKey');

async function migrate() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI);
  
  // Connect to SQLite
  const db = new Database('./database/userportal.db');
  
  // Get all users from SQLite
  const users = db.prepare('SELECT * FROM users').all();
  
  // Insert into MongoDB
  for (const user of users) {
    await User.create({
      id: user.id,
      username: user.username,
      email: user.email,
      password_hash: user.password_hash,
      is_active: Boolean(user.is_active),
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at)
    });
  }
  
  console.log(`✅ Migrated ${users.length} users`);
  
  db.close();
  await mongoose.connection.close();
}

migrate().catch(console.error);
```

---

## ✨ Key Improvements

### **1. Better JWT Implementation**
```javascript
// Before (custom, non-standard)
const token = `${userId}|${username}|${email}|${expiry}|${signature}`;

// After (standard RFC 7519)
const token = jwt.sign(payload, secret, { expiresIn: '1h' });
```

### **2. Async/Await Database**
```javascript
// Before (synchronous)
const user = getUserById(userId);

// After (asynchronous)
const user = await getUserById(userId);
```

### **3. Better Security**
- Standard JWT library (battle-tested)
- Rate limiting support
- Proper token validation
- Auto-expiring tokens in MongoDB

---

## 📋 API Endpoints (No Changes)

All endpoints work the same way:

### **Authentication**
```bash
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
POST /api/auth/logout
```

### **API Keys**
```bash
POST /api/apikeys
GET /api/apikeys
PUT /api/apikeys/:keyId/status
```

---

## 🐛 Troubleshooting

### **Connection Error: "connect ECONNREFUSED"**
- MongoDB is not running
- Solution: Start MongoDB or use MongoDB Atlas

### **Error: "Invalid API key"**
- API keys from SQLite won't work immediately
- Solution: Create new API keys in the UI

### **"Cannot find module 'mongoose'"**
- npm install didn't run
- Solution: Run `npm install` again

### **JWT Error: "Invalid token"**
- Old tokens from SQLite are invalid
- Solution: Login again to get new JWT token

---

## 🚀 Production Deployment

### **1. Generate Strong JWT Secret**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **2. Use MongoDB Atlas**
- Better security
- Automatic backups
- Scalable
- Free tier available

### **3. Set Environment Variables**
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=<strong-random-secret>
CORS_ORIGINS=https://yourdomain.com
```

### **4. Add Rate Limiting** (already in code)

---

## 📞 Quick Reference

### **MongoDB Connection Issues**

**Local MongoDB not starting:**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Connection string formats:**
```
Local: mongodb://localhost:27017/userportal
Atlas: mongodb+srv://user:pass@cluster.mongodb.net/userportal
```

---

## ✅ Verification Checklist

After migration:

- [ ] MongoDB is running
- [ ] `.env` has `MONGO_URI` set
- [ ] `npm install` completed
- [ ] Server starts without errors
- [ ] `/api/health` returns `healthy`
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can create API key

---

## 📚 Next Steps

1. **Test all endpoints** - Postman collection coming soon
2. **Add integration tests** - Jest + MongoDB Memory Server
3. **Set up CI/CD** - GitHub Actions
4. **Add monitoring** - Sentry, LogRocket
5. **Scale to production** - Docker + Kubernetes

---

For issues, check MongoDB documentation:
- https://docs.mongodb.com/
- https://mongoosejs.com/docs/
