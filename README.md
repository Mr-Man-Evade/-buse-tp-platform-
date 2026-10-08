# BUSE Teaching Practice Management Platform

A comprehensive, web-based Teaching Practice (TP) Management & Communication System for Bindura University of Science Education (BUSE). This platform enables seamless collaboration between student teachers, mentors, supervisors, and coordinators.

## 🎯 Features

### Core Functionality
- **Role-Based Access Control**: Student Teachers, Mentors, Supervisors, Coordinators
- **Document Management**: Upload, review, and approve teaching materials (Word, PDF, Excel, Video, Images)
- **Real-time Feedback**: Mentors and supervisors provide structured feedback on submissions
- **Scheduling**: Schedule and manage classroom visits
- **Analytics & Reporting**: Generate performance reports and statistics
- **Audit Trails**: Track all system activities for transparency

### Technology Stack
- **Frontend**: React 18 with Tailwind CSS (Mobile-responsive)
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer with virus scanning support
- **Security**: bcrypt password hashing, SSL/TLS ready

### Design Theme
- **Primary Blue**: #003399
- **Sky Blue**: #87CEEB
- **Navy**: #001F3F
- **Gold**: #FFD700
- **White**: #FFFFFF

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL 16 or newer
- npm or yarn

### Installation

#### 1. **Database Setup**
```bash
# Start PostgreSQL and ensure the server is running
# Configure private database/JWT/admin values before running setup
cd backend
copy .env.example .env
notepad .env
node scripts/setup-db.js
```

Alternatively on Windows:
```powershell
cd ..
setup-database.bat
```

#### 2. **Backend Setup**
```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

#### 3. **Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional for custom API URL)
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

The frontend will open at `http://localhost:3000`

## PostgreSQL Notes

- Default connection values are `DB_HOST=localhost`, `DB_PORT=5432`, `DB_NAME=buse_tp`, `DB_USER=postgres`.
- If you set `DATABASE_URL`, it will override the individual database fields.
- The backend creates the required schema tables automatically on startup.

## 📱 User Roles

### 1. **Student Teacher**
- Upload teaching practice documents: Word, PDF, Excel, Video, and Image files
- Submit schemes of work, daily lesson plans (DLP), and teaching evidence
- Receive structured feedback from mentors and supervisors
- Track progress through dashboard analytics and notifications

### 2. **Mentor (School-Based)**
- Review student submissions and provide comments
- Approve or request revisions on lesson plans and teaching evidence
- Communicate directly with students and supervisors via messaging
- Monitor student growth and report concerns to the TP Coordinator

### 3. **Lecturer Supervisor**
- Monitor student performance and compliance with teaching practice standards
- Approve documents and provide academic feedback
- Schedule classroom visits and evaluations
- Collaborate with mentors to ensure consistency in student assessment

### 4. **TP Coordinator**
- Register other users in the system and create temporary passwords for them
- Oversee all submissions and ensure deadlines are met
- Manage timelines and generate compliance/performance reports
- Facilitate communication across all roles (students, mentors, supervisors)
- Handle escalations and emergency issues flagged by students or mentors
- Maintain audit logs for transparency and accountability

### 5. **Admin**
- Register TP Coordinators and manage system-level settings
- Configure backdoor operations and global system security
- Perform all TP Coordinator tasks when needed
- Maintain system-wide control without being registered by a coordinator

## 🏗️ Project Structure

```
buse-tp-platform/
├── backend/
│   ├── config/              # Database configuration
│   ├── middleware/          # Auth middleware
│   ├── routes/             # API routes
│   ├── scripts/            # Database initialization
│   ├── server.js           # Express app entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── tailwind.config.js
└── (No mobile workspace — web frontend only)
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login

### Documents
- `POST /api/documents/upload` - Upload documents
- `GET /api/documents/my-documents` - Get user's documents
- `GET /api/documents` - Get all documents (admin/supervisor)
- `PATCH /api/documents/:id/status` - Update document status

### Feedback
- `POST /api/feedback` - Add feedback to document
- `GET /api/feedback/document/:documentId` - Get document feedback

### Users
- `GET /api/users` - Get all users
- `GET /api/users/profile/:id` - Get user profile
- `GET /api/users/role/:role` - Get users by role

### Reports
- `GET /api/reports/stats` - System statistics
- `GET /api/reports/user/:userId` - User progress report

## 📦 Deployment

### Local Deployment
```powershell
cd backend
npm install
copy .env.example .env
notepad .env
node scripts/setup-db.js
npm run dev
```

Open a second terminal:
```powershell
cd frontend
npm install
npm start
```

## 📱 Responsive Web Design

This platform is optimized for responsive web use on desktop, tablet, and mobile browsers. The frontend is built with React and Tailwind CSS to provide a consistent experience across screen sizes.

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **Token-Based Auth**: JWT with expiration
- **Role-Based Permissions**: Middleware-enforced access control

## Repository & CI

This project is hosted privately on GitHub: https://github.com/Mr-Man-Evade/BUSE-TP_CONNECT-1

A GitHub Actions workflow has been added at `.github/workflows/ci.yml` to install dependencies and build the frontend on pushes and pull requests to `main`.

**Security note:** If you used a Personal Access Token (PAT) to create the repository, revoke it now in your GitHub account settings and prefer fine-grained tokens or the `gh` CLI for future automation.
- **Input Validation**: Express-validator for all inputs
- **File Validation**: MIME type and size checking
- **CORS Configuration**: Restricted to trusted origins
- **SQL Injection Prevention**: Parameterized queries via pg

## 🐛 Development

### Run Tests
```bash
cd backend
npm test

cd ../frontend
npm test
```

### Database Migrations
```bash
# Create new migration
npm run migrate:create

# Run migrations
npm run migrate:latest
```

## 📝 Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=buse_tp
DB_USER=root
DB_PASSWORD=
PORT=5000
NODE_ENV=development
JWT_SECRET=your_long_secret_key
JWT_EXPIRE=7d
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## 📞 Support

For issues or questions:
- Email: edube@buse.ac.zw
- phone number: +263782828857
- Issue Tracker: GitHub Issues
- Documentation: See `docs/` folder

## 📄 License

This project is proprietary to BUSE. All rights reserved.

## 🎓 About BUSE

Bindura University of Science Education (BUSE) is committed to providing world-class education in science and technology. This platform is part of our digital transformation initiative.

---

**Version**: 1.0.0  
**Last Updated**: June 2026  
**Developed by**: Evade Dube & Development Team
