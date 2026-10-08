# Setup & Installation Guide

## System Requirements

- **Node.js**: v14.0.0 or higher

## Step-by-Step Installation
cd buse-tp-platform
```

### 2. Database Setup

#### Install PostgreSQL
- **Windows**: Download from https://www.postgresql.org/download/windows/

#### Start PostgreSQL
- Start the PostgreSQL service from Windows Services or the installer

#### Run Database Initialization
```bash
cd backend
node scripts/setup-db.js
```

Alternatively on Windows:
```powershell
cd ..
setup-database.bat
```

### 3. Backend Setup

```bash
# Navigate to backend
cd backend
notepad .env

# Start backend server
### 4. Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies

# Optional: Create .env if using custom API URL
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start frontend development server
npm start
```

✓ Frontend will open automatically at `http://localhost:3000`

## ✓ Verification

1. **Backend Health Check**
   - Visit: `http://localhost:5000/api/health`
   - Should see: `{"status": "Server is running", ...}`

2. **Frontend Login**
   - Open: `http://localhost:3000`
   - Try admin login using the `ADMIN_INITIAL_PASSWORD` value from `backend/.env`

## 🔧 Configuration

### Backend Configuration (.env)

```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=buse_tp
DB_USER=postgres
DB_PASSWORD=

# Server
PORT=5000
NODE_ENV=development

# JWT and initial admin credentials (set unique private values)
JWT_SECRET=
JWT_EXPIRE=7d
ADMIN_INITIAL_PASSWORD=

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend Configuration

API URL can be configured in:
- `.env` file (for custom API endpoint)
- Or directly in code: `src/components/DocumentUpload.js`

## 📊 Test Users

After database initialization, the following test user is available:

**Admin Account**
- Email: `admin@buse.edu.zw`
- Password: the value configured as `ADMIN_INITIAL_PASSWORD` in `backend/.env`
- Role: Administrator

**Create additional test users** via the registration page.

## 🚀 Running in Production

### Backend Production
```bash
cd backend

# Build
npm run build

# Start
NODE_ENV=production npm start
```

### Frontend Production Build
```bash
cd frontend

# Build optimized version
npm run build

# Output in 'build' folder - ready to deploy
```

## 🐛 Troubleshooting

### Backend Won't Connect to Database
- Check PostgreSQL is running: `psql -U postgres -c "\l"`
- Verify .env database credentials
- Check if database `buse_tp` exists
- Run: `psql -U postgres -d buse_tp -c "SELECT 1;"`

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check API_BASE_URL in components
- Check CORS configuration in backend/server.js

### Port Already in Use
```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Access from Mobile Browsers

### Access from Phone on Same Network
```bash
# Find your computer's IP
ipconfig (Windows)
ifconfig (Mac/Linux)

# Access frontend from phone browser
http://<YOUR_IP>:3000

# Backend API
http://<YOUR_IP>:5000/api
```

### IMPORTANT: Update API URL in Frontend
Edit `src/components/DocumentUpload.js` and other components to use your IP:
```javascript
const API_BASE_URL = 'http://<YOUR_IP>:5000/api';
```

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Update admin password after first login
- [ ] Set NODE_ENV=production before deploying
- [ ] Use HTTPS in production (SSL certificate)
- [ ] Configure firewall rules
- [ ] Enable database backups
- [ ] Set up environment variables on production server
- [ ] Use a strong PostgreSQL password

## 📚 Additional Resources

- Express.js Docs: https://expressjs.com/
- React Docs: https://react.dev/
- PostgreSQL Docs: https://www.postgresql.org/docs/
- JWT Guide: https://jwt.io/introduction
- Tailwind CSS: https://tailwindcss.com/docs

## 🆘 Getting Help

1. Check logs: `backend.log`
2. Enable debug mode: `DEBUG=* npm run dev`
3. Contact: admin@buse.edu.zw

---

**Last Updated**: June 2026
**Version**: 1.0.0
