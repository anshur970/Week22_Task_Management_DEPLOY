# Task Management API Documentation

> **Version:** 1.0  
> **Last Updated:** 2024  
> **Documentation for:** Frontend Development Team

---

## Table of Contents

1. [Overview](#overview)
2. [Base URL & Environment](#base-url--environment)
3. [Authentication](#authentication)
4. [Response Format](#response-format)
5. [HTTP Status Codes](#http-status-codes)
6. [Authentication Endpoints](#authentication-endpoints)
7. [Task Endpoints](#task-endpoints)
8. [Subtask Endpoints](#subtask-endpoints)
9. [Data Models](#data-models)
10. [Postman Collection Setup](#postman-collection-setup)

---

## Overview

This is a RESTful API for managing tasks and subtasks. The API uses **JWT (JSON Web Token)** authentication for secure access to protected endpoints.

### Key Features

- User registration and authentication
- Task CRUD operations
- Subtask management
- User-specific data isolation
- RESTful architecture

---

## Base URL & Environment

### Development
```
http://localhost:3000
```

### Production
```
https://your-app-name.onrender.com
```
*Note: Update with your actual production URL*

### API Prefix
All endpoints are prefixed with `/api`

**Example:** `http://localhost:3000/api/auth/register`

---

## Authentication

This API uses **JWT (JSON Web Token)** authentication. Most endpoints require authentication except for registration and login.

### How to Authenticate

1. **Register a new user** or **Login** to receive an access token
2. Include the token in the `Authorization` header for all protected requests:
   ```
   Authorization: Bearer <your-token-here>
   ```

### Token Details

- **Token Type:** JWT
- **Expiration:** 24 hours
- **Header Format:** `Bearer <token>`
- **Storage:** Store token securely (localStorage, sessionStorage, or httpOnly cookies)

### Token Expiration Handling

If a token expires or is invalid, you'll receive a `401 Unauthorized` response. The frontend should:
- Prompt the user to login again
- Clear stored tokens
- Redirect to login page if needed

---

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "count": 0  // Only present for list endpoints (GET all tasks/subtasks)
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message here",
  "message": "Optional additional message"
}
```

**Important:** Always check the `success` field in responses. Even with a `200` status code, check for `success: false` in the response body.

---

## HTTP Status Codes

| Code | Description | When to Expect |
|------|-------------|----------------|
| `200` | OK | Successful GET, PUT, DELETE operations |
| `201` | Created | Successful POST operations (resource creation) |
| `400` | Bad Request | Validation errors, missing required fields, invalid input |
| `401` | Unauthorized | Missing, invalid, or expired authentication token |
| `404` | Not Found | Resource doesn't exist or user doesn't have access |
| `500` | Internal Server Error | Server-side errors |

---

## Authentication Endpoints

### 1. Register User

Create a new user account and receive an authentication token.

**Endpoint:** `POST /api/auth/register`

**Authentication:** Not required

**Headers:**
```
Content-Type: application/json
```

**Request Body (Required Fields):**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `name` | string | ✅ Yes | User's full name | `"John Doe"` |
| `email` | string | ✅ Yes | Unique email address | `"john@example.com"` |
| `password` | string | ✅ Yes | User password (will be hashed) | `"securePassword123"` |
| `role` | string | ✅ Yes | User role | `"USER"` or `"ADMIN"` |

**Request Body Example:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "USER"
}
```

**Postman Setup:**
- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body:** Select `raw` → `JSON`, paste the request body above

**Success Response:** `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHgxMjM0NTY3ODkwIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MDc5MzI0MDAsImV4cCI6MTcwODAxODgwMH0..."
  }
}
```

**Error Responses:**

**400 Bad Request** - Missing required fields
```json
{
  "success": false,
  "message": "name, email, role, and password are required"
}
```

**400 Bad Request** - Email already exists
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

**400 Bad Request** - Invalid role
```json
{
  "success": false,
  "message": "role must be either USER or ADMIN"
}
```

---

### 2. Login

Authenticate an existing user and receive an access token.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Headers:**
```
Content-Type: application/json
```

**Request Body (Required Fields):**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `email` | string | ✅ Yes | User's email address | `"john@example.com"` |
| `password` | string | ✅ Yes | User password | `"securePassword123"` |

**Request Body Example:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Postman Setup:**
- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:** Select `raw` → `JSON`, paste the request body above

**Success Response:** `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHgxMjM0NTY3ODkwIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MDc5MzI0MDAsImV4cCI6MTcwODAxODgwMH0..."
  }
}
```

**Error Responses:**

**400 Bad Request** - Missing fields
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

**401 Unauthorized** - Invalid credentials
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get Current User Profile

Get the authenticated user's profile information.

**Endpoint:** `GET /api/auth/me`

**Authentication:** ✅ Required

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:** None

**Query Parameters:** None

**Postman Setup:**
- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/auth/me`
- **Headers:** 
  - `Authorization: Bearer {{token}}`
  - (Replace `{{token}}` with your actual token or use Postman environment variable)

**Success Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

**401 Unauthorized** - Missing token
```json
{
  "success": false,
  "message": "Access token required"
}
```

**401 Unauthorized** - Invalid/expired token
```json
{
  "success": false,
  "message": "Invalid token"
}
```

or

```json
{
  "success": false,
  "message": "Token expired"
}
```

---

## Task Endpoints

All task endpoints require authentication. Include the JWT token in the `Authorization` header.

### 1. Get All Tasks

Retrieve all tasks for the authenticated user.

**Endpoint:** `GET /api/tasks`

**Authentication:** ✅ Required

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:** None

**Query Parameters:** None

**Postman Setup:**
- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/tasks`
- **Headers:** `Authorization: Bearer {{token}}`

**Success Response:** `200 OK`

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "clx9876543210",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "in_progress",
      "priority": "high",
      "dueDate": "2024-01-20T00:00:00.000Z",
      "assignedTo": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-16T14:20:00.000Z",
      "userId": "clx1234567890",
      "subtasks": [
        {
          "id": "clx1111111111",
          "title": "Review API endpoints",
          "description": "Check all endpoints",
          "completed": true,
          "taskId": "clx9876543210",
          "createdAt": "2024-01-15T11:00:00.000Z",
          "updatedAt": "2024-01-15T12:00:00.000Z"
        }
      ]
    },
    {
      "id": "clx9876543211",
      "title": "Build frontend dashboard",
      "description": "Create beautiful dashboard UI",
      "status": "pending",
      "priority": "urgent",
      "dueDate": "2024-01-25T00:00:00.000Z",
      "assignedTo": null,
      "createdAt": "2024-01-16T08:00:00.000Z",
      "updatedAt": "2024-01-16T08:00:00.000Z",
      "userId": "clx1234567890",
      "subtasks": []
    }
  ]
}
```

**Error Response:**

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

### 2. Get Task by ID

Retrieve a specific task by its ID.

**Endpoint:** `GET /api/tasks/:id`

**Authentication:** ✅ Required

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | string | ✅ Yes | The task ID | `"clx9876543210"` |

**Query Parameters:** None

**Postman Setup:**
- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/tasks/clx9876543210`
- **Headers:** `Authorization: Bearer {{token}}`

**Success Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "clx9876543210",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "in_progress",
    "priority": "high",
    "dueDate": "2024-01-20T00:00:00.000Z",
    "assignedTo": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T14:20:00.000Z",
    "userId": "clx1234567890",
    "subtasks": []
  }
}
```

**Error Responses:**

**404 Not Found** - Task doesn't exist or doesn't belong to user
```json
{
  "success": false,
  "error": "Task not found"
}
```

---

### 3. Create Task

Create a new task.

**Endpoint:** `POST /api/tasks`

**Authentication:** ✅ Required

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:** None

**Request Body (Required Fields):**

| Field | Type | Required | Description | Valid Values | Example |
|-------|------|----------|-------------|--------------|---------|
| `title` | string | ✅ Yes | Task title | Any string | `"Complete project documentation"` |
| `description` | string | ✅ Yes | Task description | Any string | `"Write comprehensive API documentation"` |
| `status` | string | ✅ Yes | Task status | `"pending"`, `"in_progress"`, `"completed"`, `"cancelled"` (or `"in-progress"` kebab-case) | `"pending"` |
| `priority` | string | ✅ Yes | Task priority | `"low"`, `"medium"`, `"high"`, `"urgent"` | `"high"` |
| `dueDate` | string (ISO 8601) | ❌ No | Due date for the task | ISO 8601 date string | `"2024-01-20T00:00:00.000Z"` |
| `assignedTo` | string | ❌ No | Email or identifier of assignee | Any string | `"john@example.com"` |
| `subtasks` | array | ❌ No | Array of subtask objects to create with task | Array of subtask objects | See example below |

**Request Body Example (Minimal):**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "priority": "high"
}
```

**Request Body Example (With All Fields):**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-01-20T00:00:00.000Z",
  "assignedTo": "john@example.com",
  "subtasks": [
    {
      "title": "Review API endpoints",
      "description": "Check all endpoints",
      "completed": false
    },
    {
      "title": "Write examples",
      "description": "Add request/response examples",
      "completed": false
    }
  ]
}
```

**Important Notes:**
- Status can be sent as `"in-progress"` (kebab-case) and will be converted to `"in_progress"` (snake_case) automatically
- Response will always return `"in_progress"` (snake_case)
- `dueDate` must be in ISO 8601 format
- Subtasks can be created along with the task by including them in the `subtasks` array

**Postman Setup:**
- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/tasks`
- **Headers:** 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body:** Select `raw` → `JSON`, paste one of the request body examples above

**Success Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "clx9876543210",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-01-20T00:00:00.000Z",
    "assignedTo": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "userId": "clx1234567890",
    "subtasks": [
      {
        "id": "clx1111111111",
        "title": "Review API endpoints",
        "description": "Check all endpoints",
        "completed": false,
        "taskId": "clx9876543210",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

**Error Response:**

**400 Bad Request** - Validation error
```json
{
  "success": false,
  "error": "Error creating task: <error details>"
}
```

---

### 4. Update Task

Update an existing task. Only include fields you want to update.

**Endpoint:** `PUT /api/tasks/:id`

**Authentication:** ✅ Required

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | string | ✅ Yes | The task ID | `"clx9876543210"` |

**Request Body (All Fields Optional - only include what you want to update):**

| Field | Type | Required | Description | Valid Values | Example |
|-------|------|----------|-------------|--------------|---------|
| `title` | string | ❌ No | Task title | Any string | `"Updated task title"` |
| `description` | string | ❌ No | Task description | Any string | `"Updated description"` |
| `status` | string | ❌ No | Task status | `"pending"`, `"in_progress"`, `"completed"`, `"cancelled"` (or `"in-progress"` kebab-case) | `"completed"` |
| `priority` | string | ❌ No | Task priority | `"low"`, `"medium"`, `"high"`, `"urgent"` | `"medium"` |
| `dueDate` | string (ISO 8601) | ❌ No | Due date for the task | ISO 8601 date string | `"2024-01-25T00:00:00.000Z"` |
| `assignedTo` | string | ❌ No | Email or identifier of assignee | Any string | `"jane@example.com"` |

**Request Body Example (Update Status Only):**
```json
{
  "status": "completed"
}
```

**Request Body Example (Update Multiple Fields):**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "completed",
  "priority": "medium",
  "dueDate": "2024-01-25T00:00:00.000Z",
  "assignedTo": "jane@example.com"
}
```

**Postman Setup:**
- **Method:** `PUT`
- **URL:** `{{baseUrl}}/api/tasks/clx9876543210`
- **Headers:** 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body:** Select `raw` → `JSON`, paste one of the request body examples above

**Success Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "clx9876543210",
    "title": "Updated task title",
    "description": "Updated description",
    "status": "completed",
    "priority": "medium",
    "dueDate": "2024-01-25T00:00:00.000Z",
    "assignedTo": "jane@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T15:45:00.000Z",
    "userId": "clx1234567890",
    "subtasks": []
  }
}
```

**Error Responses:**

**404 Not Found** - Task doesn't exist or doesn't belong to user
```json
{
  "success": false,
  "error": "Task not found"
}
```

**400 Bad Request** - Validation error
```json
{
  "success": false,
  "error": "Error updating task: <error details>"
}
```

---

### 5. Delete Task

Delete a task and all its subtasks (cascade delete).

**Endpoint:** `DELETE /api/tasks/:id`

**Authentication:** ✅ Required

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | string | ✅ Yes | The task ID | `"clx9876543210"` |

**Query Parameters:** None

**Request Body:** None

**Postman Setup:**
- **Method:** `DELETE`
- **URL:** `{{baseUrl}}/api/tasks/clx9876543210`
- **Headers:** `Authorization: Bearer {{token}}`

**Success Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "clx9876543210",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "in_progress",
    "priority": "high",
    "dueDate": "2024-01-20T00:00:00.000Z",
    "assignedTo": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T14:20:00.000Z",
    "userId": "clx1234567890",
    "subtasks": []
  }
}
```

**Note:** The response returns the deleted task data. All associated subtasks are automatically deleted (cascade delete).

**Error Responses:**

**404 Not Found** - Task doesn't exist or doesn't belong to user
```json
{
  "success": false,
  "error": "Task not found"
}
```

---

## Subtask Endpoints

All subtask endpoints require authentication. Include the JWT token in the `Authorization` header.

### 1. Get All Subtasks for a Task

Retrieve all subtasks belonging to a specific task.

**Endpoint:** `GET /api/tasks/:taskId/subtasks`

**Authentication:** ✅ Required

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `taskId` | string | ✅ Yes | The parent task ID | `"clx9876543210"` |

**Query Parameters:** None

**Postman Setup:**
- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/tasks/clx9876543210/subtasks`
- **Headers:** `Authorization: Bearer {{token}}`

**Success Response:** `200 OK`

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "clx1111111111",
      "title": "Review API endpoints",
      "description": "Check all endpoints",
      "completed": false,
      "taskId": "clx9876543210",
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    },
    {
      "id": "clx2222222222",
      "title": "Write examples",
      "description": "Add request/response examples",
      "completed": true,
      "taskId": "clx9876543210",
      "createdAt": "2024-01-15T11:30:00.000Z",
      "updatedAt": "2024-01-15T12:00:00.000Z"
    }
  ]
}
```

**Error Responses:**

**404 Not Found** - Task doesn't exist or doesn't belong to user
```json
{
  "success": false,
  "error": "Task not found or access denied"
}
```

---

### 2. Get Subtask by ID

Retrieve a specific subtask by its ID.

**Endpoint:** `GET /api/subtasks/:id`

**Authentication:** ✅ Required

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | string | ✅ Yes | The subtask ID | `"clx1111111111"` |

**Query Parameters:** None

**Postman Setup:**
- **Method:** `GET`
- **URL:** `{{baseUrl}}/api/subtasks/clx1111111111`
- **Headers:** `Authorization: Bearer {{token}}`

**Success Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "clx1111111111",
    "title": "Review API endpoints",
    "description": "Check all endpoints",
    "completed": false,
    "taskId": "clx9876543210",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Responses:**

**404 Not Found** - Subtask doesn't exist or doesn't belong to user's task
```json
{
  "success": false,
  "error": "Subtask not found or access denied"
}
```

---

### 3. Create Subtask

Create a new subtask for a task.

**Endpoint:** `POST /api/tasks/:taskId/subtasks`

**Authentication:** ✅ Required

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `taskId` | string | ✅ Yes | The parent task ID | `"clx9876543210"` |

**Request Body (Required Fields):**

| Field | Type | Required | Description | Default | Example |
|-------|------|----------|-------------|---------|---------|
| `title` | string | ✅ Yes | Subtask title | - | `"Review API endpoints"` |
| `description` | string | ❌ No | Subtask description | `null` | `"Check all endpoints"` |
| `completed` | boolean | ❌ No | Completion status | `false` | `false` |

**Request Body Example (Minimal):**
```json
{
  "title": "Review API endpoints"
}
```

**Request Body Example (With All Fields):**
```json
{
  "title": "Review API endpoints",
  "description": "Check all endpoints",
  "completed": false
}
```

**Postman Setup:**
- **Method:** `POST`
- **URL:** `{{baseUrl}}/api/tasks/clx9876543210/subtasks`
- **Headers:** 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body:** Select `raw` → `JSON`, paste one of the request body examples above

**Success Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "clx1111111111",
    "title": "Review API endpoints",
    "description": "Check all endpoints",
    "completed": false,
    "taskId": "clx9876543210",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Responses:**

**404 Not Found** - Task doesn't exist or doesn't belong to user
```json
{
  "success": false,
  "error": "Task not found or access denied"
}
```

**400 Bad Request** - Validation error
```json
{
  "success": false,
  "error": "Error creating subtask: <error details>"
}
```

---

### 4. Update Subtask

Update an existing subtask. Only include fields you want to update.

**Endpoint:** `PUT /api/subtasks/:id`

**Authentication:** ✅ Required

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | string | ✅ Yes | The subtask ID | `"clx1111111111"` |

**Request Body (All Fields Optional - only include what you want to update):**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `title` | string | ❌ No | Subtask title | `"Updated subtask title"` |
| `description` | string | ❌ No | Subtask description | `"Updated description"` |
| `completed` | boolean | ❌ No | Completion status | `true` |

**Request Body Example (Update Completed Status Only):**
```json
{
  "completed": true
}
```

**Request Body Example (Update Multiple Fields):**
```json
{
  "title": "Updated subtask title",
  "description": "Updated description",
  "completed": true
}
```

**Postman Setup:**
- **Method:** `PUT`
- **URL:** `{{baseUrl}}/api/subtasks/clx1111111111`
- **Headers:** 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body:** Select `raw` → `JSON`, paste one of the request body examples above

**Success Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "clx1111111111",
    "title": "Updated subtask title",
    "description": "Updated description",
    "completed": true,
    "taskId": "clx9876543210",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z"
  }
}
```

