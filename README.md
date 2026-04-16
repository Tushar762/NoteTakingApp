# Note Taking Application - Technical Overview

Welcome to the Note Taking Application! This document explains exactly what we built, the technologies used, and how everything connects together.

## 🏗 System Architecture

The application is split into two independent parts (a **Full-Stack** architecture):
1. **Backend (API)**: Powered by Python and FastAPI. It communicates with the PostgreSQL database and serves data to the frontend securely.
2. **Frontend (UI)**: Powered by React and Vite. It renders the visual interface in the browser and calls the Backend API to get/save data.

---



### Start the Backend
Open a terminal in the folder: `d:\NoteTakingApplication\backend`
```powershell
# Create up and sync the Database Tables automatically:
alembic upgrade head

# Start the Python Server:
uvicorn app.main:app --reload
```

### Start the Frontend
Open a *second* terminal in the folder: `d:\NoteTakingApplication\frontend`
```powershell
# Launch the react interface:
npm run dev
```

You can now click the `http://localhost:5173` link in the terminal to view your Note Taking App!
