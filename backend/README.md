# Game Auth API Backend

C# .NET 8 Web API backend for the Game Authentication System.

## Quick Start

1. Ensure you have .NET 8 SDK installed
2. Navigate to the backend directory
3. Run the application:
   ```bash
   dotnet run --project GameAuth.API
   ```

The API will be available at `https://localhost:7000`

## Database

The application uses SQL Server LocalDB with Entity Framework Core. The database is automatically created on first run and includes a test user.

### Test User
- **Nickname**: admin
- **Password**: adminpassword
- **Phone Number**: +1234567890

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "nickname": "username",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "nickname": "username",
  "password": "password123"
}
```

### Dashboard Endpoints

#### Get Dashboard Data
```
GET /api/dashboard
```

## Models

### User
- `Id`: Primary key
- `PhoneNumber`: Unique phone number
- `Nickname`: Unique nickname (3-50 characters)
- `PasswordHash`: Hashed password
- `CreatedAt`: Registration timestamp

### RegisterRequest
- `PhoneNumber`: Required, valid phone number
- `Nickname`: Required, 3-50 characters
- `Password`: Required, 6-100 characters
- `ConfirmPassword`: Required, must match password

### LoginRequest
- `Nickname`: Required
- `Password`: Required

## Configuration

The application uses `appsettings.json` for configuration:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=GameAuthDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

## Dependencies

- Microsoft.AspNetCore.Authentication.JwtBearer
- Microsoft.EntityFrameworkCore
- Microsoft.EntityFrameworkCore.SqlServer
- BCrypt.Net-Next
- System.ComponentModel.Annotations
