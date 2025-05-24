# Kamureito Sheep Management System

A comprehensive sheep management system designed to help farmers track and manage their sheep operations efficiently.

## Features

- **Sheep Management**
  - Track individual sheep records
  - Monitor sheep health and medical history
  - Record mating and birth events
  - Manage sheep sections and movements

- **Health Monitoring**
  - Record health events and treatments
  - Track medication and vaccination schedules
  - Monitor disease outbreaks
  - Generate health reports

- **Breeding Management**
  - Track mating events
  - Record birth records
  - Monitor pregnancy status
  - Manage breeding schedules

- **Notification System**
  - Health event alerts
  - Mating and weaning reminders
  - Custom notification preferences
  - Email notifications (configurable)

## Technical Stack

- **Backend**
  - FastAPI (Python web framework)
  - SQLAlchemy (ORM)
  - PostgreSQL (Database)
  - APScheduler (Background tasks)
  - Pydantic (Data validation)

- **Frontend** (Coming Soon)
  - React
  - TypeScript
  - Material-UI
  - Redux Toolkit

## Setup Instructions

### Prerequisites

- Python 3.8+
- PostgreSQL 12+
- Node.js 14+ (for frontend)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kamureito-sheep-management.git
   cd kamureito-sheep-management
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Initialize the database:
   ```bash
   # Create database in PostgreSQL
   createdb kamureito_sheep_db
   
   # Run migrations (when implemented)
   alembic upgrade head
   ```

6. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`
API documentation will be available at `http://localhost:8000/docs`

### Frontend Setup (Coming Soon)

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

The API documentation is available at `/docs` when running the server. It provides detailed information about all available endpoints, request/response schemas, and authentication requirements.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the farming community for their valuable feedback and suggestions
