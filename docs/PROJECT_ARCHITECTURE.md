# Mini Inventory — System Architecture & Data Flow

This document details the architectural design, component responsibilities, and end-to-end data lifecycle of the Mini Inventory Management Application.

---

## 1. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                      |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |                       React 19 + Vite Application                         |   |
|   |                                                                           |   |
|   |  [UI Components]                                    [API Service Client]  |   |
|   |  - DashboardStats (Metrics: Value, Count) <-----\   - productApi.js       |   |
|   |  - ProductTable (Listing & Action buttons)       \--- (Fetch API Calls)   |   |
|   |  - ProductFormModal (Create & Edit validation)                            |   |
|   |  - DeleteConfirmModal (Confirmation dialog)                               |   |
|   +---------------------------------------+-----------------------------------+   |
+-------------------------------------------|---------------------------------------+
                                            |
                              HTTP / JSON via REST API
                            CORS headers checked by Django
                                            |
+-------------------------------------------v---------------------------------------+
|                                BACKEND LAYER                                      |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |                    Django 6.1 + Django REST Framework                     |   |
|   |                                                                           |   |
|   |  [CORS Middleware]          (corsheaders.middleware.CorsMiddleware)       |   |
|   |  [URL Routing]              (config/urls.py -> inventory/urls.py)         |   |
|   |  [View Layer]               (ProductViewSet with SearchFilter)            |   |
|   |  [Serialization & Validate] (ProductSerializer: bounds & non-blank checks)|   |
|   |  [ORM Model Layer]          (Product: CharField, DecimalField, Integer)   |   |
|   +---------------------------------------+-----------------------------------+   |
+-------------------------------------------|---------------------------------------+
                                            |
                                  SQL Queries generated
                                     via Django ORM
                                            |
+-------------------------------------------v---------------------------------------+
|                                DATABASE LAYER                                     |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |                      SQLite Database (db.sqlite3)                         |   |
|   |                                                                           |   |
|   |  Table: `inventory_product`                                               |   |
|   |  - id (INTEGER PRIMARY KEY AUTOINCREMENT)                                 |   |
|   |  - name (VARCHAR(100))                                                    |   |
|   |  - price (DECIMAL(10, 2))                                                 |   |
|   |  - quantity (INTEGER UNSIGNED)                                            |   |
|   |  - created_at (DATETIME)                                                  |   |
|   +---------------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Responsibilities by Layer

| Layer | Technology | Primary Responsibilities |
| :--- | :--- | :--- |
| **Presentation (Frontend)** | React 19, Vite, Vanilla CSS | Rendering responsive dashboard, calculating real-time inventory statistics from active dataset, client-side input validation, accessible modal dialogs, and user feedback (loading spinners, error banners). |
| **API Client** | Native Fetch API | Isolates network requests inside `src/api/productApi.js`. Handles baseURL configuration (`VITE_API_BASE_URL`), serializes payloads to JSON, and parses backend error responses. |
| **API & Business Logic (Backend)** | Django 6.1, Django REST Framework | Enforces HTTP methods, routes endpoints, controls CORS origins, verifies permissions, validates data integrity (non-empty strings, non-negative numbers), formats responses. |
| **Object-Relational Mapping (ORM)** | Django ORM | Translates Python model instances into parameterized SQL statements; manages transactional writes; shields against SQL injection. |
| **Persistence (Database)** | SQLite (`db.sqlite3`) | Stores tables and rows on local filesystem; ensures ACID compliance for read and write operations. |

---

## 3. End-to-End Lifecycle: Creating a Product

Here is the exact step-by-step path taken when a user clicks **"Create Product"**:

