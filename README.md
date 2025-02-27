# Blog Application

This repository contains a full-stack blog application with a NestJS backend and an Angular frontend. The application supports social login (Google/Facebook), JWT authentication, and CRUD operations for posts.

> **Note:** This repository is provided with read-only access.

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Database Setup & Sample Data Import](#database-setup--sample-data-import)
- [Testing](#testing)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [Deployment](#deployment)

## Project Overview

The Blog Application is designed to allow users to log in via Google or Facebook, view their dashboard with posts, create new posts, and view individual post details. The backend is built with NestJS, and the frontend uses Angular. Both parts of the application are built using TypeScript.

- **Frontend:** Angular, running on port **4200**
- **Backend:** NestJS, running on port **3000**
- **API Documentation:** Swagger UI available at [http://localhost:3000/api/docs#/](http://localhost:3000/api/docs#/)

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or later)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- For deployment: [Terraform](https://www.terraform.io/), Docker, and AWS CLI configured

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/srivastavapravesh/blog-jk.git
   cd blog-application


2. **Install Dependencies for Both Projects**

   - **Frontend:**
     ```bash
     cd frontend
     npm install
     ```
   - **Backend:**
     ```bash
     cd ../backend
     npm install
     ```

## Frontend Setup

1. **Development Server**
   - To start the Angular development server:
     ```bash
     npm run start
     ```
   - The application will be available at [http://localhost:4200](http://localhost:4200).

2. **Social Login Configuration**
   - Ensure that the appropriate Google and Facebook Client IDs are configured in your environment or configuration files.

3. **Routing & Components**
   - The frontend includes a login page, a dashboard page, a create post page, and a post detail page.

---

## Backend Setup

1. **Development Server**
   - To start the NestJS backend in development mode:
     ```bash
     npm run start:dev
     ```
   - The backend will run on [http://localhost:3000](http://localhost:3000).

2. **API Endpoints**
   - **/login:** Handles social login using Passport and generates a JWT.
   - **/posts:** Provides CRUD operations for posts.
   
3. **Configuration**
   - Ensure that your environment variables (e.g., database credentials, JWT keys, OAuth credentials) are set correctly in a `.env` file or via your configuration system.
   - JWT keys (private and public) should be stored in a secure `keys` folder. Example structure:
     ```
     /keys
       ├── private.pem
       └── public.pem
     ```

4. **Swagger Documentation**
   - Swagger UI is available at: [http://localhost:3000/api/docs#/](http://localhost:3000/api/docs#/)

---

## Database Setup & Sample Data Import

1. **Database**
   - The backend uses PostgreSQL (or your configured database). Update your DB settings in your configuration.
   - With `synchronize: true` enabled in TypeORM, the database schema is auto-generated on application startup.

2. **Sample Data Import**
   - Test data is generated using Faker.
   - If a seeding script is implemented, run:
     ```bash
     npm run seed
     ```
   - This script will populate the database with sample users and posts.

---

## Testing

### Backend Testing

- **Unit Tests:**
  ```bash
  npm run test
  ```
- **End-to-End (E2E) Tests:**
  ```bash
  npm run test:e2e
  ```

### Frontend Testing

- **Unit Tests (Angular/Karma):**
  ```bash
  npm run test
  ```
- **Integration Tests (Cypress, if configured):**
  ```bash
  npm run cy:open
  ```

---

## API Documentation

- Swagger UI for the backend is accessible at:
  [http://localhost:3000/api/docs#/](http://localhost:3000/api/docs#/)
- This provides interactive documentation and allows you to test endpoints.

---
