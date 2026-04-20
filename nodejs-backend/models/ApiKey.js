// MongoDB API Key Model
const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user_id: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  key_hash: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String
  },
  rules: {
    type: [String],
    default: ['full_access']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'revoked'],
    default: 'active',
    index: true
  },
  usage_count: {
    type: Number,
    default: 0
  },
  monthly_quota: {
    type: Number,
    default: 100
  },
  current_month_usage: {
    type: Number,
    default: 0
  },
  quota_reset_date: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
apiKeySchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('ApiKey', apiKeySchema);
