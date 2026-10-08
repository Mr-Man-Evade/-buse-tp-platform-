# BUSE Teaching Practice Platform - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All requests (except `/auth/register` and `/auth/login`) require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "student@buse.edu.zw",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "studentId": "STU001"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "student@buse.edu.zw",
    "role": "student"
  }
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "student@buse.edu.zw",
  "password": "securepassword"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "student@buse.edu.zw",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }
}
```

---

## Document Endpoints

### Upload Documents
```
POST /documents/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: FormData with 'files' field (array)

Response: 201 Created
{
  "message": "Files uploaded successfully",
  "documents": [
    {
      "id": 1,
      "user_id": 1,
      "file_name": "lesson_plan.docx",
      "file_path": "uploads/uuid-lesson_plan.docx",
      "file_type": "application/vnd.ms-word...",
      "file_size": 45000,
      "status": "pending",
      "created_at": "2026-06-10T10:30:00Z"
    }
  ]
}
```

### Get My Documents
```
GET /documents/my-documents
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "user_id": 1,
    "file_name": "lesson_plan.docx",
    "status": "pending",
    "created_at": "2026-06-10T10:30:00Z"
  }
]
```

### Get All Documents (Admin/Supervisor)
```
GET /documents
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "user_id": 1,
    "file_name": "lesson_plan.docx",
    "first_name": "John",
    "last_name": "Doe",
    "status": "pending",
    "created_at": "2026-06-10T10:30:00Z"
  }
]
```

### Update Document Status
```
PATCH /documents/:id/status
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "approved"
}

Response: 200 OK
{
  "id": 1,
  "status": "approved",
  "updated_at": "2026-06-10T11:00:00Z"
}
```

---

## Feedback Endpoints

### Add Feedback
```
POST /feedback
Content-Type: application/json
Authorization: Bearer <token>

{
  "documentId": 1,
  "comment": "Great lesson plan! Well structured and engaging activities.",
  "rating": 5
}

Response: 201 Created
{
  "id": 1,
  "document_id": 1,
  "reviewer_id": 2,
  "comment": "Great lesson plan!...",
  "rating": 5,
  "created_at": "2026-06-10T10:45:00Z"
}
```

### Get Document Feedback
```
GET /feedback/document/:documentId
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "document_id": 1,
    "reviewer_id": 2,
    "first_name": "Jane",
    "last_name": "Smith",
    "comment": "Great lesson plan!...",
    "rating": 5,
    "created_at": "2026-06-10T10:45:00Z"
  }
]
```

---

## User Endpoints

### Get All Users
```
GET /users
Authorization: Bearer <token>
Role Required: coordinator, admin

Response: 200 OK
[
  {
    "id": 1,
    "email": "student@buse.edu.zw",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student",
    "student_id": "STU001",
    "created_at": "2026-06-10T09:00:00Z"
  }
]
```

### Get User Profile
```
GET /users/profile/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "email": "student@buse.edu.zw",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student",
  "student_id": "STU001",
  "created_at": "2026-06-10T09:00:00Z"
}
```

### Get Users by Role
```
GET /users/role/:role
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "email": "student1@buse.edu.zw",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student"
  },
  {
    "id": 2,
    "email": "student2@buse.edu.zw",
    "first_name": "Jane",
    "last_name": "Smith",
    "role": "student"
  }
]
```

---

## Report Endpoints

### Get System Statistics
```
GET /reports/stats
Authorization: Bearer <token>
Role Required: coordinator, admin

Response: 200 OK
{
  "totalDocuments": 125,
  "totalUsers": 45,
  "pendingDocuments": 8
}
```

### Get User Progress Report
```
GET /reports/user/:userId
Authorization: Bearer <token>

Response: 200 OK
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "student@buse.edu.zw",
  "role": "student",
  "total_documents": 15,
  "approved_documents": 12,
  "pending_documents": 2,
  "average_rating": 4.5
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid file type"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "status": 500
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200  | OK - Request successful |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input |
| 401  | Unauthorized - Missing or invalid token |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource not found |
| 500  | Internal Server Error |

---

## Document Status Values

- `pending` - Awaiting review
- `approved` - Approved by supervisor
- `rejected` - Rejected by supervisor
- `reviewed` - Reviewed by mentor

---

## User Roles

- `student` - Student Teacher
  - Upload teaching practice documents and evidence
  - Submit schemes of work, daily lesson plans, and teaching evidence
  - Receive structured feedback and analytics
  - Track progress through dashboard notifications

- `mentor` - School-based Mentor
  - Review student submissions and provide comments
  - Approve or request revisions for lesson plans and evidence
  - Communicate with students and supervisors via messaging
  - Monitor student growth and escalate concerns to coordinators

- `supervisor` - University Lecturer Supervisor
  - Monitor student compliance with teaching practice standards
  - Approve documents and provide academic feedback
  - Schedule classroom visits and evaluations
  - Collaborate with mentors for consistent assessment

- `coordinator` - TP Coordinator
  - Register users (students, mentors, supervisors) and create temporary passwords
  - Oversee deadlines, timelines, and document submissions
  - Generate compliance and performance reports
  - Facilitate cross-role communication and handle escalations
  - Maintain audit logs and accountability records

- `admin` - System Administrator
  - Register TP Coordinators and manage system settings
  - Configure backdoor operations and global controls
  - Perform all TP Coordinator tasks as needed
  - Maintain overall system security and transparency

---

## Rate Limiting

- 100 requests per 15 minutes per IP
- File upload limit: 50MB per file

---

## Example cURL Requests

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@buse.edu.zw","password":"<ADMIN_INITIAL_PASSWORD>"}'

# Upload document
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@lesson_plan.docx"

# Get system stats
curl -X GET http://localhost:5000/api/reports/stats \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add feedback
curl -X POST http://localhost:5000/api/feedback \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"documentId":1,"comment":"Great work!","rating":5}'

# Messaging
curl -X GET http://localhost:5000/api/messages/contacts \
  -H "Authorization: Bearer YOUR_TOKEN"

curl -X GET http://localhost:5000/api/messages/conversation/2 \
  -H "Authorization: Bearer YOUR_TOKEN"

curl -X POST http://localhost:5000/api/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"recipientId":2,"content":"Hello, please review the lesson plan."}'
```

---

**Last Updated**: June 2026
**API Version**: 1.0.0
