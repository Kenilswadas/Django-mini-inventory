# Mini Inventory — REST API Reference

Base URL for local development: `http://127.0.0.1:8000/api`

All request and response bodies use standard **JSON** (`application/json`).

---

## Overview of Endpoints

| Endpoint | HTTP Method | Action | Description |
| :--- | :--- | :--- | :--- |
| `/api/` | `GET` | Root Discovery | Shows API project status and entry points |
| `/api/products/` | `GET` | List | Returns all products (ordered newest first, supports `?search=`) |
| `/api/products/` | `POST` | Create | Creates and persists a new product |
| `/api/products/{id}/` | `GET` | Retrieve | Returns a single product by primary key `id` |
| `/api/products/{id}/` | `PUT` | Update | Updates all fields of a product |
| `/api/products/{id}/` | `PATCH` | Partial Update | Updates selected fields of a product |
| `/api/products/{id}/` | `DELETE` | Destroy | Deletes a product permanently |

---

## Authentication & Authorization

- **Current State**: `AllowAny` (No credentials required for portfolio demonstration).
- **Security Assessment for Public Production**:
  Before hosting publicly with write capabilities, change `ProductViewSet.permission_classes` to `IsAuthenticatedOrReadOnly` or `IsAuthenticated` and configure Token or JWT authentication.

---

## 1. Root Discovery

### `GET /`

Returns system metadata and high-level routing.

#### Example Request
```http
GET http://127.0.0.1:8000/ HTTP/1.1
Accept: application/json
```

#### Example Response
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "project": "Mini Inventory API",
  "status": "running",
  "version": "1.0.0",
  "endpoints": {
    "products_list_create": "/api/products/",
    "products_detail": "/api/products/{id}/",
    "admin": "/admin/"
  }
}
```

---

## 2. List Products

### `GET /api/products/`

Retrieves a list of all products. Supports optional case-insensitive search filtering on the product `name` via the `?search=` query parameter.

#### Query Parameters
- `search` *(optional, string)*: Filter products whose name contains the search term (e.g. `?search=keyboard`).

#### Example Request
```http
GET http://127.0.0.1:8000/api/products/?search=sunglasses HTTP/1.1
Accept: application/json
```

#### Example Response
```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 2,
    "name": "Sunglasses",
    "price": "2000.00",
    "quantity": 4,
    "created_at": "2026-10-26T04:57:37.555183Z"
  }
]
```

---

## 3. Retrieve Product

### `GET /api/products/{id}/`

Retrieves details of a single product by its unique integer identifier.

#### Example Request
```http
GET http://127.0.0.1:8000/api/products/2/ HTTP/1.1
Accept: application/json
```

#### Example Response (Success)
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 2,
  "name": "Sunglasses",
  "price": "2000.00",
  "quantity": 4,
  "created_at": "2026-10-26T04:57:37.555183Z"
}
```

#### Example Response (Not Found)
```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "detail": "No Product matches the given query."
}
```

---

## 4. Create Product

### `POST /api/products/`

Creates a new product record. All fields are validated before database insertion.

#### Request Body Schema
| Field | Type | Required | Constraints |
| :--- | :--- | :--- | :--- |
| `name` | string | **Yes** | Max 100 characters; cannot be blank or whitespace only. |
| `price` | decimal / string | **Yes** | Max 10 digits total, 2 decimal places; must be `>= 0.00`. |
| `quantity` | integer | **Yes** | Integer; must be `>= 0`. |

#### Example Request
```http
POST http://127.0.0.1:8000/api/products/ HTTP/1.1
Content-Type: application/json
Accept: application/json

{
  "name": "Mechanical Gaming Keyboard",
  "price": "129.99",
  "quantity": 18
}
```

#### Example Response (Success)
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 3,
  "name": "Mechanical Gaming Keyboard",
  "price": "129.99",
  "quantity": 18,
  "created_at": "2026-10-26T05:30:15.123456Z"
}
```

#### Validation Errors (HTTP 400 Bad Request)

##### Empty / Blank Name
```json
{
  "name": [
    "Product name cannot be blank."
  ]
}
```

##### Negative Price
```json
{
  "price": [
    "Price cannot be negative."
  ]
}
```

##### Negative Quantity
```json
{
  "quantity": [
    "Quantity cannot be negative."
  ]
}
```

##### Missing Required Fields
```json
{
  "name": ["This field is required."],
  "price": ["This field is required."],
  "quantity": ["This field is required."]
}
```

---

## 5. Update Product (Full)

### `PUT /api/products/{id}/`

Replaces all editable fields of an existing product.

#### Example Request
```http
PUT http://127.0.0.1:8000/api/products/2/ HTTP/1.1
Content-Type: application/json
Accept: application/json

{
  "name": "Polarized Sunglasses Deluxe",
  "price": "2499.00",
  "quantity": 10
}
```

#### Example Response
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 2,
  "name": "Polarized Sunglasses Deluxe",
  "price": "2499.00",
  "quantity": 10,
  "created_at": "2026-10-26T04:57:37.555183Z"
}
```

---

## 6. Partial Update Product

### `PATCH /api/products/{id}/`

Updates only the specified fields of a product without touching others.

#### Example Request
```http
PATCH http://127.0.0.1:8000/api/products/2/ HTTP/1.1
Content-Type: application/json
Accept: application/json

{
  "quantity": 0
}
```

#### Example Response
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 2,
  "name": "Polarized Sunglasses Deluxe",
  "price": "2499.00",
  "quantity": 0,
  "created_at": "2026-10-26T04:57:37.555183Z"
}
```

---

## 7. Delete Product

### `DELETE /api/products/{id}/`

Permanently removes the product from the SQLite database.

#### Example Request
```http
DELETE http://127.0.0.1:8000/api/products/2/ HTTP/1.1
Accept: application/json
```

#### Example Response
```http
HTTP/1.1 204 No Content
```
*(No response body returned)*