**Error Responses:**

**404 Not Found** - Subtask doesn't exist or doesn't belong to user's task
```json
{
  "success": false,
  "error": "Subtask not found or access denied"
}
```

**400 Bad Request** - Validation error
```json
{
  "success": false,
  "error": "Error updating subtask: <error details>"
}
```

---

### 5. Delete Subtask

Delete a subtask.

**Endpoint:** `DELETE /api/subtasks/:id`

**Authentication:** ✅ Required

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | string | ✅ Yes | The subtask ID | `"clx1111111111"` |

**Query Parameters:** None

**Request Body:** None

**Postman Setup:**
- **Method:** `DELETE`
- **URL:** `{{baseUrl}}/api/subtasks/clx1111111111`
- **Headers:** `Authorization: Bearer {{token}}`

**Success Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "clx1111111111",
    "title": "Review API endpoints",
    "description": "Check all endpoints",
    "completed": false,
    "taskId": "clx9876543210",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Note:** The response returns the deleted subtask data.

**Error Responses:**

**404 Not Found** - Subtask doesn't exist or doesn't belong to user's task
```json
{
  "success": false,
  "error": "Subtask not found or access denied"
}
```

---

## Data Models

### User Model

```typescript
{
  id: string;           // Unique identifier (CUID) - Auto-generated
  name: string;         // User's full name
  email: string;        // Unique email address
  password: string;     // Hashed password (never returned in responses)
  role: "USER" | "ADMIN"; // User role
  createdAt: Date;      // ISO 8601 timestamp - Auto-generated
  updatedAt: Date;      // ISO 8601 timestamp - Auto-updated
}
```

