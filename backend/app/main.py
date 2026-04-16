from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, notes

app = FastAPI(
    title=settings.APP_NAME,
    description="A feature-rich Note Taking Application API",
    version="1.0.0",
)

# CORS configuration
origins = [
    "http://localhost:5173",  # React/Vite default port
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(notes.router)

@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.APP_NAME} API. Visit /docs for the Swagger documentation."}
