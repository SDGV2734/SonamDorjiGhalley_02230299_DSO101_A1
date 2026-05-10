# To-Do List App — CI/CD Pipeline (DSO101 Assignment II)

**Student:** Sonam Dorji Ghalley
**Student ID:** 02230299
**Course:** DSO101 — Continuous Integration and Continuous Deployment
**GitHub:** https://github.com/SDGV2734/SonamDorjiGhalley_02230299_DSO101_A1
**Docker Hub Frontend:** https://hub.docker.com/r/sdgv2734/todo-frontend
**Docker Hub Backend:** https://hub.docker.com/r/sdgv2734/todo-backend

---

## Overview

This project configures a full CI/CD pipeline using Jenkins to automate
the build, test, and deployment of a full-stack To-Do List application
(React frontend + Express/Prisma backend) from Assignment 1.

---

## Pipeline Stages

| Stage | What It Does |
|---|---|
| Checkout | Pulls latest code from main branch on GitHub |
| Install Frontend Dependencies | Runs npm install in /frontend |
| Install Backend Dependencies | Runs npm install in /backend |
| Build Frontend | Runs npm run build to produce React production build |
| Test Frontend | Runs Jest tests with JUnit reporting |
| Test Backend | Runs Supertest API tests with JUnit reporting |
| Docker Build | Builds Docker images for both frontend and backend |
| Docker Push | Pushes both images to Docker Hub |
| Deploy | Runs both containers locally on ports 3000 and 3001 |

---

## How I Configured the Pipeline

### 1. Jenkins Setup (macOS)
- Installed Jenkins: `brew install jenkins-lts`
- Started Jenkins: `brew services start jenkins-lts`
- Opened Jenkins at http://localhost:8080
- Installed plugins: NodeJS Plugin, Pipeline, GitHub Integration, Docker Pipeline

### 2. Node.js in Jenkins
- Manage Jenkins → Tools → NodeJS
- Added Node.js LTS v20.x with the name `NodeJS`

### 3. GitHub Credentials
- Created a GitHub Personal Access Token (PAT) with repo permissions
- Added in Jenkins: Manage Jenkins → Credentials
  - Kind: Username with password
  - Username: sdgv2734
  - Password: GitHub PAT
  - ID: github-creds

### 4. Docker Hub Credentials
- Added in Jenkins: Manage Jenkins → Credentials
  - Kind: Username with password
  - Username: sdgv2734
  - Password: Docker Hub password
  - ID: docker-hub-creds

### 5. Tests
- Frontend: Used @testing-library/react with axios mocked via jest.mock()
- Backend: Used supertest with prismaClient mocked via jest.mock()
- Both generate JUnit XML reports consumed by Jenkins

### 6. Docker
- Frontend: Multi-stage build (Node build → nginx serve)
- Backend: Single-stage Node.js with Prisma client generation

### 7. Jenkins Pipeline Job
- New Item → Pipeline
- Definition: Pipeline script from SCM
- SCM: Git | URL: GitHub repo | Branch: main
- Script Path: Jenkinsfile

---

## Challenges Faced

### Challenge 1: Jest watch mode blocking Jenkins
**Problem:** npm test hung in interactive watch mode.
**Solution:** Added --watchAll=false and CI=true to exit after one run.

### Challenge 2: Docker permissions on macOS
**Problem:** Jenkins could not reach the Docker daemon.
**Solution:** Ran `sudo chmod 666 /var/run/docker.sock` and restarted Jenkins.

### Challenge 3: Frontend tests failing due to real axios calls
**Problem:** Tests tried to call the real backend API which isn't running in CI.
**Solution:** Mocked axios with jest.mock('axios') and provided mock resolved values.

### Challenge 4: Backend tests needing a real database
**Problem:** Prisma requires a database connection which isn't available in CI.
**Solution:** Mocked prismaClient with jest.mock('./prismaClient') so tests run in isolation.

---

## Running Locally

```bash
git clone https://github.com/SDGV2734/SonamDorjiGhalley_02230299_DSO101_A1.git
cd SonamDorjiGhalley_02230299_DSO101_A1

# Frontend
cd frontend && npm install && npm test -- --watchAll=false && npm run build

# Backend
cd ../backend && npm install && npm test

# Docker
docker build -t sdgv2734/todo-frontend ./frontend
docker build -t sdgv2734/todo-backend  ./backend
docker run -d -p 3000:80   sdgv2734/todo-frontend
docker run -d -p 3001:3001 sdgv2734/todo-backend
```

---

## Docker Hub Images

```
docker pull sdgv2734/todo-frontend:latest
docker pull sdgv2734/todo-backend:latest
```