# Ripple of Change

A full-stack environmental cleanup platform for coordinating cleanup drives and helping users find suitable waste-disposal facilities.

## Highlights

- **Spring Boot REST API** for authentication, cleanup drives, facilities, hotspots, NGOs, recycling, and leaderboard features.
- **JWT-based authentication** and Spring Security integration.
- **Facility routing** that filters facilities by compatible waste type and ranks candidates by Haversine distance.
- **React, TypeScript, and Vite frontend**.
- **Python inference service** built with FastAPI, YOLOv8, and OpenCV for image-based waste detection and severity/coverage estimates.

> This repository is a project snapshot. Review configuration, model assets, and the setup notes below before deploying it publicly.

## Architecture

- `backend/api` — Java 21 / Spring Boot API, Spring Data JPA, PostgreSQL.
- `frontend` — React + TypeScript application.
- `ripple-ml-service - Copy` — Python/FastAPI inference service.

## Prerequisites

- JDK 21
- Maven 3.9+
- PostgreSQL
- Node.js and npm
- Python 3.10+ (use a version compatible with the installed ML dependencies)

## Run the backend

1. Create a PostgreSQL database named `ripple_db` (or configure another database).
2. Set the database environment variables before starting the API:

   ```bash
   export DB_URL="jdbc:postgresql://localhost:5432/ripple_db"
   export DB_USERNAME="postgres"
   export DB_PASSWORD="your-local-database-password"
   ```

3. Start the API:

   ```bash
   cd backend/api
   ./mvnw spring-boot:run
   ```

   If the Maven wrapper is not present, use `mvn spring-boot:run` with Maven installed.

The API's configured port is **8081**. Check the controller mappings for the available endpoints and their request/response formats.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Configure the frontend's API base URL for your local backend if required by the frontend configuration.

## Run the image-inference service

The service source is in `ripple-ml-service - Copy`. Create a Python virtual environment, install the service's dependencies, and start the FastAPI app with Uvicorn. Confirm the dependency list and model-weight path in `app.py` before running; the checked-in model file is large.

## Tests

Backend tests are under `backend/api/src/test`. Run them from the backend directory:

```bash
mvn test
```

## Configuration and security

- Never commit real credentials. Configure database credentials through environment variables or a local, untracked configuration file.
- If a credential was ever committed, rotate it; removing it from the current file does not remove it from Git history.
- Review JWT secrets, CORS/security rules, file uploads, and deployment settings before production use.
- Generated Python bytecode and IDE project files are excluded from the repository.

## Current limitations

- Local development defaults are not production deployment configuration.
- Verify service-to-service URLs, environment variables, API contracts, and ML dependencies for your environment.
- Add screenshots, a demo link, and verified test/build status when available.
