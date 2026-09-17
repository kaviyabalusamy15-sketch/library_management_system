# Library Management System

A complete CRUD-based Library Management System using:
- Frontend: React + Vite
- Backend: Django REST Framework
- Database: SQLite
- API testing: Postman

## Features
- Add, view, edit and delete books
- Add, view, edit and delete members
- Issue books and return books
- Search books
- Client-side and server-side validation
- REST APIs
- SQLite database
- CORS support
- Responsive UI

## Requirements
- Python 3.10+
- Node.js 18+

## Backend setup
```bash
cd backend
python -m venv venv
```

Windows CMD:
```bash
venv\Scripts\activate
```

Then:
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at http://127.0.0.1:8000

## Frontend setup
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

## API endpoints

Books:
- GET /api/books/
- POST /api/books/
- GET /api/books/{id}/
- PUT /api/books/{id}/
- DELETE /api/books/{id}/

Members:
- GET /api/members/
- POST /api/members/
- GET /api/members/{id}/
- PUT /api/members/{id}/
- DELETE /api/members/{id}/

Loans:
- GET /api/loans/
- POST /api/loans/
- GET /api/loans/{id}/
- PUT /api/loans/{id}/
- DELETE /api/loans/{id}/

## Project flow
React UI -> Django REST API -> Django ORM -> SQLite database
