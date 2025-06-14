# Profile Dashboard Application

This is a full-stack application that displays user profiles with skills visualization. The application consists of a React frontend and a FastAPI backend.

## Features

- User login system
- Profile page with user information
- Skills visualization using a spider/radar chart
- 404 error page
- Dockerized application for easy deployment

## Prerequisites

- Docker
- Docker Compose

## Running the Application

1. Clone this repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Start the application using Docker Compose:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- API Documentation: http://localhost:8001/docs

## Login Credentials

Para acceder a la aplicación, utiliza las siguientes credenciales:
- Username: `admin`
- Password: `admin123`

## Project Structure

```
.
├── frontend/           # React frontend application
├── backend/           # FastAPI backend application
├── docker-compose.yml # Docker compose configuration
└── README.md         # This file
```

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - Chart.js (for radar chart)
  - React Router

- Backend:
  - FastAPI
  - SQLAlchemy
  - SQLite

- Database:
  - SQLite (for simplicity)

## Development

If you want to run the application without Docker:

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
``` 