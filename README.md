# URL Shortener

A URL shortener application built with Rust (backend) and React + TypeScript + Vite + Tailwind CSS (frontend).

## Prerequisites

- Rust and Cargo
- Node.js and npm
- PostgreSQL

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a PostgreSQL database named `url_shortener`

3. Update the `.env` file with your PostgreSQL credentials:
   ```
   DATABASE_URL=postgres://username:password@localhost:5432/url_shortener
   ```

4. Run the backend server:
   ```bash
   cargo run
   ```

The backend server will start on `http://localhost:8080`

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Features

- Shorten long URLs
- Redirect to original URLs using short codes
- Modern and responsive UI
- Type-safe API communication
- PostgreSQL database for URL storage

## API Endpoints

- `POST /api/urls` - Create a new short URL
- `GET /{short_code}` - Redirect to the original URL 


# I will provide live link Soon
