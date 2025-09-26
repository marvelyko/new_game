# Game Authentication System

A full-stack web application built with React.js frontend and C# .NET 8 Web API backend for user registration and authentication.

## Features

- **User Registration**: Register with phone number, unique nickname, and password
- **User Authentication**: Login with nickname and password
- **Phone Number Validation**: Ensures unique phone numbers per user
- **Nickname Uniqueness**: Prevents duplicate nicknames
- **Password Security**: Passwords are hashed using BCrypt
- **Responsive UI**: Modern, mobile-friendly interface
- **Test User**: Pre-configured admin user for testing

## Project Structure

```
├── backend/
│   ├── GameAuth.API/
│   │   ├── Controllers/
│   │   ├── Data/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── Program.cs
│   └── GameAuth.sln
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Prerequisites

- .NET 8 SDK
- Node.js (v16 or higher)
- SQL Server LocalDB (included with Visual Studio)
- Visual Studio 2022 or VS Code

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

3. Run the application:
   ```bash
   dotnet run --project GameAuth.API
   ```

The API will be available at `https://localhost:7000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The React app will be available at `http://localhost:3000`

## Test User

A test user is automatically created when the application starts:
- **Nickname**: admin
- **Password**: adminpassword
- **Phone Number**: +1234567890

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with nickname and password

### Dashboard
- `GET /api/dashboard` - Get dashboard data (protected)

## Usage

1. **Registration**: 
   - Visit the registration page
   - Enter a valid phone number (e.g., +1234567890)
   - Choose a unique nickname (minimum 3 characters)
   - Set a password (minimum 6 characters)
   - Confirm the password

2. **Login**:
   - Use the test user credentials or register a new account
   - Enter nickname and password
   - You'll be redirected to the dashboard upon successful login

3. **Dashboard**:
   - View user information
   - Access protected content
   - Logout when done

## Technologies Used

### Backend
- .NET 8 Web API
- Entity Framework Core
- SQL Server LocalDB
- BCrypt for password hashing
- CORS for cross-origin requests

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Modern CSS with gradients and animations

## Security Features

- Password hashing with BCrypt
- Input validation on both client and server
- Unique constraints on phone numbers and nicknames
- CORS configuration for secure cross-origin requests

## Development Notes

- The database is automatically created on first run
- Test user is seeded automatically
- Hot reload is enabled for both frontend and backend
- All API responses include proper error handling

## Next Steps

This foundation provides a solid base for building additional features such as:
- JWT token authentication
- Email verification
- Password reset functionality
- User profile management
- Role-based access control