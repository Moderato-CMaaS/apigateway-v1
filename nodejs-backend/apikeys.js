// API Key management operations
const crypto = require('crypto');
const config = require('./config');
const {
  createApiKey: createApiKeyInDb,
  getApiKeyById,
  getApiKeysByUserId,
  getApiKeyCountForUser,
  updateApiKeyStatus,
  updateApiKeyRules,
  deleteApiKey,
  incrementApiKeyUsage
} = require('./database');

// API Key utility functions
function generateApiKey() {
  // Generate a secure API key with prefix
  const randomPart = crypto.randomBytes(16).toString('hex');
  return `ak_${randomPart}`;
}

function hashApiKey(apiKey) {
  return crypto
    .createHash('sha256')
    .update(apiKey + config.jwtSecret)
    .digest('hex');
}

// Calculate next month's first day for quota reset
function calculateNextMonthResetDate() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString().split('T')[0];
}

// ===== API KEY OPERATIONS =====

async function createApiKey(userId, name, description, rules) {
  try {
    // Check if user already has 3 API keys
    const keyCount = await getApiKeyCountForUser(userId);
    if (keyCount >= 3) {
      throw new Error('Maximum of 3 API keys allowed per user');
    }
    
    const apiKey = generateApiKey();
    const keyHash = hashApiKey(apiKey);
    const quotaResetDate = calculateNextMonthResetDate();
    
    const createdKey = await createApiKeyInDb(userId, name, description, rules, quotaResetDate);
    
    // Update with key hash (after creation)
    await createdKey.updateOne({ key_hash: keyHash });
    
    return [createdKey, apiKey];
  } catch (error) {
    throw new Error('Failed to create API key: ' + error.message);
  }
}

async function validateApiKey(apiKey) {
  try {
    const keyHash = hashApiKey(apiKey);
    const ApiKey = require('./models/ApiKey');
    
    const result = await ApiKey.findOne({
      key_hash: keyHash,
      status: 'active'
    });
    
    if (!result) {
      throw new Error('Invalid API key');
    }
    
    return result;
  } catch (error) {
    throw new Error('Invalid API key: ' + error.message);
  }
}

function toApiKeyResponse(apiKey) {
  const remainingQuota = apiKey.monthly_quota - apiKey.current_month_usage;
  return {
    id: apiKey.id,
    name: apiKey.name,
    description: apiKey.description,
    rules: apiKey.rules,
    status: apiKey.status,
    usage_count: apiKey.usage_count,
    monthly_quota: apiKey.monthly_quota,
    current_month_usage: apiKey.current_month_usage,
    remaining_quota: remainingQuota < 0 ? 0 : remainingQuota,
    quota_reset_date: apiKey.quota_reset_date,
    created_at: apiKey.created_at,
    updated_at: apiKey.updated_at
  };
}

module.exports = {
  generateApiKey,
  hashApiKey,
  createApiKey,
  getApiKeyCountForUser,
  getApiKeyById,
  getApiKeysByUserId,
  validateApiKey,
  incrementApiKeyUsage,
  updateApiKeyStatus,
  updateApiKeyRules,
  deleteApiKey,
  toApiKeyResponse,
  calculateNextMonthResetDate
};
