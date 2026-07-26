# Thyroid Classification System

A production-level AI-powered Thyroid Classification System with React Frontend, Spring Boot Backend, and Python FastAPI AI Microservice.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Recharts
- **Backend**: Spring Boot 3, Spring Security (JWT), Spring Data MongoDB
- **AI Service**: Python FastAPI, Scikit-learn (Mock), SHAP
- **Database**: MongoDB
- **DevOps**: Docker, Docker Compose

## Prerequisites

- Docker & Docker Compose
- Java 17+
- Node.js 18+
- Python 3.9+ (Optional if running locally without Docker)

## Setup & Running with Docker

1. **Clone the repository** (if applicable)
2. **Navigate to project root**
   ```bash
   cd "d:\Mini Project\Project"
   ```
3. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```
   This will start:
   - MongoDB on port `27017`
   - Backend on port `8080`
   - AI Service on port `8000`
   - Frontend on port `3000`

## Local Development Setup

### Backend
1. Navigate to `backend/`
2. Run `mvn spring-boot:run`
3. API Docs: `http://localhost:8080/swagger-ui.html`

### AI Service
1. Navigate to `ai-service/`
2. Install requirements: `pip install -r requirements.txt`
3. Run: `uvicorn main:app --reload --port 8000`

### Frontend
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Run: `npm run dev`
4. Access at `http://localhost:3000`

## Features

1. **Authentication**: Login/Register (Doctor Role)
2. **Dashboard**: Statistics on predictions.
3. **Patient Management**: Add, View, Search patients.
4. **AI Prediction**: Real-time thyroid prediction based on TSH, T3, T4, TPO.

## Default Credentials

- **Admin/Doctor**: Register a new user via API or Frontend.
