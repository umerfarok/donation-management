
# Masjid Backend App

This is the backend API for the Masjid application. It provides endpoints for managing users and donations.

## API Documentation

The API documentation is available at `http://localhost:4000/api-docs`.

## Docker Commands

To build the Docker image for this application, run:

```sh
docker build -t 09078601/masjid-backend-app:v1.0.0 .
To run the Docker image:

To push the Docker image to Docker Hub:
docker push 09078601/masjid-backend-app:v1.0.0
Endpoints
Here are some of the available endpoints:
```
POST /register: Register a new user.
POST /login: Log in a user.
GET /home: Get all users.
PATCH /users/:userId: Update a user's donation amount.
DELETE /users/:userId: Delete a user.
For more details about the endpoints and their parameters, please refer to the API documentation.