### Task Model

```typescript
{
  id: string;                    // Unique identifier (CUID) - Auto-generated
  title: string;                 // Task title
  description: string;           // Task description
  status: TaskStatus;            // Current status (enum)
  priority: Priority;            // Priority level (enum)
  dueDate: Date | null;          // Optional due date (ISO 8601)
  assignedTo: string | null;     // Optional assignee identifier
  userId: string;                // Owner user ID - Auto-set from token
  createdAt: Date;               // ISO 8601 timestamp - Auto-generated
  updatedAt: Date;               // ISO 8601 timestamp - Auto-updated
  subtasks: Subtask[];           // Array of subtasks (included in responses)
}
```

### Subtask Model

```typescript
{
  id: string;          // Unique identifier (CUID) - Auto-generated
  title: string;       // Subtask title
  description: string; // Subtask description
  completed: boolean;  // Completion status (default: false)
  taskId: string;      // Parent task ID
  createdAt: Date;     // ISO 8601 timestamp - Auto-generated
  updatedAt: Date;     // ISO 8601 timestamp - Auto-updated
}
```

### Enums

#### TaskStatus
- `"pending"` - Task is pending
- `"in_progress"` - Task is in progress (use `"in-progress"` kebab-case in requests, but response will be `"in_progress"`)
- `"completed"` - Task is completed
- `"cancelled"` - Task is cancelled

