// Authentication utilities and token management
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');

// Password hashing
function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function checkPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

// Token generation using standard JWT
function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email
  };
  
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiryTime,
    issuer: config.jwtIssuer,
    audience: config.jwtAudience
  });
}

// Token validation using standard JWT
function validateToken(token) {
  try {
    const payload = jwt.verify(token, config.jwtSecret, {
      issuer: config.jwtIssuer,
      audience: config.jwtAudience
    });
    return payload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Helper to extract user ID from token payload
function extractUserId(payload) {
  if (!payload.userId) {
    throw new Error('Invalid token claims');
  }
  return payload.userId;
}

// Hash token for storage
function hashToken(token) {
  return crypto
    .createHash('sha256')
    .update(token + config.jwtSecret)
    .digest('hex');
}

// Validation utilities
function isValidEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

function isValidPassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordPattern.test(password);
}

// Convert user to response format (remove sensitive fields)
function toUserResponse(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
}

module.exports = {
  hashPassword,
  checkPassword,
  generateToken,
  validateToken,
  extractUserId,
  hashToken,
  isValidEmail,
  isValidPassword,
  toUserResponse
};

function isValidPassword(password) {
  return password.length >= 8;
}

// Helper to convert user to response (remove sensitive data)
function toUserResponse(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
    is_active: Boolean(user.is_active)
  };
}

// Hash token for storage
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
  hashPassword,
  checkPassword,
  generateToken,
  validateToken,
  extractUserId,
  isValidEmail,
  isValidPassword,
  toUserResponse,
  hashToken
};
