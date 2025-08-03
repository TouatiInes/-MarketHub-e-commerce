# 🚀 MarketHub Server Deployment Guide

## Overview
This guide covers deploying the MarketHub backend API to various hosting platforms.

## 🌐 Vercel Deployment (Recommended)

### Prerequisites
- Vercel account
- GitHub repository
- MongoDB Atlas database

### Step 1: Prepare for Deployment
1. Ensure `vercel.json` is in the server directory
2. Update environment variables
3. Test locally with production settings

### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to server directory
cd server

# Deploy
vercel --prod
```

### Step 3: Configure Environment Variables
In Vercel dashboard, add these environment variables:

#### Required Variables:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/markethub
JWT_SECRET=your-super-secure-production-secret-key
CLIENT_URL=https://your-frontend.vercel.app
PORT=9876
```

#### Optional Variables:
```
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Update Frontend API URL
Update your frontend environment variables:
```env
VITE_API_URL=https://your-api-domain.vercel.app/api
```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 9876

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:9876/health || exit 1

# Start server
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "9876:9876"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/markethub
      - JWT_SECRET=your-secret-key
      - CLIENT_URL=http://localhost:3000
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:
```

## ☁️ Railway Deployment

### Step 1: Connect Repository
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the server directory

### Step 2: Configure Environment
Add environment variables in Railway dashboard:
```
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
CLIENT_URL=your-frontend-url
```

### Step 3: Deploy
Railway automatically deploys on push to main branch.

## 🌊 Heroku Deployment

### Step 1: Prepare Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create markethub-api
```

### Step 2: Configure Environment
```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret-key
heroku config:set CLIENT_URL=your-frontend-url
```

### Step 3: Create Procfile
```
web: npm start
```

### Step 4: Deploy
```bash
# Add Heroku remote
heroku git:remote -a markethub-api

# Deploy
git push heroku main
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)
1. Create account at [mongodb.com](https://mongodb.com)
2. Create new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string
6. Update MONGODB_URI environment variable

### Local MongoDB (Development)
```bash
# Install MongoDB
brew install mongodb/brew/mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community

# Use local connection string
MONGODB_URI=mongodb://localhost:27017/markethub
```

## 🔒 Security Configuration

### Environment Variables
Never commit sensitive data to Git:
```bash
# Add to .gitignore
.env
.env.local
.env.production
```

### JWT Secret
Generate a secure JWT secret:
```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### CORS Configuration
Update CORS settings for production:
```javascript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

## 📊 Monitoring & Logging

### Health Checks
Set up monitoring for the health endpoint:
```
GET https://your-api.vercel.app/health
```

### Error Tracking
Consider integrating error tracking services:
- Sentry
- LogRocket
- Bugsnag

### Performance Monitoring
- New Relic
- DataDog
- Vercel Analytics

## 🧪 Testing Deployment

### Automated Tests
```bash
# Test server health
curl https://your-api.vercel.app/health

# Test authentication
curl -X POST https://your-api.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@markethub.com","password":"admin123"}'

# Test products endpoint
curl https://your-api.vercel.app/api/products
```

### Load Testing
```bash
# Install artillery
npm install -g artillery

# Create test config
echo "
config:
  target: 'https://your-api.vercel.app'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: 'Health check'
    requests:
      - get:
          url: '/health'
" > load-test.yml

# Run load test
artillery run load-test.yml
```

## 🔄 CI/CD Pipeline

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
    paths: ['server/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd server
          npm ci
          
      - name: Run tests
        run: |
          cd server
          npm test
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./server
```

## 🚨 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Test MongoDB connection
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database error:', err));
"
```

#### Environment Variables
```bash
# Check if variables are set
echo $NODE_ENV
echo $MONGODB_URI
echo $JWT_SECRET
```

#### CORS Issues
```bash
# Test CORS
curl -H "Origin: https://your-frontend.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://your-api.vercel.app/api/products
```

### Performance Issues
- Enable MongoDB indexing
- Implement caching (Redis)
- Optimize database queries
- Use connection pooling

## 📞 Support

- 📧 Email: support@markethub.com
- 🐛 Issues: [GitHub Issues](https://github.com/TouatiInes/-MarketHub-e-commerce/issues)
- 📖 API Docs: [API Documentation](./API_DOCS.md)

---

**Your MarketHub API is ready for production!** 🚀
