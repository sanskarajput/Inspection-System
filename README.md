
# [Inspection System 🔗](https://sanskar-inspection-system.vercel.app) 


This repository contains a simple inspection management system with a Node.js/Express backend and a Vite + React + TypeScript frontend.

## About

This project provides APIs and a frontend to manage inspections for restaurants. Bellow are the instructions for running the server locally.

## Prerequisites

- Node.js (recommended >= 18) and npm
- MongoDB (local or a hosted connection string)

## Clone the repo
```bash
git clone https://github.com/sanskarajput/Inspection-System
```

## Backend

Path: `backend/`


### Set up Environment variables in (.env)

```env
# Server
PORT=8001
NODE_ENV=development

# Database
CONNECTION_STRING=mongodb://localhost:27017/inspection_system

# JWT
JWT_SECRET=replace_this_with_a_strong_secret
JWT_EXPIRES_IN=7d

# CORS - comma separated list of allowed origins
ALLOWED_ORIGINS=http://localhost:5173
```

- `npm run dev` — start backend server with `nodemon` (restarts on change)


```bash
# 1) Install dependencies
cd backend
npm install

# 3) Run in server
npm run dev
```

## Frontend

Path: `frontend/`


### Set up Environment variables in (.env)

```env
VITE_API_BASE_URL=http://localhost:8001
```

- `npm run dev` — start Vite dev server (hot reload)

```powershell
cd frontend
npm install

# Start dev server (Vite)
npm run dev
```

🚀 Now Applicaiton is running locally. You can access it at [http://localhost:5173](http://localhost:5173)

<div align="center">
 Thank you
<div>