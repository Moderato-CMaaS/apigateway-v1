// MongoDB Connection and Operations
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const User = require('./models/User');
const JWTToken = require('./models/JWTToken');
const ApiKey = require('./models/ApiKey');

// Initialize database connection
async function initializeDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/userportal';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

// ===== USER OPERATIONS =====

async function createUser(username, email, passwordHash) {
  const userId = uuidv4();
  
  const user = new User({
    id: userId,
    username,
    email,
    password_hash: passwordHash,
    is_active: true
  });
  
  return await user.save();
}

function getUserByUsername(username) {
  return User.findOne({ username, is_active: true });
}

function getUserByEmail(email) {
  return User.findOne({ email, is_active: true });
}

function getUserById(userId) {
  return User.findOne({ id: userId, is_active: true });
}

// ===== JWT TOKEN OPERATIONS =====

async function storeJWTToken(userId, tokenHash, expiresAt) {
  const tokenId = uuidv4();
  
  const token = new JWTToken({
    id: tokenId,
    user_id: userId,
    token_hash: tokenHash,
    expires_at: expiresAt,
    is_revoked: false
  });
  
  return await token.save();
}

function isTokenValid(tokenHash) {
  return JWTToken.findOne({
    token_hash: tokenHash,
    is_revoked: false,
    expires_at: { $gt: new Date() }
  });
}

async function revokeToken(tokenHash) {
  const result = await JWTToken.updateOne(
    { token_hash: tokenHash },
    { is_revoked: true }
  );
  return result.modifiedCount > 0;
}

// ===== API KEY OPERATIONS =====

async function createApiKey(userId, name, description, rules, quotaResetDate) {
  const keyId = uuidv4();
  
  const apiKey = new ApiKey({
    id: keyId,
    user_id: userId,
    name,
    description,
    rules: Array.isArray(rules) ? rules : [rules],
    quota_reset_date: quotaResetDate
  });
  
  return await apiKey.save();
}

function getApiKeyById(keyId) {
  return ApiKey.findOne({ id: keyId });
}

function getApiKeysByUserId(userId) {
  return ApiKey.find({
    user_id: userId,
    status: { $ne: 'revoked' }
  }).sort({ created_at: -1 });
}

function getApiKeyByHash(keyHash) {
  return ApiKey.findOne({
    key_hash: keyHash,
    status: 'active'
  });
}

async function updateApiKeyStatus(keyId, status) {
  return await ApiKey.updateOne(
    { id: keyId },
    { 
      status,
      updated_at: new Date()
    }
  );
}

async function updateApiKeyRules(keyId, rules) {
  return await ApiKey.updateOne(
    { id: keyId },
    { 
      rules: Array.isArray(rules) ? rules : [rules],
      updated_at: new Date()
    }
  );
}

async function deleteApiKey(keyId) {
  return await ApiKey.deleteOne({ id: keyId });
}

function getApiKeyCountForUser(userId) {
  return ApiKey.countDocuments({
    user_id: userId,
    status: { $ne: 'revoked' }
  });
}

async function incrementApiKeyUsage(keyId) {
  return await ApiKey.updateOne(
    { id: keyId },
    { 
      $inc: { 
        usage_count: 1,
        current_month_usage: 1
      }
    }
  );
}

async function updateApiKeyUsage(keyId, newUsage) {
  return await ApiKey.updateOne(
    { id: keyId },
    { 
      current_month_usage: newUsage,
      updated_at: new Date()
    }
  );
}

module.exports = {
  initializeDatabase,
  // User operations
  createUser,
  getUserByUsername,
  getUserByEmail,
  getUserById,
  // JWT operations
  storeJWTToken,
  isTokenValid,
  revokeToken,
  // API Key operations
  createApiKey,
  getApiKeyById,
  getApiKeysByUserId,
  getApiKeyByHash,
  updateApiKeyStatus,
  updateApiKeyRules,
  deleteApiKey,
  getApiKeyCountForUser,
  incrementApiKeyUsage,
  updateApiKeyUsage
};
