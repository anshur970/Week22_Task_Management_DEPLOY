# Task Management API Documentation

## Base URL

**Development:** `http://localhost:3000`  
**Production:** `https://your-app-name.onrender.com` (Update with your actual Render.com URL)

All API endpoints are prefixed with `/api`

---

## Authentication

This API uses **JWT (JSON Web Token)** authentication. Most endpoints require authentication.

### How to Authenticate

1. Register a new user or login to get an access token
2. Include the token in the `Authorization` header for all protected requests:
   ```
   Authorization: Bearer <your-token-here>
   ```

### Token Expiration

- Tokens expire after **24 hours**
- If a token expires, you'll receive a `401 Unauthorized` response
- Users must login again to get a new token

---

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 0  // Only present for list endpoints
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

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Successful GET, PUT, DELETE operations |
| 201 | Created - Successful POST operations (resource creation) |
| 400 | Bad Request - Validation errors or invalid input |
| 401 | Unauthorized - Missing or invalid authentication token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side errors |

---

## Authentication Endpoints

### 1. Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "USER"  // Optional: "USER" or "ADMIN" (defaults to "USER")
}
```

**Response:** `201 Created`
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `400 Bad Request` - Missing required fields
```json
{
  "success": false,
  "message": "name, email, role, and password are required"
}
```

- `400 Bad Request` - Email already exists
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

- `400 Bad Request` - Invalid role
```json
{
  "success": false,
  "message": "role must be either USER or ADMIN"
}
```

---

### 2. Login

Authenticate and receive an access token.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `400 Bad Request` - Missing fields
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

- `401 Unauthorized` - Invalid credentials
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

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
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

**Error Response:**

- `401 Unauthorized` - Invalid or missing token
```json
{
  "success": false,
  "message": "Access token required"
}
```

---

## Task Endpoints

All task endpoints require authentication. Include the JWT token in the `Authorization` header.

### 1. Get All Tasks

Retrieve all tasks for the authenticated user.

**Endpoint:** `GET /api/tasks`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
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
    }
  ]
}
```

**Error Response:**

- `500 Internal Server Error`
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

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (string, required) - The task ID

**Response:** `200 OK`
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

- `404 Not Found` - Task doesn't exist or doesn't belong to user
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

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-01-20T00:00:00.000Z",  // Optional: ISO 8601 date string
  "assignedTo": "john@example.com",  // Optional
  "subtasks": [  // Optional: Create subtasks along with task
    {
      "title": "Review API endpoints",
      "description": "Check all endpoints",
      "completed": false
    }
  ]
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Task title |
| `description` | string | Yes | Task description |
| `status` | string | Yes | One of: `"pending"`, `"in_progress"`, `"completed"`, `"cancelled"` |
| `priority` | string | Yes | One of: `"low"`, `"medium"`, `"high"`, `"urgent"` |
| `dueDate` | string (ISO 8601) | No | Due date for the task |
| `assignedTo` | string | No | Email or identifier of assignee |
| `subtasks` | array | No | Array of subtask objects to create |

**Note:** Status can be sent as `"in-progress"` (kebab-case) and will be converted to `"in_progress"` (snake_case) automatically.