```
[User Submits Form]
         |
         v
1. Client-Side Validation (ProductFormModal.jsx)
   - Checks name is not empty or pure whitespace.
   - Checks price >= 0 and is numeric.
   - Checks quantity >= 0 and is an integer.
         |
         v
2. Network Request (productApi.js)
   - Payload: {"name": "USB-C Cable", "price": "14.99", "quantity": 50}
   - Sent via HTTP POST to: http://127.0.0.1:8000/api/products/
   - Headers: Content-Type: application/json, Accept: application/json
         |
         v
3. Django Middleware & CORS (config/settings.py)
   - `CorsMiddleware` checks the Origin header (`http://localhost:5173`).
   - If origin is in `CORS_ALLOWED_ORIGINS`, responds with `Access-Control-Allow-Origin`.
         |
         v
4. Routing & View Processing (inventory/urls.py & inventory/views.py)
   - DefaultRouter directs POST to `ProductViewSet.create`.
   - View initializes `ProductSerializer(data=request.data)`.
         |
         v
5. Serializer Validation (inventory/serializers.py)
   - `validate_name()` strips whitespace and rejects blanks.
   - `price` field verifies `min_value=Decimal("0.00")`.
   - `quantity` field verifies `min_value=0`.
   - If invalid: Immediately returns HTTP 400 Bad Request with field-keyed JSON error.
   - If valid: Calls `serializer.save()`.
         |
         v
6. Django ORM Execution
   - Django executes parameterized SQL INSERT:
     `INSERT INTO inventory_product (name, price, quantity, created_at) VALUES (?, ?, ?, ?)`
   - SQLite writes record and assigns new auto-incremented `id`.
         |
         v
7. HTTP Response Returned
   - Status: HTTP 201 Created
   - Body: {"id": 5, "name": "USB-C Cable", "price": "14.99", "quantity": 50, "created_at": "..."}
         |
         v
8. React State Update (App.jsx)
   - Prepends newly created product to `products` state array.
   - Metrics cards instantly recompute Total Products, Stock Units, and Inventory Value without a full page reload.
   - Toast banner displays: `Product "USB-C Cable" created successfully.`
```

---

## 4. How React Communicates with Django

1. **Environment-Driven Base URL**:
   The frontend uses `import.meta.env.VITE_API_BASE_URL` defined in `.env` (defaulting to `http://127.0.0.1:8000/api`). This ensures no hardcoded URLs exist in the codebase.
2. **Cross-Origin Resource Sharing (CORS)**:
   Because React runs on port `5173` and Django runs on `8000`, the browser triggers a security policy known as Same-Origin Policy.
   - For simple `GET` requests, the browser checks the `Access-Control-Allow-Origin` header sent by Django.
   - For `PUT`, `PATCH`, and `DELETE` requests, the browser first sends an `OPTIONS` preflight request.
   - The Django `django-cors-headers` middleware inspects the request origin against `CORS_ALLOWED_ORIGINS` and attaches proper permission headers so the browser allows the communication.

---

## 5. How Django ORM Communicates with SQLite

- In `config/settings.py`, the `DATABASES['default']` setting points to `BASE_DIR / 'db.sqlite3'` using `django.db.backends.sqlite3`.
- When `Product.objects.all()` is called, Django constructs a SQL query:
  ```sql
  SELECT id, name, price, quantity, created_at FROM inventory_product ORDER BY id DESC;
  ```
- The ORM converts database rows directly into Python `Product` model instances.
- The `ProductSerializer` then converts these Python model instances into native Python dictionaries, which DRF renders as JSON strings.

---

## 6. Access Control & Security Strategy

### Current Configuration (Demo Mode)
- `permission_classes = [AllowAny]`
- **Reasoning**: This is a portfolio demonstration application designed for technical reviewers and recruiters. Reviewers can immediately test creating, updating, and deleting inventory items without setting up user accounts or handling authentication tokens.

### Production Production Hardening Strategy
Before deploying to public users:
1. **Read-Only Public / Authenticated Modification**:
   Use `rest_framework.permissions.IsAuthenticatedOrReadOnly`. Public users can explore the catalog and metrics (`GET`), but modifying products (`POST`, `PUT`, `DELETE`) requires authentication.
2. **Authentication Mechanism**:
   Add Token Authentication or JWT (`djangorestframework-simplejwt`) so React sends an `Authorization: Bearer <token>` header with mutation requests.
