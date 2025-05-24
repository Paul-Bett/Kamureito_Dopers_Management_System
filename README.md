# Kamureito Dopers Management System

A comprehensive sheep management system for tracking sheep, health events, and mating pairs.

## Features

### Authentication
- User registration and login
- Password reset functionality
- Remember me option
- Secure token-based authentication
- Protected routes

### Sheep Management
- Add new sheep with detailed information
- Track sheep health events
- Record and manage mating pairs
- View and edit sheep details

### Health Tracking
- Record health events for individual sheep
- Track treatments and medications
- Monitor health history

### Mating Management
- Create and manage mating pairs
- Track mating status and dates
- Filter and sort mating pairs
- Edit and delete mating records

## Technical Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Context API for state management
- Axios for API communication

### Backend
- FastAPI (Python)
- PostgreSQL database
- JWT authentication
- SQLAlchemy ORM

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kamureito-dopers-management-system.git
cd kamureito-dopers-management-system
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:8000

# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/kamureito_db
SECRET_KEY=your-secret-key
```

5. Start the development servers:
```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
uvicorn main:app --reload
```

## Project Structure

```
kamureito-dopers-management-system/
├── frontend/
│   ├── src/
│   │   ├── api/          # API service modules
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context providers
│   │   ├── pages/        # Page components
│   │   └── types/        # TypeScript type definitions
│   └── public/           # Static assets
└── backend/
    ├── app/
    │   ├── api/          # API endpoints
    │   ├── core/         # Core functionality
    │   ├── models/       # Database models
    │   └── schemas/      # Pydantic schemas
    └── tests/            # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the Kamureito Dopers community for their support and feedback
