# Environment Variables Setup Guide

## 📋 **Required Environment Variables**

Create a `.env` file in the `backend` directory with the following variables:

### **🔧 Server Configuration**
```env
PORT=5000
NODE_ENV=development
```

### **🗄️ Database Configuration**
```env
MONGODB_URI= mongodb+srv://kinneraravi07_db_user:RAVI@cluster0.4gqfugt.mongodb.net/college-connect?retryWrites=true&w=majority&appName=Cluster0
```

### **🔐 JWT Configuration**
```env
JWT_SECRET= zLiYaeqDLpPjq9IwxbcCdtDwuH1tr/8uYLU1iYNakXM=
JWT_EXPIRE=7d
```

### **🌐 CORS Configuration**
```env
FRONTEND_URL=https://collage-connect-frontend.onrender.com
ALLOWED_ORIGINS=https://collage-connect-frontend.onrender.com,http://localhost:3000,http://localhost:3001

```

### **🛡️ Security Configuration**
```env
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **📧 Email Configuration (Optional)**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=College Connect <noreply@collegeconnect.com>
```

### **📁 File Upload Configuration**
```env
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
```

### **⚡ Cache Configuration**
```env
CACHE_TTL=300
```

### **📝 Logging Configuration**
```env
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

### **🤖 ML Service Configuration**
```env
ML_ENABLED=true
ML_CACHE_TTL=600
ML_CONFIDENCE_THRESHOLD=0.7
```

### **🚀 Performance Configuration**
```env
COMPRESSION_ENABLED=true
HELMET_ENABLED=true
CACHE_ENABLED=true
```

### **📊 Monitoring Configuration**
```env
ENABLE_METRICS=true
METRICS_PORT=9090
```

### **🔧 Development Configuration**
```env
DEBUG=true
ENABLE_SWAGGER=true
SWAGGER_URL=/api-docs
```

### **🧪 Testing Configuration**
```env
TEST_DB_URI=mongodb://localhost:27017/college-connect-test
TEST_JWT_SECRET=test-jwt-secret
```

### **💾 Backup Configuration**
```env
BACKUP_ENABLED=false
BACKUP_SCHEDULE=0 2 * * *
BACKUP_PATH=./backups
```

### **🔔 Notification Configuration**
```env
PUSH_NOTIFICATIONS_ENABLED=false
FCM_SERVER_KEY=your-fcm-server-key
```

### **📈 Analytics Configuration**
```env
ANALYTICS_ENABLED=false
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX-X
```

### **🏷️ Custom Configuration**
```env
APP_NAME=College Connect
APP_VERSION=1.0.0
SUPPORT_EMAIL=support@collegeconnect.com
ADMIN_EMAIL=admin@collegeconnect.com
```

## 🚀 **Quick Setup**

1. **Copy the template:**
```bash
cp .env.example .env
```

2. **Edit the `.env` file:**
```bash
nano .env
```

3. **Configure essential variables:**
   - `JWT_SECRET` - Generate a strong secret key
   - `MONGODB_URI` - Your MongoDB connection string
   - `FRONTEND_URL` - Your frontend URL

## 🔑 **Generating JWT Secret**

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🌍 **Environment-Specific Configurations**

### **Development**
```env
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

### **Production**
```env
NODE_ENV=production
DEBUG=false
LOG_LEVEL=error
PORT=80
```

### **Testing**
```env
NODE_ENV=test
TEST_DB_URI=mongodb://localhost:27017/college-connect-test
```

## 🔒 **Security Checklist**

- [ ] Change default JWT secret
- [ ] Use strong passwords
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Use environment-specific configs

## 📱 **Mobile/Device Optimization**

For better performance across all devices:
```env
COMPRESSION_ENABLED=true
CACHE_ENABLED=true
ML_CACHE_TTL=600
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚨 **Important Notes**

1. **Never commit `.env` files** to version control
2. **Use different secrets** for each environment
3. **Rotate secrets** regularly in production
4. **Monitor environment variables** for security
5. **Backup configuration** regularly

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **MongoDB Connection Failed:**
   - Check `MONGODB_URI` format
   - Ensure MongoDB is running
   - Verify network connectivity

2. **JWT Errors:**
   - Verify `JWT_SECRET` is set
   - Check `JWT_EXPIRE` format
   - Ensure secret is strong enough

3. **CORS Errors:**
   - Check `FRONTEND_URL` format
   - Verify `ALLOWED_ORIGINS` includes your domain
   - Ensure no trailing slashes

4. **Performance Issues:**
   - Enable compression
   - Configure caching
   - Optimize database queries

## 📞 **Support**

For issues with environment configuration:
- Check logs: `tail -f logs/app.log`
- Verify variables: `console.log(process.env)`
- Test connections: Use provided test scripts
