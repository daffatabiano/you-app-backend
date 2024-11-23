<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  # Technical Challenge - Backend

This is a backend implementation for a login/profile/chat system built with **Nest.js**, **MongoDB**, and **Node.js**, running on **Docker**. The project includes authentication with **JWT Tokens**, validation with **DTOs**, real-time communication using **Socket.IO** or **RabbitMQ**, and robust **unit tests**. 

Additionally, the system is built with a focus on object-oriented programming, data structures, and schema planning for NoSQL databases.

## Features

- **User Authentication**: Secure login and registration using JWT tokens.
- **Profile Management**: Create, update, and retrieve user profiles with zodiac/horoscope fields.
- **Real-Time Chat**: Text-based chat between users using RabbitMQ for message delivery and notification.
- **API Documentation**: Clear and comprehensive API endpoints.
- **Validation and Testing**: Extensive input validations and unit tests for each module.
- **Dockerized Setup**: Easy deployment with Docker.
- **NoSQL Schema Planning**: Optimized MongoDB schema to handle user and chat data efficiently.

---

## Table of Contents

- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)
- [Credits](#credits)

---

## Technologies Used

- **Nest.js**: Scalable Node.js framework.
- **MongoDB**: NoSQL database.
- **Node.js**: Backend runtime environment.
- **RabbitMQ**: Message broker for real-time communication.
- **Socket.IO**: Optional real-time communication library.
- **JWT**: Authentication tokens.
- **Docker**: Containerization platform.
- **TypeScript**: Primary language for the project.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v16 or higher)
- Docker
- MongoDB
- RabbitMQ

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
```

2. Install Dependencies : 
``` bash
npm install
```

3. Create a .env file :
```.env
MONGO_URI="mongodb+srv://daffatabianoo:Daffatabiano14@cluster0.mrv4i.mongodb.net/youapp?retryWrites=true&w=majority"
JWT_SECRET="daffa tabiano"
JWT_EXPIRATIONS=6000
RABBITMQ_URL="amqp://localhost:5672"
```
4. Build and start the Docker containers:
```bash
docker-compose up --build
```

### Running the Application
Once the setup is complete, the application will be accessible at:
API Base URL: http://localhost:3000

## API Endpoints

### Auth

**Register**
URL : "/api/register"
Method: "POST"
Request Body :
```json
{
  "email": "example@example.com",
  "password": "password123"
}
```
Response : 
```json
{
  message: "User created successfully",
  token: "Bearer example"
}
```

**Login**
URL : "/api/login"
Method: "GET"
Request Body :
```json
{
  "email": "example@example.com",
  "password": "password123"
}
```
Response : 
```json
  {
  message: "Login Successful",
  token: "Bearer example",
  user: {
  username: "example123",
  email : "example@gmail.com,
}
}
```

## Profile

**Create Profile**
URL: "api/createProfile"
Method: "POST"
Request Body :
```json
  "userId" : "123",
  "name" : "daffa",
  "birthday" : "14-08-2002",
  "height" : "168",
  "weight" : "55",
  "interest" : ["coding", "reading", "hiking"]
```

**Get Profile**
URL: "api/getProfile"
Method: "GET"
Response :
```json
    "userId" : "123",
  "name" : "daffa",
  "birthday" : "14-08-2002",
  "horoscope" : "Leo"(auto-generate from birthday),
  "zodiac" : "Horse"(auto-generate from birthday),
  "height" : "168",
  "weight" : "55",
  "interest" : ["coding", "reading", "hiking"],
```

**Update Profile**
URL: "api/updateProfile/:id"
Method: "PUT"
Request Body :
```json
  "userId" : "123",
  "name" : "daffa",
  "birthday" : "14-08-2002",
  "height" : "168",
  "weight" : "55",
  "interest" : ["coding", "reading", "hiking"]
```

**Delete Profile**
URL: "api/deleteProfile:/id"
Method: "DELETE"

## Chat

**View Message**
URL: "api/viewMessages/"
Method: "GET
QueryParams : 
chatRoomId : string
Response : 
```json
[
  "chatRoomId": "123"
  {
  "sender": "john doe",
  "receiver": "jane doe",
"content" : "Hello Jane",
},
  {
  "sender": "jane doe",
  "receiver": "john doe",
"content" : "Whats Up John",
},
]

```

**Send Message**
URL:"api/sendMessage"
Method : "POST"
Request Body : 
``` json 
{
  chatRoomId: "123",
  content: "Hello World !"
}
```

# Database Schema

**UserSchema**
```json
{
  "_id": "ObjectId",
  "email": "string",
  "password": "hashed_string",
  "profile": {
    "username": "string",
    "horoscope": "string",
    "zodiac": "string"
  }
}
```
**ChatSchema**
```json
{
  "_id": "ObjectId",
  "chatRoomId": "string",
  "participants": ["userId1", "userId2"],
  "messages": [
    {
      "senderId": "userId",
      "content": "string",
      "timestamp": "ISODate"
    }
  ]
}
```

## Testing 
Run the tests using:
```bash 
  npm run test
```

## Future Enhancements
- Support for media sharing in chats.
- Advanced search/filtering for messages.
- Group chat functionality.
- Rate limiting and enhanced security features.

## Credits
- <a href="https://www.figma.com/file/VnqmoYfwdTzN8qvvDZn6GC/YouApp-Test?node-id=0%3A1">Figma Design</a>
- <a href="https://docs.google.com/spreadsheets/d/1Oahej8yuEHfDsQI-AwycEpQ0CnjkMsxOMg2ywMKnjsg/edit#gid=1538893505">Zodiac / Horoscope reference</a>

 

