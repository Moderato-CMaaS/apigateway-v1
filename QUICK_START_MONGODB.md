# 🚀 Quick Start: MongoDB Migration

## **5-Minute Setup**

### **1. Install Dependencies**
```bash
cd nodejs-backend
npm install
```

### **2. Choose MongoDB Setup**

#### **A) MongoDB Atlas (Easiest - Recommended)**
1. Sign up free: https://www.mongodb.com/cloud/atlas
2. Create cluster (free tier)
3. Copy connection string
4. Edit `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.abc.mongodb.net/userportal
   ```

#### **B) Local MongoDB**
1. Download: https://www.mongodb.com/try/download/community
2. Start MongoDB
3. Edit `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/userportal
   ```

### **3. Start Server**
```bash
npm start
```

✅ See this message:
```
✅ MongoDB connected successfully
✅ Server running on http://localhost:8080
```

### **4. Test It**
```bash
curl http://localhost:8080/api/health
```

---

## **What Changed?**

| Item | Before | After |
|------|--------|-------|
| Database | SQLite (local file) | MongoDB (cloud/local) |
| JWT | Custom format | Standard RFC 7519 |
| Database Calls | Synchronous | Async/await |
| Scalability | Single file | ❌ Not scalable ✅ Scalable |
| Backups | Manual | Automatic (Atlas) |

---

## **File Changes**

✨ **New Files:**
- `models/User.js`
- `models/JWTToken.js`
- `models/ApiKey.js`

✏️ **Updated Files:**
- `database.js` - MongoDB operations
- `auth.js` - Standard JWT
- `server.js` - Async initialization
- `middleware.js` - Async auth validation
- `routes/auth.routes.js` - Async handlers

---

## **All API Endpoints Still Work**

No changes to your API! Everything works the same:

```bash
# Register
POST http://localhost:8080/api/auth/register
Body: { "username": "john", "email": "john@example.com", "password": "Secure123!" }

# Login
POST http://localhost:8080/api/auth/login
Body: { "username": "john", "password": "Secure123!" }

# Get Profile
GET http://localhost:8080/api/auth/profile
Headers: Authorization: Bearer <token>

# Create API Key
POST http://localhost:8080/api/apikeys
Headers: Authorization: Bearer <token>
Body: { "name": "My Key", "description": "..." }
```

---

## **MongoDB vs SQLite**

### ✅ Advantages of MongoDB
- **Scalable** - Handles millions of records
- **Cloud-ready** - Deploy anywhere
- **Flexible** - Change schema anytime
- **Automatic backups** - Atlas does it
- **Better for modern apps** - JSON-like data

### ⚠️ Migration Notes
- Old SQLite data won't auto-transfer (see MONGODB_MIGRATION.md)
- New users/API keys work fine
- Need to re-login after migration

---

## **Environment Variables**

```env
MONGO_URI=<your-connection-string>
PORT=8080
JWT_SECRET=<change-this-in-production>
```

See `.env.example` for template.

---

## **Troubleshooting**

| Issue | Fix |
|-------|-----|
| "Cannot find module" | Run `npm install` |
| Connection refused | Start MongoDB or check MONGO_URI |
| Invalid token | Login again after migration |
| API key invalid | Create new key in UI |

---

## **Need More Details?**

See `MONGODB_MIGRATION.md` for:
- Data migration from SQLite
- Production deployment
- Connection troubleshooting
- JWT information

---

## ✅ Migration Complete!

You're now using MongoDB instead of SQLite. Start the server and your app is ready to scale! 🎉

Need help? Check the detailed guide → `MONGODB_MIGRATION.md`
