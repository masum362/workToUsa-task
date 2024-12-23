# Launch Data API

A Node.js/Express API that handles posting launch data to an external API with robust error handling and retry mechanisms.

## Features

- REST API endpoint for posting launch data
- Input validation
- Error handling with exponential backoff retry
- Configurable through environment variables
- JSON request/response format

## Prerequisites

- Node.js (version 18+ recommended)
- npm or yarn package manager

## Installation

1. Clone the repository or create a new directory:

```bash
mkdir launch-api
cd launch-api
```

2. Install dependencies:

```bash
npm init -y
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=3000
```

## Configuration

Environment variables (in `.env`):

- `PORT`: Server port number (default: 3000)

## Running the Application

1. Start the server:

```bash
npm start
```

2. The server will start on the configured port (default: 3000)

## Testing

You can test the API using curl:

```bash
curl -X POST http://localhost:3000/api/launches \
  -H "Content-Type: application/json" \
  -d '{
    "missionName": "Test Mission",
    "rocketName": "Test Rocket",
    "launchDate": "2024-03-25T10:30:00-04:00"
  }'
```

## API Documentation

### POST /api/launches

Posts launch data to the external API.

**Request Body:**

```json
{
  "missionName": "Mission Name",
  "rocketName": "Rocket Name",
  "launchDate": "2024-03-25T10:30:00-04:00"
}
```

**Success Response (201):**

```json
{
  "message": "Launch data posted successfully",
  "data": {
    "id": 101,
    "title": "Mission Name Launch",
    "body": "Rocket: Rocket Name, Launch Date: 2024-03-25T10:30:00-04:00",
    "userId": 1
  }
}
```

**Error Responses:**

- 400: Missing required fields
- 403: Access forbidden
- 500: Internal server error

## Error Handling

The API implements the following error handling:

- Input validation
- HTTP error status handling
- Exponential backoff retry for recoverable errors
- Skip retry for 403 errors
- Maximum 3 retry attempts

## Error Messages

The API returns the following error messages:

- Missing fields: "Missing required fields. Please provide missionName, rocketName, and launchDate."
- Forbidden access: "Access forbidden"
- Server error: "Internal server error"
- Unexpected errors: "An unexpected error occurred"

## Logging

The application logs:

- Server start
- Successful data posts
- Error details
- Retry attempts and delays