**Response:** `201 Created`
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
    "subtasks": []
  }
}
```

**Error Response:**

- `400 Bad Request` - Validation error
```json
{
  "success": false,
  "error": "Error creating task: <error details>"
}
```

---

### 4. Update Task

Update an existing task.

**Endpoint:** `PUT /api/tasks/:id`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `id` (string, required) - The task ID

**Request Body:**
```json
{
  "title": "Updated task title",  // All fields optional - only include what you want to update
  "description": "Updated description",
  "status": "completed",
  "priority": "medium",
  "dueDate": "2024-01-25T00:00:00.000Z",
  "assignedTo": "jane@example.com"
}
```

**Response:** `200 OK`
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

- `404 Not Found` - Task doesn't exist or doesn't belong to user
```json
{
  "success": false,
  "error": "Task not found"
}
```

- `400 Bad Request` - Validation error
```json
{
  "success": false,
  "error": "Error updating task: <error details>"
}
```

---

### 5. Delete Task

Delete a task and all its subtasks.

**Endpoint:** `DELETE /api/tasks/:id`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (string, required) - The task ID

**Response:** `200 OK`
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

- `404 Not Found` - Task doesn't exist or doesn't belong to user
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

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `taskId` (string, required) - The parent task ID

**Response:** `200 OK`
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

- `404 Not Found` - Task doesn't exist or doesn't belong to user
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

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (string, required) - The subtask ID

**Response:** `200 OK`
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

- `404 Not Found` - Subtask doesn't exist or doesn't belong to user's task
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

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `taskId` (string, required) - The parent task ID

**Request Body:**
```json
{
  "title": "Review API endpoints",
  "description": "Check all endpoints",  // Optional
  "completed": false  // Optional, defaults to false
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Subtask title |
| `description` | string | No | Subtask description |
| `completed` | boolean | No | Completion status (defaults to `false`) |

**Response:** `201 Created`
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

- `404 Not Found` - Task doesn't exist or doesn't belong to user
```json
{
  "success": false,
  "error": "Task not found or access denied"
}
```

- `400 Bad Request` - Validation error
```json
{
  "success": false,
  "error": "Error creating subtask: <error details>"
}
```

---

### 4. Update Subtask

Update an existing subtask.

**Endpoint:** `PUT /api/subtasks/:id`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `id` (string, required) - The subtask ID

**Request Body:**
```json
{
  "title": "Updated subtask title",  // All fields optional
  "description": "Updated description",
  "completed": true
}
```

**Response:** `200 OK`
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

- `404 Not Found` - Subtask doesn't exist or doesn't belong to user's task
```json
{
  "success": false,
  "error": "Subtask not found or access denied"
}
```

- `400 Bad Request` - Validation error
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

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (string, required) - The subtask ID

**Response:** `200 OK`
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

- `404 Not Found` - Subtask doesn't exist or doesn't belong to user's task
```json
{
  "success": false,
  "error": "Subtask not found or access denied"
}
```

---

## Data Models

### User

```typescript
{
  id: string;           // Unique identifier (CUID)
  name: string;        // User's full name
  email: string;       // Unique email address
  password: string;    // Hashed password (never returned in responses)
  role: "USER" | "ADMIN";  // User role
  createdAt: Date;     // ISO 8601 timestamp
  updatedAt: Date;     // ISO 8601 timestamp
}
```

### Task

```typescript
{
  id: string;                    // Unique identifier (CUID)
  title: string;                 // Task title
  description: string;           // Task description
  status: TaskStatus;            // Current status
  priority: Priority;            // Priority level
  dueDate: Date | null;          // Optional due date (ISO 8601)
  assignedTo: string | null;     // Optional assignee identifier
  userId: string;                // Owner user ID
  createdAt: Date;               // ISO 8601 timestamp
  updatedAt: Date;               // ISO 8601 timestamp
  subtasks: Subtask[];           // Array of subtasks
}
```

### Subtask

```typescript
{
  id: string;          // Unique identifier (CUID)
  title: string;       // Subtask title
  description: string; // Subtask description
  completed: boolean;  // Completion status
  taskId: string;      // Parent task ID
  createdAt: Date;     // ISO 8601 timestamp
  updatedAt: Date;     // ISO 8601 timestamp
}
```

### Enums

**TaskStatus:**
- `"pending"` - Task is pending
- `"in_progress"` - Task is in progress
- `"completed"` - Task is completed
- `"cancelled"` - Task is cancelled

**Priority:**
- `"low"` - Low priority
- `"medium"` - Medium priority
- `"high"` - High priority
- `"urgent"` - Urgent priority

---

## Error Handling

### Common Error Scenarios

1. **Missing Authentication Token**
   - Status: `401 Unauthorized`
   - Response: `{ "success": false, "message": "Access token required" }`

2. **Invalid or Expired Token**
   - Status: `401 Unauthorized`
   - Response: `{ "success": false, "message": "Invalid token" }` or `"Token expired"`

3. **Resource Not Found**
   - Status: `404 Not Found`
   - Response: `{ "success": false, "error": "Task not found" }`

4. **Validation Errors**
   - Status: `400 Bad Request`
   - Response: `{ "success": false, "error": "<error message>" }`

5. **Server Errors**
   - Status: `500 Internal Server Error`
   - Response: `{ "success": false, "error": "<error message>" }`

---

## Example Usage

### Complete Flow Example

#### 1. Register a new user
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "USER"
}
```

#### 2. Login (if already registered)
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### 3. Create a task (using token from login/register)
```bash
POST /api/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Build frontend dashboard",
  "description": "Create a beautiful dashboard UI",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-02-01T00:00:00.000Z"
}
```

#### 4. Get all tasks
```bash
GET /api/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 5. Create a subtask
```bash
POST /api/tasks/{taskId}/subtasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Design wireframes",
  "description": "Create initial wireframe designs",
  "completed": false
}
```

#### 6. Update subtask to completed
```bash
PUT /api/subtasks/{subtaskId}
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "completed": true
}
```

---

## Notes for Frontend Developers

1. **Token Storage**: Store the JWT token securely (e.g., in localStorage, sessionStorage, or httpOnly cookies) and include it in all authenticated requests.

2. **Token Refresh**: Tokens expire after 24 hours. Implement token refresh logic or prompt users to login again when receiving `401 Unauthorized` responses.

3. **Date Format**: All dates should be sent and received in ISO 8601 format (e.g., `"2024-01-20T00:00:00.000Z"`).

4. **Status Values**: When sending status values, you can use either `"in-progress"` (kebab-case) or `"in_progress"` (snake_case) - both are accepted, but responses will always return `"in_progress"`.

5. **User Isolation**: Users can only access their own tasks and subtasks. Attempting to access another user's resources will return `404 Not Found`.

6. **Cascading Deletes**: When a task is deleted, all its subtasks are automatically deleted.

7. **CORS**: The API has CORS enabled, so you can make requests from any origin.

8. **Error Handling**: Always check the `success` field in responses. Even with a `200` status code, check for `success: false` in the response body.

---

## Support

For questions or issues, please contact the backend team or refer to the project repository.

