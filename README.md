# Kamureito Sheep Management System

A comprehensive sheep management system for tracking breeding, health, and lifecycle events of sheep.

## Features

- Sheep lifecycle management (birth, weaning, mating, sale/death)
- Breeding pair management with inbreeding prevention
- Health event tracking and notifications
- Section management (Male, General, Mating)
- Analytics and reporting
- Mobile-friendly interface with offline support

## Tech Stack

- **Backend**: Python 3.11+, FastAPI, SQLAlchemy, PostgreSQL
- **Frontend**: React 18, TypeScript, TailwindCSS, React Query
- **Authentication**: JWT with role-based access control
- **Notifications**: WebSocket + Email integration
- **Mobile**: Progressive Web App (PWA) support

## Project Structure

```
kamureito/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core functionality
│   │   ├── db/             # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic
│   ├── tests/              # Backend tests
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   └── package.json       # Node dependencies
│
└── docker/                # Docker configuration
    ├── backend/
    ├── frontend/
    └── docker-compose.yml
```

## Setup Instructions

1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Start the development servers:
   ```bash
   # Terminal 1 (Backend)
   cd backend
   uvicorn app.main:app --reload

   # Terminal 2 (Frontend)
   cd frontend
   npm run dev
   ```

## Development

- Backend API documentation available at `/docs` when running
- Frontend development server runs on port 3000
- Backend development server runs on port 8000

## License

MIT License
