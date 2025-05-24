# Sheep Management System

A comprehensive web application for managing sheep farms, built with React, TypeScript, and FastAPI.

## Features

### Core Functionality
- Sheep registration and management
- Health event tracking
- Mating pair management
- User authentication and authorization
- Real-time dashboard with key metrics

### Technical Features
- Modern React with TypeScript
- FastAPI backend with SQLAlchemy
- JWT-based authentication
- Responsive design with Tailwind CSS
- RESTful API architecture

## Project Structure

```
sheep-management-system/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── api/             # API client and services
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   └── types/           # TypeScript type definitions
│   └── package.json         # Frontend dependencies
│
└── backend/                 # FastAPI backend application
    ├── app/
    │   ├── api/            # API endpoints
    │   ├── core/           # Core functionality
    │   ├── models/         # Database models
    │   └── schemas/        # Pydantic schemas
    └── requirements.txt    # Backend dependencies
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- PostgreSQL (v12 or higher)

### Frontend Setup
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

### Backend Setup
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run database migrations:
   ```bash
   alembic upgrade head
   ```

5. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users/me` - Get current user info

### Sheep Management Endpoints
- `GET /api/sheep` - List all sheep
- `POST /api/sheep` - Create new sheep
- `GET /api/sheep/{id}` - Get sheep details
- `PUT /api/sheep/{id}` - Update sheep
- `DELETE /api/sheep/{id}` - Delete sheep

### Health Event Endpoints
- `GET /api/health-events` - List health events
- `POST /api/health-events` - Create health event
- `PUT /api/health-events/{id}` - Update health event

### Mating Pair Endpoints
- `GET /api/mating-pairs` - List mating pairs
- `POST /api/mating-pairs` - Create mating pair
- `PUT /api/mating-pairs/{id}` - Update mating pair

## Frontend Components

### Pages
- `Dashboard` - Main dashboard with key metrics
- `AddSheep` - Form for adding new sheep
- `RecordHealthEvent` - Form for recording health events
- `Login` - User authentication
- `Register` - User registration

### Components
- `DashboardSummary` - Summary cards with key metrics
- `RecentHealthEvents` - Table of recent health events
- `QuickActions` - Quick access buttons for common tasks

## Development

### Code Style
- Frontend: ESLint + Prettier
- Backend: Black + isort

### Testing
- Frontend: Jest + React Testing Library
- Backend: pytest

### Deployment
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the backend:
   ```bash
   # Configure your deployment platform
   # Example for Heroku:
   heroku create
   git push heroku main
   ```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- React team for the amazing frontend framework
- FastAPI team for the high-performance backend framework
- Tailwind CSS team for the utility-first CSS framework
