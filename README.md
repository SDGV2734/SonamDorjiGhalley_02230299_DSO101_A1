# DSO101 Assignment 1
## Containerised Full-Stack To-Do Application

**Student Name:** Sonam Dorji Ghalley  
**Student ID:** 02230299

---

# 1. Introduction

This assignment presents a full-stack To-Do application built, containerised, and deployed using modern DevOps practices. The project demonstrates how a frontend, backend, and database can work together in a container-based workflow and be deployed as a live cloud application.

The application supports the following core features:

- Create tasks
- View tasks
- Update tasks
- Delete tasks

---

# 2. Technology Stack

| Layer | Technology |
|------|-------------|
| Frontend | React |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Containerisation | Docker |
| Deployment | Render |
| CI/CD | Render Blueprint |
| Version Control | Git + GitHub |

---

# 3. System Architecture

```text
+---------------------------+
|        React Client       |
|        (Frontend)         |
+------------+--------------+
             |
        HTTP REST API
             |
+------------v--------------+
|      Express Backend      |
|       Node.js Server      |
+------------+--------------+
             |
          Prisma ORM
             |
+------------v--------------+
|        PostgreSQL         |
|         Database          |
+---------------------------+
```

---

# 4. Project Directory Structure

```text
studentname_studentnumber_DSO101_A1/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── render.yaml
└── README.md
```

---

# 5. Backend Implementation

The backend is developed with Node.js and Express. It exposes REST API endpoints that allow the frontend to manage To-Do tasks. Prisma is used as the ORM to connect the backend to the PostgreSQL database.

## Backend API Endpoints

| Method | Endpoint | Description |
|------|------|------|
| GET | `/tasks` | Retrieve all tasks |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update an existing task |
| DELETE | `/tasks/:id` | Delete a task |

---

# 6. Database Schema Using Prisma

```prisma
model Task {
  id        Int     @id @default(autoincrement())
  title     String
  completed Boolean @default(false)
}
```

---

# 7. Backend Containerisation

## Backend Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node app.js"]
```

---

# 8. Backend Docker Build

```bash
docker build -t dockerhubusername/be-todo:studentid ./backend
```

After the image is built, it should appear in Docker Desktop.

![Backend Docker Build](images/docker-desktop.png)

---

# 9. Backend Docker Hub Push

```bash
docker push dockerhubusername/be-todo:studentid
```

After pushing the image, it should be visible in the Docker Hub repository.

![Backend Docker Hub](images/docker-hub.png)

---

# 10. Backend Deployment on Render

The backend service is deployed on Render using Docker. The following environment variables are required:

```env
DATABASE_URL=PostgreSQL connection string
PORT=5000
```

The PostgreSQL connection string on Render should look similar to the example below:

![Backend Render Deployment](images/db-url.png)

---

# 11. Backend API Testing

Example endpoint:

```text
https://backend-service-url.onrender.com/tasks
```

When tested in Postman, the backend should return a list of tasks. If no tasks have been created yet, the response should be an empty array.

![Backend API Test](images/psot-man-b-check.png)

---

# 12. Frontend Implementation

The frontend is built using React and communicates with the backend through HTTP requests. It provides the user interface for creating, viewing, editing, and deleting tasks.

Example API call:

```javascript
axios.get(`${process.env.REACT_APP_API_URL}/tasks`)
```

---

# 13. Frontend Environment Configuration

```env
REACT_APP_API_URL=https://backend-service-url.onrender.com
```

---

# 14. Frontend Containerisation

## Frontend Dockerfile

```dockerfile
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
```

---

# 15. Frontend Docker Build

```bash
docker build -t dockerhubusername/fe-todo:studentid ./frontend
```

After the image is built, it should appear in Docker Desktop.

![Frontend Docker Build](images/frontend-image.png)

---

# 16. Frontend Docker Hub Push

```bash
docker push dockerhubusername/fe-todo:studentid
```

After pushing the image, it should be visible in the Docker Hub repository.

![Frontend Docker Hub](images/front-dockerhub.png)

---

# 17. Frontend Deployment on Render

The frontend is also deployed on Render using Docker and configured to communicate with the backend through the `REACT_APP_API_URL` environment variable.

![Frontend Render Deployment](images/frontend-render.png)

---

# 18. Container Architecture

```text
+----------------------+
|   React Container    |
|      Frontend        |
+----------+-----------+
           |
       REST API
           |
+----------v-----------+
|  Express Container   |
|       Backend        |
+----------+-----------+
           |
        Prisma ORM
           |
+----------v-----------+
|  PostgreSQL Service  |
|       on Render      |
+----------------------+
```

---

# 19. Render Blueprint Deployment

## `render.yaml`

```yaml
services:
  - type: web
    name: be-todo
    env: docker
    plan: free
    dockerfilePath: ./backend/Dockerfile
    dockerContext: ./backend
    envVars:
      - key: DATABASE_URL
        value: postgresql://to_do_db_panq_user:4jNgb8dZqHi29By7NXaxe.......
        sync: true
      - key: PORT
        value: 5000

  - type: web
    name: fe-todo
    env: docker
    plan: free
    dockerfilePath: ./frontend/Dockerfile
    dockerContext: ./frontend
    envVars:
      - key: REACT_APP_API_URL
        value: https://be-todo-02230299.onrender.com
```

---

# 20. Deployment Pipeline

```text
Developer
   |
   | Git Push
   v
GitHub Repository
   |
   v
Render Blueprint
   |
Docker Image Build
   |
Container Deployment
   |
Live Application
```

---

# 21. Automatic Deployment Test

```bash
git add .
git commit -m "Test auto deploy"
git push
```

A successful automatic deployment should trigger a new build and redeploy the updated application. Once deployment is complete, the latest changes should be visible from the live frontend URL.

![Initial Website](images/test1.png)

---

# 23. Live Application Links

**Frontend URL:**  
https://frontend-todo-02230299.onrender.com

**Backend URL:**  
https://be-todo-02230299.onrender.com

---

# 24. Conclusion

This project demonstrates a complete DevOps workflow, from application development and database integration to Docker-based containerisation and cloud deployment on Render. It also shows how automated deployment can be achieved through a GitHub-connected Render Blueprint setup.

### NOTE: To access assignment 2 please change the branch to `assignment-2` in this GitHub repository.