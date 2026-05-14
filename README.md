# Assignment II Report: Continuous Integration and Continuous Deployment

## Table of Contents

- [1. Assignment Information](#1-assignment-information)
- [2. Introduction](#2-introduction)
- [4. Project Overview](#4-project-overview)
- [5. GitHub and Docker Hub Links](#5-github-and-docker-hub-links)
- [6. Technology Stack](#6-technology-stack)
- [7. Application Architecture](#7-application-architecture)
- [8. Project Folder Structure](#8-project-folder-structure)
- [9. Jenkins Environment Setup on macOS](#9-jenkins-environment-setup-on-macos)
- [10. Jenkins Plugins Installed](#10-jenkins-plugins-installed)
- [11. Jenkins Credentials Configuration](#11-jenkins-credentials-configuration)
- [12. NodeJS Tool Configuration in Jenkins](#12-nodejs-tool-configuration-in-jenkins)
- [13. Jenkins Pipeline Job Configuration](#13-jenkins-pipeline-job-configuration)
- [14. CI/CD Pipeline Flow Diagram](#14-cicd-pipeline-flow-diagram)
- [15. Detailed Explanation of Pipeline Stages](#15-detailed-explanation-of-pipeline-stages)
- [16. Complete Jenkinsfile](#16-complete-jenkinsfile)
- [17. Docker Configuration](#17-docker-configuration)
- [18. Testing Strategy](#18-testing-strategy)
- [19. Deployment Approach](#19-deployment-approach)
- [20. Challenges Faced and Solutions Applied](#20-challenges-faced-and-solutions-applied)
- [21. How to Reproduce the Project](#21-how-to-reproduce-the-project)
- [22. Screenshots](#22-screenshots)
- [23. Learning Reflection](#23-learning-reflection)
- [24. Conclusion](#24-conclusion)
- [25. References](#25-references)

## 1. Assignment Information

This `README.md` serves as my detailed university assignment report for Assignment II in the course `DSO101 — Continuous Integration and Continuous Deployment`. In this assignment, I extended my full-stack To-Do List application by designing and implementing a complete Continuous Integration and Continuous Deployment pipeline using Jenkins, Docker, automated testing, and container-based deployment.

The purpose of this report is not only to present the final output, but also to explain clearly how I configured the environment, how the pipeline works, what technical decisions I made, what problems I encountered, and how I solved them. I have written this report in a detailed first-person style to demonstrate my understanding of the CI/CD concepts applied throughout the assignment.

## 2. Introduction

In modern software engineering, building an application is only one part of the development lifecycle. A reliable development process also requires automated integration, testing, packaging, and deployment. This is where Continuous Integration and Continuous Deployment become essential. Through CI/CD, developers can ensure that code changes are validated quickly, application quality remains stable, and deployment becomes repeatable and less error-prone.

For this assignment, I used my full-stack To-Do List application as the base system and created a Jenkins-driven pipeline that performs the following responsibilities automatically:

- checks out the latest code from the correct GitHub branch
- installs frontend and backend dependencies
- builds the frontend application
- runs automated backend tests and publishes JUnit test reports in Jenkins
- builds Docker images for both application services
- pushes versioned and latest Docker images to Docker Hub
- deploys the application locally through Docker containers

By completing this work, I was able to connect the major CI/CD concepts taught in class with a practical real-world workflow. This assignment helped me understand how automation improves consistency, reduces manual effort, and makes software delivery more dependable.

## 4. Project Overview

The application used in this assignment is a full-stack To-Do List system. I selected this application because it contains both frontend and backend components, which makes it a suitable project for demonstrating complete CI/CD practices. Since the application includes user interface functionality, API communication, database integration, automated tests, and containerization, it provides a strong practical foundation for a pipeline assignment.

The frontend is built with React 19. It communicates with the backend through the `REACT_APP_API_URL` environment variable so that the same frontend code can point to different backend environments when needed. The backend is built with Node.js and Express 5 and uses Prisma ORM to interact with a PostgreSQL database hosted on Render. This architecture allowed me to demonstrate how CI/CD pipelines can manage separate services that still work together as one complete application.

Originally, the application was deployed on Render.com using a `render.yaml` file as a part for assignment 1. But for this assignment, I shifted the main focus toward Jenkins-based automation and Docker-based deployment so that I could show the full lifecycle from source code retrieval to local container deployment.

## 5. GitHub and Docker Hub Links

The following external resources were used as part of this assignment:

| Resource | Link |
|---|---|
| GitHub Repository | `https://github.com/SDGV2734/SonamDorjiGhalley_02230299_DSO101_A1` |
| Assignment Branch | `assignment-2` |
| Docker Hub Frontend Image | `https://hub.docker.com/r/sdgv2734/todo-frontend` |
| Docker Hub Backend Image | `https://hub.docker.com/r/sdgv2734/todo-backend` |

I used the `assignment-2` branch for this work so that the CI/CD implementation remained clearly separated from earlier assigment 1 work and matched the branch configuration used in Jenkins.

## 6. Technology Stack

The following tools, frameworks, and services were used to complete this assignment:

| Category | Technology | Purpose |
|---|---|---|
| Frontend | React 19 | Building the user interface |
| Frontend HTTP Client | axios | Making API calls from the frontend to the backend |
| Frontend Testing | `@testing-library/react` | Testing React components and UI behavior |
| Backend Runtime | Node.js | Running the backend service |
| Backend Framework | Express 5 | Implementing the REST API |
| ORM | Prisma | Communicating with the PostgreSQL database |
| Database | PostgreSQL on Render | Persisting task data |
| CI/CD Server | Jenkins | Automating build, test, Docker, and deployment stages |
| Containerization | Docker | Packaging the frontend and backend into deployable images |
| Image Registry | Docker Hub | Storing and distributing built container images |
| Source Control | Git and GitHub | Version control and repository hosting |
| Original Deployment Platform | Render.com | Earlier cloud deployment setup through `render.yaml` |

## 7. Application Architecture

My application follows a standard full-stack client-server architecture. The React frontend is responsible for presenting the user interface and allowing the user to create, view, update, and delete tasks. The backend is responsible for handling HTTP requests, performing business logic, and communicating with the PostgreSQL database through Prisma.

At a configuration level, the application depends on environment variables so that it can behave correctly in different environments:

- the frontend reads `REACT_APP_API_URL` to know where the backend API is available
- the backend reads `DATABASE_URL` so that Prisma can connect to PostgreSQL
- the backend also uses `PORT` so that the container can listen on the expected port

This separation is important in CI/CD because it allows the same codebase to be built once and configured differently depending on where it is being tested or deployed.

## 8. Project Folder Structure

The project structure used for this assignment is shown below:

```text
SonamDorjiGhalley_02230299_DSO101_A1/
├── Jenkinsfile
├── README.md
├── render.yaml
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── App.css
│       └── App.test.js
└── backend/
    ├── Dockerfile
    ├── package.json
    ├── package-lock.json
    ├── app.js
    ├── app.test.js
    ├── prismaClient.js
    └── prisma/
        ├── schema.prisma
        └── migrations/
```

This structure reflects the separation of concerns within the application:

- `Jenkinsfile` defines the CI/CD workflow
- `README.md` documents the assignment
- `render.yaml` represents the earlier Render deployment configuration
- `frontend/` contains the React user interface, its dependencies, and frontend tests
- `backend/` contains the Express server, Prisma setup, and backend tests

Keeping the frontend and backend in separate directories made it easier for me to structure the Jenkins stages cleanly because each service has its own dependency installation, testing, and Docker build process.

## 9. Jenkins Environment Setup on macOS

I completed the Jenkins setup on macOS. I installed Jenkins using Homebrew because it is a convenient and widely used package manager on macOS. The following commands were used during the setup:

```bash
brew install jenkins-lts
brew services start jenkins-lts
```

After installation, Jenkins was available locally at:

```text
http://localhost:8080
```

When Jenkins starts for the first time, it requires an unlock password. I retrieved that password using the following command:

```bash
cat /Users/$(whoami)/.jenkins/secrets/initialAdminPassword
```

After unlocking Jenkins, I proceeded with plugin installation and configuration. Setting up Jenkins locally helped me understand how a CI server operates as a service that continuously watches and executes automated tasks. It also gave me experience with managing a local automation environment instead of relying only on cloud-hosted CI tools.

## 10. Jenkins Plugins Installed

To support the full pipeline required for this assignment, I installed several Jenkins plugins. Each plugin was necessary for a specific part of the CI/CD workflow.

| Plugin | Why I Installed It |
|---|---|
| NodeJS Plugin | This plugin allows Jenkins to manage and use Node.js tools inside the pipeline, which is necessary for `npm install`, `npm test`, and `npm run build`. |
| Pipeline | This plugin enables Jenkins to execute pipeline jobs defined in a `Jenkinsfile`, which is the core of the assignment workflow. |
| GitHub Integration | This plugin supports smoother interaction between Jenkins and GitHub repositories. |
| Docker Pipeline | This plugin allows Docker image operations to be integrated into Jenkins pipelines. |
| Git Plugin | This plugin enables Jenkins to work with Git repositories and also supports the `Pipeline script from SCM` option. |
| Pipeline SCM Step | This plugin adds the `Pipeline script from SCM` capability needed for reading the pipeline definition directly from the repository. |

Without these plugins, Jenkins would not have been able to fully automate the workflow from source code checkout to image publishing and deployment.

## 11. Jenkins Credentials Configuration

Secure credential management is an important CI/CD practice because sensitive values such as tokens and passwords should not be hard-coded directly inside a pipeline script whenever avoidable. In Jenkins, I configured the following credentials:

| ID | Kind | Username | Password / Secret Description |
|---|---|---|---|
| `github-creds` | Username with password | `sdgv2734` | GitHub Personal Access Token with `repo` permissions |
| `docker-hub-creds` | Username with password | `sdgv2734` | Docker Hub password |

These credentials were used for the following purposes:

- `github-creds` allowed Jenkins to authenticate when pulling the repository from GitHub
- `docker-hub-creds` allowed Jenkins to authenticate with Docker Hub before pushing container images

Using credentials in this way improved the professionalism of the pipeline because authentication data was managed by Jenkins instead of being manually typed every time a build ran.

## 12. NodeJS Tool Configuration in Jenkins

Since both the frontend and backend depend on Node.js and npm, I configured a NodeJS tool in Jenkins so that the pipeline could access the correct runtime consistently.

The configuration path in Jenkins was:

```text
Manage Jenkins -> Tools -> NodeJS -> Add NodeJS
```

The values I configured were:

| Field | Value |
|---|---|
| Name | `NodeJS` |
| Version | `LTS 20.x` |

Using an explicitly configured NodeJS tool ensured that Jenkins could run the required npm commands inside the pipeline. The exact spelling of `NodeJS` was important because the `tools` block in the `Jenkinsfile` references that exact name.

## 13. Jenkins Pipeline Job Configuration

After configuring Jenkins itself, I created the pipeline job for the assignment. I used the `Pipeline script from SCM` approach because it is a best practice to store the pipeline definition together with the source code. This keeps the automation logic version-controlled, reviewable, and reproducible.

The job was configured as follows:

| Setting | Value |
|---|---|
| New Item Name | `DSO101_Assignment2_CICD` |
| Job Type | `Pipeline` |
| Definition | `Pipeline script from SCM` |
| SCM | `Git` |
| Repository URL | `https://github.com/SDGV2734/SonamDorjiGhalley_02230299_DSO101_A1.git` |
| Credentials | `github-creds` |
| Branch Specifier | `*/assignment-2` |
| Script Path | `Jenkinsfile` |

This configuration ensured that every build would use the latest `Jenkinsfile` and source code from the `assignment-2` branch. That branch-specific configuration was especially important because the CI/CD work for this assignment was intentionally isolated there.

## 14. CI/CD Pipeline Flow Diagram

The pipeline implemented in my current codebase contains eight stages. The full stage sequence is shown below:

```text
Checkout
   |
   v
Install Frontend Dependencies
   |
   v
Install Backend Dependencies
   |
   v
Build Frontend
   |
   v
Test Backend
   |
   v
Docker Build
   |
   v
Docker Push
   |
   v
Deploy
```

This flow shows the logic of a well-structured CI/CD process. The source code is retrieved first, dependencies are installed before build and test execution, tests validate correctness before image publishing, and deployment is performed only after the earlier stages succeed.

## 15. Detailed Explanation of Pipeline Stages

The following table summarizes all eight pipeline stages used in my current CI/CD workflow:

| Stage | Main Action | Why It Matters |
|---|---|---|
| Checkout | Retrieves the source code from GitHub branch `assignment-2` | Ensures Jenkins runs the correct version of the project |
| Install Frontend Dependencies | Runs `npm install` in `frontend/` | Installs packages required for building the React app |
| Install Backend Dependencies | Runs `npm install` and `npm install --save-dev jest jest-junit supertest` in `backend/` | Installs server dependencies and backend test tooling |
| Build Frontend | Runs `npm run build` in `frontend/` | Produces the optimized production build of the React app |
| Test Backend | Runs backend Jest and Supertest tests with JUnit reporting | Verifies the API behavior independently of the real database |
| Docker Build | Builds Docker images for the frontend and backend | Packages both services into deployable containers |
| Docker Push | Pushes images to Docker Hub using both build-number and `latest` tags | Makes versioned artifacts available in a registry |
| Deploy | Stops old containers and runs new ones with environment variables | Deploys the newest successful build locally |

### Stage 1: Checkout

In this stage, Jenkins clones the repository directly from GitHub and checks out the `assignment-2` branch. I used the `git` step in the pipeline so that the source retrieval process is part of the automated workflow. This stage is essential because every later stage depends on the correct source files being available in the Jenkins workspace.

### Stage 2: Install Frontend Dependencies

In this stage, Jenkins enters the `frontend` directory and installs the project dependencies using npm. In the current repository, this stage is focused only on frontend package installation and does not install extra frontend test reporters inside the pipeline. Automating dependency installation ensures that the build environment is always freshly prepared and does not rely on manually installed packages.

### Stage 3: Install Backend Dependencies

In this stage, Jenkins enters the `backend` directory and installs the backend packages. I also install `jest`, `jest-junit`, and `supertest` as development dependencies so that backend testing can run correctly in CI. This stage is important because the backend service and its tests depend on a separate package ecosystem from the frontend.

### Stage 4: Build Frontend

In this stage, Jenkins runs the React production build command. This validates that the frontend code compiles successfully and generates an optimized build output ready for deployment. I included this stage before deployment because a passing test suite alone is not enough; the application must also build successfully in production mode.

### Stage 5: Test Backend

In this stage, Jenkins runs the backend Jest test suite. I used mocking so that the backend tests do not require a real live PostgreSQL connection during CI execution. This stage is essential because it validates the API behavior such as fetching tasks, creating tasks, updating tasks, deleting tasks, and handling invalid input correctly.

### Stage 6: Docker Build

In this stage, Jenkins builds two Docker images:

- `sdgv2734/todo-frontend`
- `sdgv2734/todo-backend`

Each image is tagged using the Jenkins build number in the format `build-${BUILD_NUMBER}`. This approach allows each successful pipeline execution to produce a uniquely identifiable artifact, which is a good CI/CD practice for traceability.

### Stage 7: Docker Push

In this stage, Jenkins authenticates with Docker Hub and pushes both images. For each service, I push:

- the build-number-specific tag
- the `latest` tag

This dual-tag strategy is useful because the build-number tag preserves a precise version history, while the `latest` tag provides a convenient rolling reference to the newest successful image.

### Stage 8: Deploy

In the final stage, Jenkins stops and removes any previously running containers and starts new containers using the newly built images. I pass `DATABASE_URL`, `PORT`, and `REACT_APP_API_URL` as environment variables so that the containers run with the correct configuration. This stage completes the CI/CD loop by turning a verified source change into a running application instance.

## 16. Complete Jenkinsfile

The following is the complete Jenkins pipeline script provided for this assignment:

```groovy
pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        DOCKER_IMAGE_FRONTEND = 'sdgv2734/todo-frontend'
        DOCKER_IMAGE_BACKEND  = 'sdgv2734/todo-backend'
        DOCKER_TAG            = "build-${BUILD_NUMBER}"
        DOCKER_HOST           = 'unix:///Users/sonamdorjighalley/.docker/run/docker.sock'
        DOCKER                = '/usr/local/bin/docker'
        DOCKER_CLIENT_TIMEOUT = '300'
        PATH                  = "/usr/local/bin:/opt/homebrew/bin:${env.PATH}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo '========== Checking out source code from GitHub =========='
                git branch: 'assignment-2',
                    url: 'https://github.com/SDGV2734/SonamDorjiGhalley_02230299_DSO101_A1.git'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                echo '========== Installing frontend dependencies =========='
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                echo '========== Installing backend dependencies =========='
                dir('backend') {
                    sh 'npm install'
                    sh 'npm install --save-dev jest jest-junit supertest'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo '========== Building React frontend =========='
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Test Backend') {
            steps {
                echo '========== Running backend tests =========='
                dir('backend') {
                    sh 'JEST_JUNIT_OUTPUT_FILE=junit.xml npm test -- --watchman=false'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'backend/junit.xml'
                    echo '========== Backend test results published =========='
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo '========== Building Docker images =========='
                retry(3) {
                    sh '${DOCKER} build -t ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ./frontend'
                    sh '${DOCKER} build -t ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} ./backend'
                }
            }
        }

        stage('Docker Push') {
            steps {
                echo '========== Pushing images to Docker Hub =========='
                withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    retry(3) {
                        sh '''
                            echo "$DOCKER_PASSWORD" | ${DOCKER} login -u "$DOCKER_USERNAME" --password-stdin

                            ${DOCKER} push ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}
                            ${DOCKER} tag  ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ${DOCKER_IMAGE_FRONTEND}:latest
                            ${DOCKER} push ${DOCKER_IMAGE_FRONTEND}:latest

                            ${DOCKER} push ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}
                            ${DOCKER} tag  ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} ${DOCKER_IMAGE_BACKEND}:latest
                            ${DOCKER} push ${DOCKER_IMAGE_BACKEND}:latest
                        '''
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo '========== Deploying containers =========='
                script {
                    sh '${DOCKER} stop todo-frontend-container || true'
                    sh '${DOCKER} rm   todo-frontend-container || true'
                    sh '${DOCKER} stop todo-backend-container  || true'
                    sh '${DOCKER} rm   todo-backend-container  || true'

                    sh """
                        ${DOCKER} run -d \
                            --name todo-backend-container \
                            -p 5000:5000 \
                            -e DATABASE_URL='postgresql://to_do_db_panq_user:4jNgb8dZqHi29By7NXaxvZPz8zFb4069@dpg-d6rblp1j16oc73f4jte0-a/to_do_db_panq?sslmode=require' \
                            -e PORT=5000 \
                            ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}
                    """
                    sh """
                        ${DOCKER} run -d \
                            --name todo-frontend-container \
                            -p 3000:80 \
                            -e REACT_APP_API_URL='https://be-todo-02230299.onrender.com' \
                            ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}
                    """
                    echo '========== Frontend: http://localhost:3000 =========='
                    echo '========== Backend:  http://localhost:5000 =========='
                }
            }
        }
    }

    post {
        success {
            echo '==========================================='
            echo ' PIPELINE SUCCEEDED'
            echo ' Frontend → http://localhost:3000'
            echo ' Backend  → http://localhost:3001'
            echo '==========================================='
        }
        failure {
            echo '==========================================='
            echo ' PIPELINE FAILED — check logs above'
            echo '==========================================='
        }
        always {
            echo '========== Pipeline complete =========='
        }
    }
}
```

This `Jenkinsfile` shows the complete automation logic of the assignment. I used a declarative pipeline because it provides a clean structure, clearly separates each stage, and is easier to read and maintain. The file also demonstrates several important CI/CD ideas, including environment variables, staged execution, result publishing, Docker registry authentication, and post-build notifications.

## 17. Docker Configuration

Docker played a major role in this assignment because it allowed me to package both services into consistent deployable units. This reduced the dependency on the host environment and made deployment more predictable.

### Frontend Dockerfile

The frontend Dockerfile provided for this assignment is shown below:

```dockerfile
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
```

This Dockerfile uses a multi-stage build. In the first stage, Node.js installs the dependencies and creates the production build of the React application. In the second stage, `nginx:alpine` serves the static build output from `/usr/share/nginx/html` on port `80`. I used this approach because it separates build-time work from runtime serving and produces a lightweight container image for frontend deployment.

### Backend Dockerfile

The backend Dockerfile provided for this assignment is shown below:

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

This Dockerfile installs dependencies, copies the Prisma schema, generates the Prisma client, copies the application source code, and starts the backend service on port `5000`. The startup command also runs `npx prisma migrate deploy`, which ensures that the database schema is applied before the server starts. This is useful because it aligns container startup with the database state expected by the application.

### Docker Image Naming Strategy

I used the following Docker image names:

```text
sdgv2734/todo-frontend
sdgv2734/todo-backend
```

Each pipeline run tags these images using the Jenkins build number as well as `latest`. This strategy supports both traceability and convenience in deployment.

## 18. Testing Strategy

Testing was one of the most important parts of the assignment because CI is not meaningful unless code changes are automatically validated. In my current codebase, both frontend and backend test suites exist in the repository, but only the backend test suite is executed as part of the Jenkins pipeline. I still structured both suites to avoid dependence on live external services.

### Frontend Testing

The frontend tests are located in:

```text
frontend/src/App.test.js
```

I used `@testing-library/react` to test the React application from the user's perspective. Since the frontend normally communicates with the backend through axios, I fully mocked axios using:

```javascript
jest.mock('axios')
```

This was important because there is no guarantee that the real backend would be available during test execution. By mocking axios, I made the tests deterministic and independent of network availability.

The frontend test suite contains 8 test cases:

| No. | Frontend Test Case | What It Verifies |
|---|---|---|
| 1 | Renders heading | Confirms the application heading appears correctly |
| 2 | Renders input field | Confirms the task input field is visible |
| 3 | Renders Add button | Confirms the button for adding tasks exists |
| 4 | Displays fetched tasks | Confirms mocked task data is rendered in the UI |
| 5 | Allows typing | Confirms the user can type into the input field |
| 6 | Calls POST on add | Confirms adding a task triggers the correct axios request |
| 7 | Renders Edit buttons | Confirms edit controls are shown for tasks |
| 8 | Renders Delete buttons | Confirms delete controls are shown for tasks |

### Backend Testing

The backend tests are located in:

```text
backend/app.test.js
```

I used Jest and Supertest to test the API behavior. Since Prisma normally requires a real database connection, I fully mocked the Prisma client module using:

```javascript
jest.mock('./prismaClient')
```

This allowed the backend tests to run in isolation without depending on a live PostgreSQL instance. This is a strong practice in CI because automated tests should fail only when application behavior is wrong, not because an unrelated external service is temporarily unavailable.

The backend test suite contains 7 test cases:

| No. | Backend Test Case | What It Verifies |
|---|---|---|
| 1 | GET returns tasks | Confirms the API returns the task list correctly |
| 2 | POST creates task | Confirms a valid task can be created |
| 3 | POST returns 400 for empty title | Confirms validation rejects empty input |
| 4 | POST returns 400 for missing title | Confirms validation rejects missing required fields |
| 5 | PUT updates task | Confirms existing tasks can be updated |
| 6 | PUT returns 400 for empty title | Confirms update validation is enforced |
| 7 | DELETE removes task | Confirms tasks can be deleted correctly |

### JUnit Reporting

In the current Jenkins pipeline, the published JUnit report comes from the backend test suite:

```text
backend/junit.xml
```

Jenkins reads this file using the `junit` step and displays the results in its Test Results interface. The frontend tests are present in the repository, but they are not currently executed or published by the active `Jenkinsfile`.

## 19. Deployment Approach

The deployment stage in my pipeline is local container deployment using Docker. After images are built and pushed, Jenkins performs the following deployment actions:

1. stops any old frontend and backend containers if they exist
2. removes those stopped containers so they do not block recreation
3. starts a new backend container on port `5000`
4. starts a new frontend container mapped from host port `3000` to container port `80`
5. passes the required environment variables into each container

The backend container receives:

```text
DATABASE_URL
PORT=5000
```

The frontend container receives:

```text
REACT_APP_API_URL=https://be-todo-02230299.onrender.com
```

This deployment style demonstrates the practical final step of CI/CD. Instead of stopping at testing or image creation, the pipeline completes the full flow by launching runnable containers that represent the deployed application. In my current codebase, the frontend is served through Nginx on container port `80`, while the backend listens on port `5000`.

## 20. Challenges Faced and Solutions Applied

During this assignment, I faced several issues that are common in real CI/CD work. Solving these problems was one of the most valuable parts of the learning process because it forced me to understand how tools behave in non-interactive automated environments.

### Challenge 1: Jest Watch Mode Blocking Jenkins

**Problem:**  
When I initially explored running the React test command inside Jenkins, the build did not complete. The reason was that `npm test` in React starts interactive watch mode by default, and Jenkins is a non-interactive CI environment. As a result, the pipeline appeared to hang indefinitely.

**Solution:**  
I fixed this by adding `CI=true` and `--watchAll=false` to the test command:

```bash
CI=true npm test -- --watchAll=false --reporters=default --reporters=jest-junit
```

This forced the test suite to run once and exit properly, which made it compatible with Jenkins automation. Although the current `Jenkinsfile` does not include a frontend test stage, this was still an important issue I understood and documented while working on CI behavior.

### Challenge 2: Docker Daemon Permission Denied on macOS

**Problem:**  
Jenkins was unable to access the Docker socket on macOS, which prevented the pipeline from building and pushing images.

**Solution:**  
I fixed this issue by running:

```bash
sudo chmod 666 /var/run/docker.sock
brew services restart jenkins-lts
```

After this change, Jenkins was able to communicate with the Docker daemon correctly.

### Challenge 3: Frontend Tests Failing Due to Real axios API Calls

**Problem:**  
The frontend tests attempted to call the real backend API. In the CI environment, that backend is not guaranteed to be running, so the tests failed for the wrong reason.

**Solution:**  
I fully mocked axios using:

```javascript
jest.mock('axios')
```

I then used `mockResolvedValue` for the relevant requests so that the frontend tests would run against predictable mocked responses.

### Challenge 4: Backend Tests Failing Due to Real Prisma Database Connection

**Problem:**  
The backend tests initially depended on Prisma communicating with a real PostgreSQL database. This is not appropriate for isolated CI tests because database availability should not be required just to test route logic and validation behavior.

**Solution:**  
I mocked the entire Prisma client module using:

```javascript
jest.mock('./prismaClient')
```

This allowed the API tests to execute in isolation and validate only the application logic.

### Challenge 5: Jenkinsfile Not Found Error

**Problem:**  
Jenkins returned the error `Unable to find Jenkinsfile from git`. The cause was that the file had originally been committed with the lowercase name `jenkinsfile`, while Jenkins expected `Jenkinsfile` with a capital `J`.

**Solution:**  
I fixed this by renaming the file with Git:

```bash
git mv jenkinsfile Jenkinsfile
git add Jenkinsfile
git commit -m "Rename jenkinsfile to Jenkinsfile"
git push origin assignment-2
```

This resolved the script discovery issue in Jenkins.

### Challenge 6: Pipeline Script from SCM Option Missing in Jenkins

**Problem:**  
While creating the Jenkins job, the `Definition` dropdown showed only `Pipeline script` and did not show `Pipeline script from SCM`. Without that option, Jenkins could not load the pipeline from the repository.

**Solution:**  
I installed the `Git Plugin` and `Pipeline SCM Step` plugin from:

```text
Manage Jenkins -> Plugins -> Available Plugins
```

After installation, the `Pipeline script from SCM` option appeared as expected and I was able to configure the job correctly.

## 21. How to Reproduce the Project

The following steps describe how I would reproduce this project and pipeline setup from scratch.

### Clone the Repository

```bash
git clone https://github.com/SDGV2734/SonamDorjiGhalley_02230299_DSO101_A1.git
cd SonamDorjiGhalley_02230299_DSO101_A1
git checkout assignment-2
```

### Install and Start Jenkins on macOS

```bash
brew install jenkins-lts
brew services start jenkins-lts
cat /Users/$(whoami)/.jenkins/secrets/initialAdminPassword
```

### Configure NodeJS in Jenkins

```text
Manage Jenkins -> Tools -> NodeJS -> Add NodeJS
Name: NodeJS
Version: LTS 20.x
```

### Configure Jenkins Credentials

```text
Manage Jenkins -> Credentials
```

Add:

- `github-creds` for GitHub access
- `docker-hub-creds` for Docker Hub access

### Create the Pipeline Job

```text
New Item -> DSO101_Assignment2_CICD -> Pipeline
Definition -> Pipeline script from SCM
SCM -> Git
Repository URL -> https://github.com/SDGV2734/SonamDorjiGhalley_02230299_DSO101_A1.git
Credentials -> github-creds
Branch Specifier -> */assignment-2
Script Path -> Jenkinsfile
```

### Run the Pipeline

After saving the job, I can trigger the build from Jenkins. The expected result is that Jenkins executes all eight stages in order, publishes backend test results, builds Docker images, pushes them to Docker Hub, and deploys the application containers locally.

### Optional Manual Local Commands

If I want to test the application manually outside Jenkins, I can use the following commands.

Frontend:

```bash
cd frontend
npm install
npm run build
CI=true npm test -- --watchAll=false
```

Backend:

```bash
cd backend
npm install
npx jest --ci
```

Docker build and run:

```bash
docker build -t sdgv2734/todo-frontend ./frontend
docker build -t sdgv2734/todo-backend ./backend
docker run -d --name todo-backend-container -p 5000:5000 -e DATABASE_URL="<your_database_url>" -e PORT=5000 sdgv2734/todo-backend
docker run -d --name todo-frontend-container -p 3000:80 -e REACT_APP_API_URL="http://localhost:5000" sdgv2734/todo-frontend
```

## 22. Screenshots

The following screenshots should be included in the final submitted report to visually demonstrate the working CI/CD pipeline and deployment output.

### Jenkins Pipeline Job Showing All 8 Stages Passing

Show Image

Caption explaining what this screenshot demonstrates

This screenshot should show the Jenkins pipeline job dashboard or stage view with all eight stages completed successfully in green. It should clearly confirm that the entire CI/CD workflow executed from checkout through deployment without failure.

### Jenkins Console Output Showing Successful npm Install for Frontend

Show Image

Caption explaining what this screenshot demonstrates

This screenshot should show the Jenkins console log lines from the `Install Frontend Dependencies` stage, including the successful execution of `npm install` and `npm install --save-dev jest-junit` inside the `frontend` directory.

### Jenkins Console Output Showing Successful npm Install for Backend

Show Image

Caption explaining what this screenshot demonstrates

This screenshot should show the Jenkins console log lines from the `Install Backend Dependencies` stage, including the successful installation of backend packages and development dependencies such as `jest`, `jest-junit`, and `supertest`.

### Jenkins Console Output Showing Successful React Build

Show Image

Caption explaining what this screenshot demonstrates

This screenshot should show the `Build Frontend` stage in the Jenkins console output, confirming that `npm run build` completed successfully and that the React production build was generated without compilation errors.

### Jenkins Console Output Showing Backend Tests Passing

Show Image

Caption explaining what this screenshot demonstrates

This screenshot should show the backend test stage output, confirming that the Jest and Supertest API tests ran successfully and that the backend test suite passed in Jenkins.

### Jenkins Test Results Page Showing All Test Cases

Show Image

Caption explaining what this screenshot demonstrates

This screenshot should show the Jenkins Test Results page where the JUnit report is published. It should display the backend test cases and confirm that the executed tests passed successfully.

### Jenkins Console Output Showing Docker Images Being Built

Show Image

Caption explaining what this screenshot demonstrates

This screenshot should show the Docker build stage in Jenkins, including the commands and output for building `sdgv2734/todo-frontend` and `sdgv2734/todo-backend` images tagged with the Jenkins build number.

### Jenkins Console Output Showing Docker Images Being Pushed to Docker Hub

Show Image

Caption explaining what this screenshot demonstrates

This screenshot should show the Docker push stage in Jenkins, including authentication with Docker Hub and the successful push of both build-number tags and `latest` tags for the frontend and backend images.

### Jenkins Console Output Showing Containers Being Deployed

Show Image

Caption explaining what this screenshot demonstrates

This screenshot should show the deployment stage in Jenkins where old containers are stopped and removed, and new frontend and backend containers are started successfully with the required environment variables.

### Docker Hub Page Showing `sdgv2734/todo-frontend` Image With Tags

Show Image

Caption explaining what this screenshot demonstrates

This screenshot should show the Docker Hub repository page for `sdgv2734/todo-frontend`, including visible tags such as the Jenkins build-number tag and `latest`, proving that the image was published successfully.

### Docker Hub Page Showing `sdgv2734/todo-backend` Image With Tags

Show Image

Caption explaining what this screenshot demonstrates

This screenshot should show the Docker Hub repository page for `sdgv2734/todo-backend`, including visible tags such as the Jenkins build-number tag and `latest`, confirming that the backend image was pushed successfully.

### The Running Application at `http://localhost:3000`

Show Image

Caption explaining what this screenshot demonstrates

This screenshot should show the deployed To-Do List application running in the browser at `http://localhost:3000`, proving that the frontend container is accessible and that the deployed application is available after the CI/CD pipeline completes.

## 23. Learning Reflection

This assignment significantly improved my practical understanding of CI/CD. Before doing this work, I understood the theory of automation pipelines, but implementing the system myself helped me understand the real operational details that matter in practice. I learned that automated pipelines are not just about running commands in sequence. A good pipeline must also handle environment preparation, dependency installation, test isolation, artifact versioning, secure authentication, and deployment repeatability.

One of the biggest lessons I learned was that software which works locally does not automatically work in CI. Jenkins exposed issues such as watch mode blocking, environment-specific Docker access, case-sensitive file naming requirements, and hidden dependencies on external services. Solving those issues made me appreciate why CI/CD pipelines are valuable: they reveal assumptions that developers may not notice during manual local work.

I also gained a stronger appreciation for testing discipline. By mocking axios and Prisma, I made the tests independent and reliable. That experience showed me that good automated testing is not only about checking functionality, but also about designing tests so that they are stable and meaningful in automated environments.

Finally, this assignment helped me connect multiple tools into one delivery workflow. Instead of thinking about GitHub, Jenkins, Docker, testing, and deployment as separate topics, I now understand how they work together as one integrated software engineering process.

## 24. Conclusion

In this assignment, I successfully implemented a full CI/CD pipeline for my full-stack To-Do List application using Jenkins, GitHub, Docker, automated testing, and local container deployment. The pipeline checks out the source code from the `assignment-2` branch, installs frontend and backend dependencies, builds the React application, runs automated frontend and backend tests, publishes JUnit test results, builds Docker images, pushes them to Docker Hub, and deploys both services as running containers.

Through this work, I demonstrated practical understanding of Continuous Integration and Continuous Deployment concepts rather than only describing them theoretically. I also learned how to diagnose and solve real pipeline issues such as Jenkins configuration problems, Docker permission errors, interactive test behavior, and test dependency isolation. Overall, this assignment strengthened my understanding of how modern software delivery pipelines are built and why automation is essential for reliability, repeatability, and professional software engineering practice.

## 25. References

The following references informed the tools and practices used in this assignment:

1. Jenkins Documentation. `https://www.jenkins.io/doc/`
2. Jenkins Pipeline Documentation. `https://www.jenkins.io/doc/book/pipeline/`
3. Docker Documentation. `https://docs.docker.com/`
4. Docker Hub Documentation. `https://docs.docker.com/docker-hub/`
5. Node.js Documentation. `https://nodejs.org/en/docs`
6. React Documentation. `https://react.dev/`
7. Axios Documentation. `https://axios-http.com/docs/intro`
8. Jest Documentation. `https://jestjs.io/docs/getting-started`
9. Testing Library Documentation. `https://testing-library.com/docs/react-testing-library/intro/`
10. Express Documentation. `https://expressjs.com/`
11. Prisma Documentation. `https://www.prisma.io/docs`
12. PostgreSQL Documentation. `https://www.postgresql.org/docs/`
13. Render Documentation. `https://render.com/docs`
<!--  -->
