# MarketHub Environment Variables Setup

## 🔐 JWT Secret Configuration

### Current JWT Secret
Your application now uses a secure 128-character JWT secret:
```
5168942a2d3dcd03b1821276c59585bd8966940ab55829ed0e8d6c2990b6982338ebf9ebcc57fac173e07f7773d6a720268a33da81ae50d8b762de02318912bf
```

### Files Updated
- ✅ `server/.env` - Backend JWT secret
- ✅ `.env` - Main environment file
- ✅ `.env.production` - Production environment

## 🌐 Vercel Deployment Environment Variables

### Required for Production Deployment
Add these environment variables in your Vercel dashboard:

#### Authentication & Security
```
JWT_SECRET=5168942a2d3dcd03b1821276c59585bd8966940ab55829ed0e8d6c2990b6982338ebf9ebcc57fac173e07f7773d6a720268a33da81ae50d8b762de02318912bf
NODE_ENV=production
```

#### Database (if deploying backend)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/markethub
```

#### CORS & Client
```
CLIENT_URL=https://markethub-store-2025.vercel.app
```

#### Optional Features
```
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📋 How to Add Environment Variables in Vercel

### Step 1: Go to Project Settings
1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your `markethub-store-2025` project
3. Go to "Settings" tab
4. Click "Environment Variables"

### Step 2: Add Variables
For each variable above:
1. Click "Add New"
2. Enter the key (e.g., `JWT_SECRET`)
3. Enter the value
4. Select environment: `Production`, `Preview`, `Development`
5. Click "Save"

### Step 3: Redeploy
After adding variables:
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"

## 🔄 Generating New JWT Secrets

### Using the Generator Script
```bash
node generate-jwt-secret.js
```

### Manual Generation
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🛡️ Security Best Practices

### JWT Secret Security
- ✅ Use cryptographically secure random generation
- ✅ Minimum 64 characters (128 recommended)
- ✅ Different secrets for dev/staging/production
- ✅ Never commit secrets to version control
- ✅ Rotate secrets periodically

### Environment File Security
- ✅ Add `.env*` to `.gitignore`
- ✅ Use Vercel dashboard for production secrets
- ✅ Document required variables
- ✅ Validate environment on startup

## 🚀 Deployment Checklist

### Before Deploying
- [x] JWT secret generated and configured
- [x] Environment files updated
- [x] Production environment variables documented
- [ ] Add variables to Vercel dashboard
- [ ] Test authentication endpoints
- [ ] Verify CORS configuration

### After Deploying
- [ ] Test JWT token generation
- [ ] Verify user authentication
- [ ] Check API security
- [ ] Monitor for errors

## 🔧 Troubleshooting

### Common Issues

#### "Invalid JWT Secret" Error
- Check JWT_SECRET is set in environment
- Verify secret is at least 32 characters
- Ensure no extra spaces or newlines

#### Authentication Fails
- Verify JWT_SECRET matches between frontend/backend
- Check token expiration settings
- Validate CORS configuration

#### Environment Variables Not Loading
- Check variable names (case-sensitive)
- Verify Vercel dashboard configuration
- Redeploy after adding variables

### Debug Commands
```bash
# Check environment variables
node -e "console.log(process.env.JWT_SECRET ? 'JWT_SECRET is set' : 'JWT_SECRET missing')"

# Test JWT generation
node -e "const jwt = require('jsonwebtoken'); console.log(jwt.sign({test: true}, process.env.JWT_SECRET))"
```

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Verify environment variables in Vercel dashboard
3. Check deployment logs in Vercel
4. Test locally with same environment variables
