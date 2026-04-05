# CryptoWebsite Backend

REST API server built with Node.js, Express, and MongoDB.

## Setup

```bash
npm install
cp .env.example .env   # Fill in your environment variables
npm run dev
```

## Folder Structure

```
src/
├── config/       # DB, Cloudinary, etc. configuration
├── controllers/  # Business logic handlers
├── models/       # Mongoose schemas
├── routes/       # API route declarations
├── middlewares/  # Auth, permissions, error handling
└── utils/        # Shared utility functions
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Start production server |
