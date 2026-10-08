# BUSE Teaching Practice Platform - Local Deployment Guide

## Overview
This project is built to run locally using PostgreSQL for the database, a Node.js/Express backend, and a React/Tailwind frontend.

## Prerequisites
- Node.js (v14+)
- npm
- PostgreSQL 16+ running locally
- Git

## Local Deployment Steps

### 1. Start PostgreSQL
Start the PostgreSQL service from Windows Services or your PostgreSQL installer.

### 2. Initialize the database
In a terminal:
```powershell
cd backend
npm install
node scripts/setup-db.js
```
This creates the `buse_tp` database and applies the required schema.

### 3. Configure the backend
Copy the environment template and edit credentials:
```powershell
copy .env.example .env
notepad .env
```
Use PostgreSQL settings such as:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=buse_tp
DB_USER=postgres
DB_PASSWORD=
```

### 4. Start the backend
```powershell
cd backend
npm run dev
```
The backend will run at `http://localhost:5000`.

### 5. Start the frontend
```powershell
cd frontend
npm install
npm start
```
The frontend will open at `http://localhost:3000`.

## Database Backup & Recovery

### Backup
```powershell
pg_dump -U postgres -d buse_tp > buse_tp_backup.sql
```

### Restore
```powershell
psql -U postgres -d buse_tp -f buse_tp_backup.sql
```

## Notes
- The primary local database is PostgreSQL.
- Replace `postgres` and `DB_PASSWORD` values with your PostgreSQL user and password if needed.
- If you want to run on a different PostgreSQL host, update `backend/.env` accordingly.