#### Priority
- `"low"` - Low priority
- `"medium"` - Medium priority
- `"high"` - High priority
- `"urgent"` - Urgent priority

---

## Postman Collection Setup

### Setting Up Postman Environment Variables

1. **Create a new Environment** in Postman:
   - Click the gear icon (⚙️) in the top right
   - Click "Add" to create a new environment
   - Name it "Task Management API"

2. **Add Variables:**

   | Variable Name | Initial Value | Current Value | Description |
   |---------------|---------------|---------------|-------------|
   | `baseUrl` | `http://localhost:3000` | `http://localhost:3000` | API base URL (change for production) |
   | `token` | (empty) | (empty) | JWT token (will be set after login) |

3. **Using Variables in Requests:**
   - Use `{{baseUrl}}` in the URL field: `{{baseUrl}}/api/auth/login`
   - Use `{{token}}` in Authorization header: `Bearer {{token}}`

### Quick Setup Steps

1. **Register/Login:**
   - Run the `POST /api/auth/register` or `POST /api/auth/login` request
   - Copy the `token` from the response
   - Set it as the `token` environment variable:
     - In Postman, go to the environment
     - Paste the token in the `Current Value` column for `token`

2. **Alternative: Use Tests Script to Auto-Save Token**
   
   Add this to the **Tests** tab of your Login/Register request:
   ```javascript
   if (pm.response.code === 200 || pm.response.code === 201) {
       var jsonData = pm.response.json();
       if (jsonData.data && jsonData.data.token) {
           pm.environment.set("token", jsonData.data.token);
           console.log("Token saved to environment variable");
       }
   }
   ```

