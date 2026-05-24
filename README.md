# DSO101 Assignment 3: DockerHub, GitHub Actions, and Render Deployment

**Student Name:** `Sonam Dorji Ghalley`

**Student ID:** `022030299`

**Live Link:** [Live App](https://todo-app-a2-latest.onrender.com)

## Project Overview

This assignment extends the existing full-stack To-Do application by adding a production Docker build, a DockerHub-based image registry workflow, and an automated GitHub Actions pipeline that triggers deployment on Render.com.

The application stack includes:

- Frontend: React
- Backend: Node.js, Express, Prisma
- Database: PostgreSQL
- Container registry: DockerHub
- CI/CD: GitHub Actions
- Cloud deployment: Render.com

## Steps Taken

### 1. Verified Package Scripts

I reviewed the backend `package.json` file and confirmed that the application has a production start script:

```json
"start": "node app.js"
```

I added a standardized test script using Node.js built-in test runner:

```json
"test": "node --test"
```

This allows GitHub Actions and Docker builds to run a repeatable quality gate before the image is pushed.

### 2. Created a Production Dockerfile

I created a root-level `Dockerfile` using the required `node:20-alpine` base image. The Dockerfile builds the React frontend, copies `package*.json` first to improve Docker layer caching, installs backend dependencies, copies the backend source code, generates the Prisma client, runs tests, sets `PORT=3000`, exposes port `3000`, and starts the Express app with `npm start`. Express serves the React build from the same Render service.

```dockerfile
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/. .

ENV REACT_APP_API_URL=
ENV WATCHMAN=false
RUN npm test -- --watchAll=false --watchman=false
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/. .

RUN npx prisma generate
RUN npm test

COPY --from=frontend-builder /frontend/build ./public

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
```

### 3. Added GitHub Actions Workflow

I created `.github/workflows/deploy.yml` to automate the CI/CD process whenever code is pushed to the `assignment-3` branch.

The workflow performs these steps:

1. Checks out the repository.
2. Logs in to DockerHub using GitHub Secrets.
3. Builds and pushes the Docker image as `<dockerhub-username>/todo-app:latest`.
4. Triggers a Render deployment using a secure Render deploy hook secret.

### 4. Configured GitHub Repository Secrets

In the GitHub repository, I added the following secrets under:

`Settings > Secrets and variables > Actions > New repository secret`

| Secret Name | Purpose |
|---|---|
| `DOCKERHUB_USERNAME` | DockerHub account username used for image tagging and login |
| `DOCKERHUB_TOKEN` | DockerHub access token used for secure registry authentication |
| `RENDER_DEPLOY_HOOK_URL` | Render deploy hook URL used to trigger a deployment |

### 5. Connected DockerHub to Render

On Render.com, I configured the web service to deploy from the DockerHub image:

```text
sdgv2734/todo-app:latest
```

Then I copied the Render deploy hook URL and saved it as the GitHub secret `RENDER_DEPLOY_HOOK_URL`.

### 6. Tested the CI/CD Pipeline

After committing and pushing the changes to the `assignment-3` branch, GitHub Actions automatically built the Docker image, pushed it to DockerHub, and triggered Render to deploy the latest version.

```bash
git add .
git commit -m "Add DockerHub GitHub Actions Render deployment"
git push origin assignment-3
```

## GitHub Actions Workflow

```yaml
name: Build and Deploy to Render

on:
  push:
    branches:
      - assignment-3

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build & Push Docker Image
        run: |
          docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/todo-app:latest .
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/todo-app:latest

      - name: Trigger Render Deployment
        run: curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
```

## Challenges Faced

### Handling Secrets Securely

One challenge was ensuring that DockerHub credentials and the Render deploy hook URL were not hardcoded in the workflow file. This was solved by storing them as GitHub Secrets and referencing them securely in `deploy.yml`.

### Docker Layer Caching

To make image builds faster, the Dockerfile copies `package*.json` before copying the full source code. This allows Docker to reuse the dependency installation layer when application code changes but dependencies remain the same.

### Running Tests During Image Build

The Dockerfile includes `RUN npm test`, so the image build fails if tests fail. This ensures that only code passing the test gate can be pushed to DockerHub and deployed to Render.

### Matching Runtime Port Configuration

The Dockerfile sets and exposes port `3000`, while the Node.js application can also read `process.env.PORT`. This supports cloud platforms like Render, which may inject the port dynamically during deployment.

## Learning Outcomes

- I learned how to create a production-ready Dockerfile for a Node.js application.
- I understood how Docker layer caching improves build performance.
- I learned how DockerHub acts as a container registry for storing and versioning images.
- I understood how GitHub Actions can automate testing, image building, pushing, and deployment.
- I learned how Render deploy hooks enable continuous deployment from an external CI/CD pipeline.
- I learned why secrets should be stored in GitHub Secrets instead of being committed into source code.

## Screenshots

### 1. Successful GitHub Actions Workflow Execution

Paste screenshot here:

```text
<screenshot: GitHub Actions workflow completed successfully>
```

### 2. DockerHub Image Registry State

Paste screenshot here:

```text
<screenshot: DockerHub repository showing todo-app:latest image>
```

### 3. Render Deployment Dashboard Status

Paste screenshot here:

```text
<screenshot: Render dashboard showing successful deployment>
```

## Live Link

```text
<paste final public Render URL here>
```

## Conclusion

This assignment demonstrates a complete DevOps workflow for containerizing a Node.js application, publishing the image to DockerHub, and deploying it to Render through a GitHub Actions CI/CD pipeline. The workflow improves reliability by running tests during the Docker build and improves security by storing DockerHub and Render credentials as GitHub Secrets.
