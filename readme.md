# URL Shortening Service

This repository contains a **URL Shortening Service** based on the [URL Shortening Service Roadmap](https://roadmap.sh/projects/url-shortening-service). It is a simple, efficient project built with a focus on **monorepository setup** using npm workspaces, ensuring shared common types between both the frontend and backend.

## Features

- Basic frontend integrated with the backend.
- **Monorepo structure** for easy management of frontend and backend with shared types.
- Built using **MERN stack** with a focus on developer tooling like TypeScript, Prettier, ESLint, and Vite for a modern development workflow.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Express, MongoDB, Mongoose, TypeScript
- **Database**: MongoDB
- **Developer Tools**: 
  - TypeScript for static type checking
  - Prettier for code formatting
  - ESLint for linting
  - Vite for frontend build and dev environment
  - npm workspaces for monorepo setup

## Requirements

- **Node.js**: `v20.15.1` or above
- **npm**: `v10.7.0` or above

## Getting Started

Clone the repository and set up your environment variables.

### Environment Variables

At the root directory, create an `.env` file and add the following:

```
VITE_BACKEND_URL= # URL where your backend is running
PORT=             # Port to run your backend
ORIGIN=           # URL of the frontend
MONGODB_URI=      # MongoDB connection URL
```

### Installation

Once you've set up your environment, run the following commands:

```bash
npm install
npm run dev
```

## API Endpoints

The APIs are same as the ones mentioned in the official [URL Shortening Service Roadmap](https://roadmap.sh/projects/url-shortening-service).

## Future Development Plans

- **JWT Authentication**: Adding user authentication using JSON Web Tokens for secure URL management.
- **Husky Integration**: Implementing Husky in the frontend to automate pre-commit hooks for code quality.
- **gRPC**: Exploring and implementing **gRPC** for optimized communication between services as part of my learning journey.
