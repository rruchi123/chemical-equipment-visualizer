# Chemical Equipment Parameter Visualizer

This is a full-stack application that allows users to upload chemical equipment CSV data, analyze key parameters, and visualize results using both Web and Desktop frontends connected to a common Django REST backend.

---

## Features

- CSV upload and processing
- Data analytics:
   - Total equipment count
   - Average flow rate
   - Average pressure
   - Average temperature
   - Equipment type distribution
- Interactive charts:
   - Chart.js (Web)
   - Matplotlib (Desktop)
- Upload history (last 5 datasets)
- PDF report generation
- Basic authentication
- Shared backend for web and desktop applications

---

## Technologies Used

- Python
- Django
- Django REST Framework
- Pandas
- SQLite
- ReportLab
- React.js
- Vite
- Chart.js
- PyQt5
- Matplotlib
- Requests
- Git & GitHub

---

## How to Run

1. Backend Setup (Django)
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate
   pip install django djangorestframework pandas reportlab django-cors-headers
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver

   ```
   Backend runs at:
   ```
   http://127.0.0.1:8000

   ```
2. Web Frontend Setup (React)
   ```bash
   cd frontend-web
   npm install
   npm run dev

   ```
   Web app runs at:
   ```
   http://localhost:5173

   ```
   Create a .env file inside frontend-web/:
   ```
   VITE_API_USERNAME=yourusername
   VITE_API_PASSWORD=yourpassword

   ```
3. Desktop Frontend Setup (PyQt5)
   ```bash
    cd frontend-desktop
    python -m venv .venv
   .venv\Scripts\activate
    pip install pyqt5 matplotlib requests
    python main.py
   
   ```
   Set environment variables (PowerShell):
   ```
   setx APP_USERNAME yourusername
   setx APP_PASSWORD yourpassword

   ```
   Restart terminal after setting variables.
   


---

## Sample Data

- Use the provided sample_equipment_data.csv file for testing and demonstration.

---

## Authentication

- Basic Authentication is used
- Credentials are managed via environment variables

---

## Notes

- Both web and desktop frontends consume the same backend APIs
- Database is generated locally using migrations
- UI focuses on clarity and functionality
