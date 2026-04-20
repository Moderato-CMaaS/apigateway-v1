// MongoDB JWT Token Model
const mongoose = require('mongoose');

const jwtTokenSchema = new mongoose.Schema({
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
  token_hash: {
    type: String,
    required: true,
    index: true
  },
  expires_at: {
    type: Date,
    required: true,
    index: true,
    expires: 0 // Auto-delete expired tokens
  },
  is_revoked: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JWTToken', jwtTokenSchema);
