# BUSE Teaching Practice Platform - Quick Start Guide

## 🎯 What You Have

A complete, production-ready **web-responsive** Teaching Practice Management System with:

- ✅ Full-stack architecture (React + Node.js + PostgreSQL)
- ✅ Role-based access control (4 user types)
- ✅ Document upload & management
- ✅ Real-time feedback system
- ✅ Analytics & reporting
- ✅ Mobile-responsive design (works on any device)
- ✅ Secure authentication (JWT + bcrypt)

---

## ⚡ Get Started in 5 Minutes

### Step 1: Install Prerequisites
```bash
# Download and install:
# 1. Node.js: https://nodejs.org (v14+)
# 2. PostgreSQL: https://www.postgresql.org/download/
```

### Step 2: Create Database
```bash
# Start PostgreSQL and ensure it is running
```

### Step 3: Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env (set DB_PASSWORD if needed)
notepad .env

# Initialize database
node scripts/setup-db.js

# Start backend
npm run dev
```

**Backend running at**: `http://localhost:5000`

### Step 4: Setup Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Start frontend
npm start
```

**Frontend opens at**: `http://localhost:3000`

### Step 5: Test Login
- **Email**: `admin@buse.edu.zw`
- **Password**: the value configured as `ADMIN_INITIAL_PASSWORD` in `backend/.env`

---

## 📱 How It Works

### For Student Teachers
1. Login with your credentials
2. Upload lesson plans, videos, teaching materials
3. View feedback from mentors and supervisors
4. Track document status (pending, approved, reviewed)

### For Mentors
1. View student submissions
2. Provide constructive feedback with ratings
3. Help guide student improvement

### For Supervisors
1. Review and approve student documents
2. Schedule classroom visits
3. Generate performance evaluations

### For Coordinators
1. Manage all users and assignments
2. View system statistics and analytics
3. Generate compliance reports
4. Monitor overall progress

---

## 🚀 Key Features

| Feature | Details |
|---------|---------|
| **Document Upload** | Word, PDF, Excel, Video, Images (50MB max) |
| **Real-time Feedback** | 5-star ratings with comments |
| **Progress Tracking** | View submission status at a glance |
| **Role-Based Access** | Different dashboards for each user type |
| **Responsive Design** | Works perfectly on desktop, tablet, mobile |
| **Secure Authentication** | JWT tokens with bcrypt password hashing |
| **Audit Trails** | All activities logged for transparency |
| **Analytics** | View statistics and performance metrics |

---

## 📁 Project Structure

```
buse-tp-platform/
├── backend/               # Express.js API server
│   ├── config/           # Database & configuration
│   ├── middleware/       # Authentication middleware
│   ├── routes/           # API endpoints
│   ├── scripts/          # Database schema
│   └── server.js         # Main server file
│
├── frontend/             # React web application
│   ├── src/
│   │   ├── pages/        # Dashboard pages for each role
│   │   ├── components/   # Reusable UI components
│   │   ├── App.js        # Main app with routing
│   │   └── index.css     # Tailwind styles
│   └── public/           # Static files
│
├── README.md             # Full documentation
├── SETUP_GUIDE.md        # Detailed setup instructions
├── API_DOCUMENTATION.md  # API endpoint reference
├── DEPLOYMENT_GUIDE.md   # Production deployment guide
```

---

## 🎨 Customization

### Change Colors
Edit `frontend/src/index.css` to update BUSE brand colors:
```css
:root {
  --primary-blue: #003399;
  --sky-blue: #87CEEB;
  --navy: #001F3F;
  --gold: #FFD700;
}
```

### Add New Users
Create accounts via the Registration page, or add directly to database:
```bash
psql -U postgres -d buse_tp
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('teacher@school.edu.zw', 'hashed_password', 'Name', 'Last', 'mentor');
```

### Customize API Endpoints
Edit `.env` file or modify `src/components/DocumentUpload.js`

---

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Role-based access control (RBAC)
- ✅ Input validation on all requests
- ✅ File type and size restrictions
- ✅ SQL injection prevention
- ✅ CORS configuration
- ✅ Audit logging of all actions

