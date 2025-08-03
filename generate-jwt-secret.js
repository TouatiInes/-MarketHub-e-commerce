#!/usr/bin/env node

/**
 * JWT Secret Generator for MarketHub
 * Generates cryptographically secure JWT secrets
 */

const crypto = require('crypto');

function generateJWTSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

function generateMultipleSecrets() {
  console.log('🔐 MarketHub JWT Secret Generator\n');
  
  console.log('Generated JWT Secrets (choose one):');
  console.log('=====================================\n');
  
  for (let i = 1; i <= 3; i++) {
    const secret = generateJWTSecret();
    console.log(`Secret ${i}:`);
    console.log(secret);
    console.log('');
  }
  
  console.log('📋 Usage Instructions:');
  console.log('======================');
  console.log('1. Copy one of the secrets above');
  console.log('2. Update your .env files:');
  console.log('   - server/.env: JWT_SECRET=<your-secret>');
  console.log('   - .env: JWT_SECRET=<your-secret>');
  console.log('   - .env.production: VITE_JWT_SECRET=<your-secret>');
  console.log('3. For Vercel deployment, add to environment variables:');
  console.log('   - JWT_SECRET=<your-secret>');
  console.log('');
  console.log('⚠️  Security Notes:');
  console.log('==================');
  console.log('- Never commit JWT secrets to version control');
  console.log('- Use different secrets for development and production');
  console.log('- Store production secrets securely in Vercel dashboard');
  console.log('- Regenerate secrets if compromised');
}

// Run if called directly
if (require.main === module) {
  generateMultipleSecrets();
}

module.exports = { generateJWTSecret, generateMultipleSecrets };
