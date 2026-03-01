# Backend Server for Progress Bar Component

This is a complete Express.js backend server for the Progress Bar component.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Server

```bash
npm start
```

Or with auto-reload (requires Node 18.11+):

```bash
npm run dev
```

### 3. Test Server

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "API is running",
  "timestamp": "2024-02-28T...",
  "port": 5000
}
```

## Endpoints

### Health Check

```
GET /api/health
```

Used to verify server is running.

### Upload File

```
POST /api/upload
```

Upload a file with progress tracking.

**Request:**

- Content-Type: multipart/form-data
- Field: `file` (binary file)

**Response:**

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "filename": "example.pdf",
    "originalName": "document.pdf",
    "size": 1234567,
    "sizeInMB": "1.18",
    "path": "/uploads/example.pdf",
    "url": "http://localhost:5000/uploads/example.pdf"
  }
}
```

### Submit Form

```
POST /api/submit-form
```

Submit form data with validation.

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello world"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Form submitted successfully for John Doe",
  "id": "submission_1704067200000",
  "submission": {
    "id": "submission_1704067200000",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello world",
    "timestamp": "2024-02-28T10:00:00.000Z"
  }
}
```

### List Submissions

```
GET /api/submissions
```

View all form submissions (saved to submissions.json).

### List Uploads

```
GET /api/uploads-list
```

View all uploaded files.

## File Structure

```
backend-example/
├── server.js          (Main server file)
├── package.json       (Dependencies)
└── uploads/           (Uploaded files directory - created automatically)
```

## Configuration

No configuration needed for basic setup. The server automatically:

- Creates `uploads/` directory
- Listens on port 5000
- Enables CORS
- Saves submissions to `submissions.json`

## Features

✅ File upload with multipart handling
✅ Progress tracking via Content-Length
✅ Form validation
✅ Email format validation
✅ File size limit (100MB)
✅ Automatic uploads directory creation
✅ Submission persistence (JSON file)
✅ Error handling and logging
✅ CORS enabled for frontend communication
✅ Graceful shutdown handling

## Connection to Frontend

Set environment variable in frontend `.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Then restart frontend dev server.

## Troubleshooting

### Port 5000 is already in use

```bash
# Kill process on port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### CORS errors

The server has CORS enabled by default. If issues persist, check that:

1. Frontend URL is in the CORS allowed origins
2. Credentials are handled correctly
3. Browser allows cross-origin requests for the domain

### File upload fails

Check:

1. File size doesn't exceed 100MB
2. File exists and is readable
3. `uploads/` directory exists and is writable
4. Multer disk storage is configured correctly

## Production Deployment

For production use:

1. Use environment variables for configuration
2. Implement database instead of JSON file storage
3. Add authentication/authorization
4. Implement rate limiting
5. Add request logging
6. Use HTTPS
7. Add file virus scanning
8. Set proper file size limits based on requirements
9. Implement file type validation
10. Store uploads outside public directory

Example production server could use:

- PM2 for process management
- Nginx as reverse proxy
- PostgreSQL for data storage
- Redis for caching
- Docker for containerization

## License

MIT
