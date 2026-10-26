# Mini Inventory — Full-Stack Portfolio Application

A modern, responsive, portfolio-ready inventory management system built with **Django 6.1**, **Django REST Framework**, and **React 19** powered by **Vite**.

Designed with clean architecture, strict input validation, real-time inventory metric calculations, and a professional SaaS dashboard aesthetic.

---

## Live Demo & Repository Links

- **GitHub Repository**: `[https://github.com/your-username/django-mini-inventory](https://github.com/your-username/django-mini-inventory)` *(Update with your repo URL)*
- **Live Frontend (Vercel)**: `[https://your-inventory-demo.vercel.app](https://your-inventory-demo.vercel.app)` *(Placeholder until deployed)*
- **Live Backend API**: `[https://your-inventory-api.onrender.com/api/products/](https://your-inventory-api.onrender.com/api/products/)` *(Placeholder until deployed)*

---

## Screenshots

> Replace these placeholders with actual screenshots from your running local instance or live deployment.

| Desktop Dashboard View | Add / Edit Modal View |
| :---: | :---: |
| ![Dashboard Screenshot Placeholder](https://placehold.co/600x380/0f172a/ffffff?text=Dashboard+Metrics+%26+Product+Table) | ![Modal Screenshot Placeholder](https://placehold.co/600x380/0f172a/ffffff?text=Add+%2F+Edit+Product+Modal) |

---

## Key Features

### Backend (Django & DRF)
- **Complete RESTful CRUD API**: Full support for `GET` (list/detail), `POST` (create), `PUT` (update), `PATCH` (partial update), and `DELETE` (remove).
- **Strict Data Validation**:
  - Rejects empty, whitespace-only product names.
  - Enforces non-negative price (`>= 0.00`).
  - Enforces non-negative quantity (`>= 0`).
  - Returns structured, field-keyed HTTP 400 Bad Request error payloads.
- **Search Filtering**: Server-side name query filter (`?search=term`) using DRF's `SearchFilter`.
- **CORS Configured**: Secure cross-origin resource sharing support via `django-cors-headers` for local frontend development and configurable production origins.
- **Modern Jazzmin Admin Dashboard**: Professional SaaS theme with a dark indigo sidebar, breadcrumbs, search integration, and direct navigation links to the React client and API root.
- **Automated Test Suite**: 10 unit and API tests validating all endpoints, status codes, and constraints.

### Frontend (React & Tailwind CSS)
- **Tailwind CSS Utility Styling**: Clean, maintainable utility-based styling with zero inline `style={{...}}` attributes.
- **SaaS-Style Dashboard**: Clean, professional design with consistent typography (Inter), neutral slate palettes, and accessible contrast.
- **Real-Time Dynamic Metrics**:
  - Total Products count.
  - Total Units in stock.
  - Total Inventory Valuation (calculated dynamically as `price × quantity`).
  - Out-of-Stock count with automatic visual warning indicators.
- **Comprehensive Product Management**:
  - Clean table with stock status badges (`In Stock`, `Low Stock`, `Out of Stock`).
  - Instant client-side search filtering.
  - Reusable Add & Edit product modal with inline validation.
  - Safe deletion dialog with product name confirmation.
  - Loading indicators and floating toast notifications.
  - Empty inventory and empty search results states.

---

## Technology Stack

| Layer | Technology | Version |
| :--- | :--- | :--- |
| **Backend Language** | Python | 3.12+ |
| **Web Framework** | Django | 6.1.2 |
| **REST API Framework** | Django REST Framework | 3.18.3 |
| **CORS Middleware** | django-cors-headers | 4.9.0 |
| **Admin Theme** | django-jazzmin | 3.0.5 |
| **Local Database** | SQLite | 3.x |
| **Frontend Framework** | React.js | 19.0.0 |
| **Build Tool & Bundler** | Vite | 6.2.0 |
| **Styling** | Tailwind CSS | 3.4.17 |

---

## Project Structure

```
django-mini-inventory/
├── .venv/                         # Python virtual environment (ignored in git)
├── config/                        # Django project root configuration
│   ├── settings.py                # App settings, CORS, and environment configs
│   ├── urls.py                    # Root URL routing (/admin/, /api/)
│   ├── wsgi.py & asgi.py          # WSGI & ASGI entrypoints
├── inventory/                     # Inventory Django application
│   ├── admin.py                   # ProductAdmin definition
│   ├── apps.py                    # App configuration
│   ├── migrations/                # Database migration history
│   ├── models.py                  # Product database model
│   ├── serializers.py             # DRF ProductSerializer with field validation
│   ├── tests.py                   # Automated test suite (10 test cases)
│   ├── urls.py                    # DRF DefaultRouter for /api/products/
│   └── views.py                   # ProductViewSet with search support
├── frontend/                      # React + Vite application
│   ├── public/                    # Static public assets
│   ├── src/
│   │   ├── api/
│   │   │   └── productApi.js      # Centralized Fetch API client
│   │   ├── components/
│   │   │   ├── AlertBanner.jsx    # Floating toast notifications
│   │   │   ├── DashboardStats.jsx # Metric cards calculated from API data
│   │   │   ├── DeleteConfirmModal.jsx # Safe deletion dialog
│   │   │   ├── Navbar.jsx         # Header navigation and API status
│   │   │   ├── ProductFormModal.jsx   # Add/Edit modal with validation
│   │   │   └── ProductTable.jsx   # Product table with badges & empty states
│   │   ├── App.jsx                # Root state, data fetching, and event handlers
│   │   ├── index.css              # Custom SaaS design system styles
│   │   └── main.jsx               # React DOM bootstrap
│   ├── .env                       # Frontend local environment config
│   ├── .env.example               # Example frontend env variables
│   ├── index.html                 # HTML shell with Google Inter font
│   ├── package.json               # Frontend dependencies & build scripts
│   └── vite.config.js             # Vite configuration
├── docs/                          # Detailed architecture & guides
│   ├── API_DOCUMENTATION.md       # Full API endpoint specifications & examples
│   ├── DEPLOYMENT.md              # Production deployment (Vercel + Render + Postgres)
│   ├── LEARNING_GUIDE.md          # Comprehensive Python/Django learning & interview guide
│   └── PROJECT_ARCHITECTURE.md    # System architecture and request lifecycle
├── .env.example                   # Root backend environment variables example
├── .gitignore                     # Git ignore rules for Python, Vite, and OS files
├── db.sqlite3                     # Local SQLite database
├── manage.py                      # Django CLI management script
├── requirements.txt               # Backend Python dependencies
└── README.md                      # This documentation file
```

---

## Prerequisites

Before starting, ensure you have installed:
1. **Python 3.12+**: Check with `python --version`
2. **Node.js 18+ and npm**: Check with `node -v` and `npm -v`
3. **Windows PowerShell** (or bash on macOS/Linux)

---

## Installation & Setup (Windows PowerShell)

Open **Windows PowerShell** in the project directory (`C:\Users\Admin\Desktop\django-mini-inventory`):

### 1. Backend Setup

```powershell
# 1. Activate the Python virtual environment
.\.venv\Scripts\Activate.ps1

# (If virtual environment doesn't exist, create it: python -m venv .venv)

# 2. Install backend dependencies
pip install -r requirements.txt

# 3. Run database migrations
python manage.py migrate

# 4. (Optional) Create a Django superuser for the admin panel
python manage.py createsuperuser

# 5. Run the automated test suite to verify backend health
python manage.py test
```

### 2. Frontend Setup

```powershell
# 1. Navigate to the frontend directory
cd frontend

# 2. Install Node.js dependencies
npm install

# 3. Verify frontend builds cleanly
npm run build

# 4. Return to root directory
cd ..
```

---

## Running the Application Locally

You will need **two terminal tabs** open to run both servers concurrently:

### Terminal 1: Start Django Backend API
```powershell
.\.venv\Scripts\Activate.ps1
python manage.py runserver 127.0.0.1:8000
```
- Django API will run at: `http://127.0.0.1:8000/`
- Products Endpoint: `http://127.0.0.1:8000/api/products/`
- Django Admin Panel: `http://127.0.0.1:8000/admin/`

### Terminal 2: Start React Frontend
```powershell
cd frontend
npm run dev
```
- Vite React frontend will run at: `http://localhost:5173/`

Open your browser and navigate to `http://localhost:5173/` to use the dashboard!

---

## API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status and root endpoint catalog |
| `GET` | `/api/products/` | List all products (supports `?search=<name>`) |
| `POST` | `/api/products/` | Create a new product |
| `GET` | `/api/products/{id}/` | Retrieve a single product by ID |
| `PUT` | `/api/products/{id}/` | Full update of an existing product |
| `PATCH` | `/api/products/{id}/` | Partial update of an existing product |
| `DELETE` | `/api/products/{id}/` | Delete a product |

For detailed payloads, status codes, and validation responses, see [docs/API_DOCUMENTATION.md](file:///c:/Users/Admin/Desktop/django-mini-inventory/docs/API_DOCUMENTATION.md).

---

## Environment Variables

### Backend (`.env` or system environment)
See [.env.example](file:///c:/Users/Admin/Desktop/django-mini-inventory/.env.example):
```env
SECRET_KEY=django-insecure-change-this-in-production-demo-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000
```

### Frontend (`frontend/.env`)
See [frontend/.env.example](file:///c:/Users/Admin/Desktop/django-mini-inventory/frontend/.env.example):
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

---

## Testing & Quality Verification

### Run Backend Tests
```powershell
.\.venv\Scripts\Activate.ps1
python manage.py test
```
**Test Results**: 10 tests passing covering:
- Product list retrieval
- Single product retrieval
- Valid product creation
- Blank name rejection
- Negative price rejection
- Negative quantity rejection
- Full update (PUT)
- Partial update (PATCH)
- Deletion (DELETE)
- Name search filtering

### Run Django System Check
```powershell
python manage.py check
```

### Run Frontend Production Build Check
```powershell
cd frontend
npm run build
```

---

## Documentation Index

- **[System Architecture](file:///c:/Users/Admin/Desktop/django-mini-inventory/docs/PROJECT_ARCHITECTURE.md)**: Detailed component breakdown, request lifecycle, and data flow.
- **[API Reference](file:///c:/Users/Admin/Desktop/django-mini-inventory/docs/API_DOCUMENTATION.md)**: Request and response schemas, validation rules, and error examples.


---

## Current Limitations & Future Improvements

### Current Limitations
1. **Local SQLite Storage**: The local database file is suited for development and local demos. For cloud deployments, a managed PostgreSQL database is recommended.
2. **Open Access Control (Demo Mode)**: To facilitate portfolio reviews without mandatory logins, endpoints currently use `AllowAny`.

### Future Improvements
1. **Authentication & Roles**: Implement JWT authentication (`djangorestframework-simplejwt`) with separate Admin and Staff roles.
2. **Product Categories**: Add a `Category` model with a foreign key relationship to `Product`.
3. **CSV Export / Import**: Add bulk product export to CSV and Excel for inventory audit reports.
4. **Stock Threshold Alerts**: Automated email notifications when an item drops below a defined reorder point.
