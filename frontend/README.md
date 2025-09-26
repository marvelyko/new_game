# Game Auth Frontend

React.js frontend for the Game Authentication System.

## Quick Start

1. Ensure you have Node.js (v16 or higher) installed
2. Navigate to the frontend directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

The React app will be available at `http://localhost:3000`

## Features

- **Login Form**: Authenticate with nickname and password
- **Registration Form**: Register with phone number, nickname, and password
- **Dashboard**: Protected page for authenticated users
- **Responsive Design**: Mobile-friendly interface
- **Form Validation**: Client-side validation with error messages
- **Auto-login**: Automatic login after successful registration

## Components

### LoginForm
- Handles user authentication
- Validates input fields
- Shows error messages
- Links to registration page

### RegisterForm
- Handles user registration
- Validates phone number format
- Ensures password confirmation matches
- Auto-redirects to dashboard after successful registration

### Dashboard
- Displays user information
- Shows account details
- Provides logout functionality
- Fetches dashboard data from API

## Services

### API Service (`services/api.js`)
- Centralized API configuration
- Axios instance with base URL
- Error handling interceptor
- Authentication and dashboard API methods

## Styling

The application uses modern CSS with:
- Gradient backgrounds
- Card-based layout
- Smooth animations
- Responsive design
- Form validation styling

## Routing

- `/` - Redirects to login
- `/login` - Login form
- `/register` - Registration form
- `/dashboard` - Protected dashboard (requires authentication)

## State Management

- Local state for form data
- Local storage for user persistence
- Context-free authentication state
- Automatic redirects based on auth status

## Dependencies

- React 18
- React Router DOM
- Axios
- React Scripts
