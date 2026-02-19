# Tsubame Store Backend

FastAPI backend for Tsubame Store with JWT authentication and product management.

## Features

- **Authentication**: JWT-based login system
- **Products API**: CRUD operations for products
- **Revenue API**: Revenue data and analytics
- **Security**: Password hashing, JWT tokens
- **CORS**: Cross-origin resource sharing

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Products
- `GET /products` - Get all products
- `GET /products/{id}` - Get specific product

### Revenue
- `GET /revenue` - Get all revenue data
- `GET /revenue/summary` - Get revenue summary

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python main.py
```

Or with Docker:
```bash
docker-compose up backend
```

## Default Users

- **Admin**: admin@tsubame.com / password (any password works for demo)
- **User**: user@tsubame.com / password (any password works for demo)

## Environment Variables

- `SECRET_KEY`: JWT secret key (change in production)
- `DATABASE_URL`: Database connection string (for future database integration)