3. **Test Protected Endpoints:**
   - All other endpoints will automatically use the `{{token}}` variable
   - Make sure you've selected the correct environment in the top-right dropdown

### Postman Collection Structure (Recommended)

Organize your requests into folders:

```
Task Management API
├── Authentication
│   ├── Register User
│   ├── Login
│   └── Get Current User
├── Tasks
│   ├── Get All Tasks
│   ├── Get Task by ID
│   ├── Create Task
│   ├── Update Task
│   └── Delete Task
└── Subtasks
    ├── Get All Subtasks for Task
    ├── Get Subtask by ID
    ├── Create Subtask
    ├── Update Subtask
    └── Delete Subtask
```

---

## Important Notes for Frontend Developers

### 1. Authentication Flow

```javascript
// 1. Register or Login to get token
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { data } = await response.json();
const token = data.token;

// 2. Store token securely (localStorage, sessionStorage, or httpOnly cookie)
localStorage.setItem('authToken', token);

// 3. Include token in all protected requests
const tasksResponse = await fetch('http://localhost:3000/api/tasks', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
});
```

### 2. Error Handling

Always check both the HTTP status code AND the `success` field:

```javascript
const response = await fetch(url, options);
const data = await response.json();

if (!response.ok || !data.success) {
  // Handle error
  console.error(data.error || data.message);
  // Show user-friendly error message
}
```

