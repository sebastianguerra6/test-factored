from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
import json

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./profiles.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)
    position = Column(String)
    avatar_url = Column(String)
    skills = Column(String)  # Stored as JSON string

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class Skill(BaseModel):
    name: str
    level: float

class UserBase(BaseModel):
    username: str
    name: str
    position: str
    avatar_url: str
    skills: List[Skill]

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

# FastAPI app
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database with dummy data
def init_db():
    db = SessionLocal()
    try:
        # Check if we already have data
        if db.query(User).first() is None:
            dummy_user = User(
                username="admin",
                password="admin123",  # In a real app, this would be hashed
                name="Sebastian Andres Guerra Rodriguez",
                position="Ingeniero Informatico",
                avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=John",
                skills=json.dumps([
                    {"name": "Python", "level": 0.9},
                    {"name": "SQL", "level": 0.8},
                    {"name": "Java", "level": 0.7},
                    {"name": "Metasploit", "level": 0.85},
                    {"name": "React", "level": 0.75}
                ])
            )
            db.add(dummy_user)
            db.commit()
    finally:
        db.close()

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

# API endpoints
@app.post("/login")
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == credentials.username).first()
    if not user or user.password != credentials.password:  # In a real app, use proper password hashing
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful"}

@app.get("/profile/{username}", response_model=UserResponse)
def get_profile(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Convert skills JSON string to list of Skill objects
    user_dict = {
        "id": user.id,
        "username": user.username,
        "name": user.name,
        "position": user.position,
        "avatar_url": user.avatar_url,
        "skills": json.loads(user.skills)
    }
    return user_dict 