---

## 🐛 Common Issues & Solutions

### "Cannot connect to database"
- Check PostgreSQL is running
- Verify .env credentials match
- Run: `psql -U postgres -c "\l"` to see databases

### "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### "Module not found" error
```bash
rm -rf node_modules package-lock.json
npm install
```

### Frontend can't reach backend
- Check backend is running on port 5000
- Edit `API_BASE_URL` in component files
- Verify CORS is enabled in backend/server.js

---


---

## 🌐 Deployment Options

### Local Deployment (Recommended)
```powershell
# Backend
cd backend
npm install
copy .env.example .env
notepad .env
node scripts/setup-db.js
npm run dev

# Frontend
cd frontend
npm install
npm start
```

### Production Deploy
See `DEPLOYMENT_GUIDE.md` for detailed instructions on local and production setups, including PostgreSQL.
- Monitoring & logging

---

## 📚 Documentation & Support
- For full project details, open `README.md`
- For setup and troubleshooting, read `SETUP_GUIDE.md`
- For API details, read `API_DOCUMENTATION.md`
- Use any modern browser on phones and tablets for responsive access
- For support, raise an issue in the repo or contact the project maintainer

## 📊 System Requirements

| Component | Requirement |
|-----------|-------------|
| **Node.js** | v14.0.0+ |
| **PostgreSQL** | v12+ |
| **RAM** | 2GB minimum |
| **Disk** | 500MB minimum |
| **Browser** | Chrome 90+, Firefox 88+, Safari 14+ |

---

## 🎓 User Credentials (After Installation)

### Admin Account
```
Email: admin@buse.edu.zw
Password: the value configured as ADMIN_INITIAL_PASSWORD in backend/.env
Role: Administrator
```

**Create more test users** via the registration page to test different roles.

---

## 📞 Support & Troubleshooting

1. **Check Logs**
   ```bash
   # Backend logs
   npm run dev  # See console output
   
   # Frontend logs
   npm start    # See browser console
   ```

2. **Database Debug**
   ```bash
   psql -U postgres -d buse_tp
   \dt              # List all tables
   SELECT * FROM users;  # View users
   ```

3. **API Testing**
   - Use Postman: https://www.postman.com/
   - See API_DOCUMENTATION.md for endpoints
   - Test with cURL examples

---

## 📈 Performance Tips

- Clear browser cache if changes don't appear
- Use incognito/private mode for testing
- Monitor browser console for errors
- Use React DevTools extension for frontend debugging
- Check network tab for API response times

---

## 🔄 Development Workflow

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm start

# Terminal 3: Database monitoring (optional)
psql -U postgres -d buse_tp
SELECT * FROM documents;
```

---

## 📚 Full Documentation

| Guide | Purpose |
|-------|---------|
| [README.md](README.md) | Complete project overview |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Detailed installation |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | API reference |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Production deployment |

---

## ✅ Checklist for Getting Started

- [ ] Node.js installed
- [ ] PostgreSQL installed and running
- [ ] Database created
- [ ] Backend installed and running (port 5000)
- [ ] Frontend installed and running (port 3000)
- [ ] Can login with admin@buse.edu.zw
- [ ] Can upload a test document
- [ ] Can view documents in dashboard
- [ ] Can provide feedback (if mentor account)
- [ ] Can approve documents (if supervisor account)

---

## 🎉 Success!

You now have a **fully functional** Teaching Practice Management System!

### Next Steps:
1. ✅ **Add Users** - Create accounts for students, mentors, supervisors
2. ✅ **Test Features** - Upload documents, give feedback, approve
3. ✅ **Customize** - Update colors, add your university logo
4. ✅ **Deploy** - Move to production following DEPLOYMENT_GUIDE.md
5. ✅ **Scale for Mobile Browsers** - Optimize responsive web layout for phone and tablet users

---

**Ready to manage teaching practice like never before!** 🎓

For questions or issues: admin@buse.edu.zw

**Version**: 1.0.0 | **Last Updated**: June 2026