### 3. Date Format

- **Send dates in ISO 8601 format:** `"2024-01-20T00:00:00.000Z"`
- **Dates are returned in ISO 8601 format**
- Use JavaScript `Date` objects or date libraries (moment.js, date-fns) for parsing

### 4. Status Values

- You can send `"in-progress"` (kebab-case) in requests
- Response will always return `"in_progress"` (snake_case)
- Handle both formats in your frontend if needed

### 5. User Isolation

- Users can only access their own tasks and subtasks
- Attempting to access another user's resources returns `404 Not Found`
- The `userId` is automatically set from the JWT token, so users can't create tasks for others

### 6. Cascading Deletes

- When a task is deleted, all its subtasks are automatically deleted
- There's no need to delete subtasks manually before deleting a task

### 7. CORS

- The API has CORS enabled for all origins
- No additional CORS configuration needed in the frontend

### 8. Request Headers

Always include these headers for POST/PUT requests:
```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // For protected endpoints
}
```

### 9. Response Structure

- **List endpoints** (GET all tasks/subtasks) include a `count` field
- **Single resource endpoints** return the resource in `data`
- Always check `success: true` before using the `data`

### 10. Optional Fields in Update Requests

For PUT requests, only send the fields you want to update:
```javascript
// Update only status
await fetch(`/api/tasks/${taskId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ status: 'completed' })
});
```

---

## Example Frontend Integration Code

### React/JavaScript Example

```javascript
// api.js - API service file
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function for authenticated requests
async function authenticatedFetch(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || data.message || 'Request failed');
  }
  
  return data;
}

