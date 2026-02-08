# Chemical Equipment Parameter Visualizer

A full-stack data visualization system that enables users to upload chemical equipment CSV datasets, analyze key parameters, and visualize insights through both Web and Desktop frontends connected to a shared Django REST backend.

This project was developed as part of the FOSSEE Screening Task and demonstrates end-to-end data handling, API integration, and UI consistency across platforms.

---

## Features

- CSV upload and validation
- Data analytics:
   - Total equipment count
   - Average flow rate
   - Average pressure
   - Average temperature
   - Equipment type distribution
- Data visualization:
   - Chart.js (Web frontend)
   - Matplotlib (Desktop frontend)
- Upload history (last 5 datasets stored)
- PDF report generation for each upload
- Basic authentication via environment variables
- Single Django backend shared by Web & Desktop apps

---

## Project Architecture
```
chemical-equipment-visualizer/
│
├── backend/                 # Django REST backend
│   ├── equipment/           # Models, serializers, views
│   └── server/              # Project settings & URLs
│
├── frontend-web/             # React + Chart.js frontend
│
├── frontend-desktop/         # PyQt5 + Matplotlib desktop app
│
└── sample_equipment_data.csv # Sample dataset for demo

```
- **Backend** handles CSV ingestion, analytics, persistence, history, and PDF generation.
- **Frontend Web** consumes REST APIs for visualization and reporting.
- **Frontend Desktop** consumes the same APIs for identical analytics and charts.

---

## Task Requirement Mapping (FOSSEE)
```
| Task Requirement                    | Implementation          |
| ----------------------------------- | ----------------------- |
| CSV Upload (Web & Desktop)          | ✅ Implemented           |
| Common Backend API                  | ✅ Django REST           |
| Data Summary API                    | ✅ Implemented           |
| Chart Visualization (Web + Desktop) | ✅ Chart.js + Matplotlib |
| Store Last 5 Uploaded Datasets      | ✅ Implemented           |
| PDF Report Generation               | ✅ Implemented           |
| Authentication                      | ✅ Basic Auth            |
| Provided Sample CSV Used            | ✅ Included              |

```

## Technologies Used

- **Backend:** Python, Django, Django REST Framework, Pandas, SQLite, ReportLab
- **Web Frontend:** React.js, Vite, Chart.js
- **Desktop Frontend:** PyQt5, Matplotlib, Requests
- **Version Control:** Git & GitHub

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

## Demo Flow

- 1.Start Django backend
- 2.Launch web or desktop frontend
- 3.Upload sample_equipment_data.csv
- 4.View analytics summary & charts
- 5.Check upload history
- 6.Download PDF report

## Sample Data

- Use the provided sample_equipment_data.csv file for testing and demonstration.

---

## Authentication

- Basic Authentication is used
- Credentials are passed securely via environment variables
- No credentials are hardcoded in the repository

---

## Notes

- Both frontends share the same REST APIs
- Backend database is generated locally via migrations
- Focus is on functional clarity, data correctness, and cross-platform consistency

---
## Author
**Ruchi Raj**