// Authentication
export const authAPI = {
  register: async (userData) => {
    const data = await authenticatedFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token
    if (data.data.token) {
      localStorage.setItem('authToken', data.data.token);
    }
    
    return data;
  },
  
  login: async (email, password) => {
    const data = await authenticatedFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token
    if (data.data.token) {
      localStorage.setItem('authToken', data.data.token);
    }
    
    return data;
  },
  
  getCurrentUser: async () => {
    return await authenticatedFetch('/auth/me');
  },
};

// Tasks
export const tasksAPI = {
  getAll: async () => {
    return await authenticatedFetch('/tasks');
  },
  
  getById: async (id) => {
    return await authenticatedFetch(`/tasks/${id}`);
  },
  
  create: async (taskData) => {
    return await authenticatedFetch('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },
  
  update: async (id, updateData) => {
    return await authenticatedFetch(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },
  
  delete: async (id) => {
    return await authenticatedFetch(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

// Subtasks
export const subtasksAPI = {
  getByTaskId: async (taskId) => {
    return await authenticatedFetch(`/tasks/${taskId}/subtasks`);
  },
  
  getById: async (id) => {
    return await authenticatedFetch(`/subtasks/${id}`);
  },
  
  create: async (taskId, subtaskData) => {
    return await authenticatedFetch(`/tasks/${taskId}/subtasks`, {
      method: 'POST',
      body: JSON.stringify(subtaskData),
    });
  },
  
  update: async (id, updateData) => {
    return await authenticatedFetch(`/subtasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },
  
  delete: async (id) => {
    return await authenticatedFetch(`/subtasks/${id}`, {
      method: 'DELETE',
    });
  },
};
```

---

## Support

For questions, issues, or clarifications about the API:

1. Check this documentation first
2. Test endpoints using Postman with the examples provided
3. Contact the backend team
4. Refer to the project repository

---

## Changelog

### Version 1.0 (Current)
- Initial API documentation
- All endpoints documented
- Postman examples included
- Frontend integration examples provided

---

**End of Documentation**