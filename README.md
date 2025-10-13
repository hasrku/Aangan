# Frontend - Property Buy/Sell Application

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
VITE_BACKEND_URL=http://localhost:5000
```

### 3. Run the Development Server

```bash
npm run dev
```

## Features

### Authentication

-   **Login**: User login with email and password
-   **Signup**: User registration with form validation
-   **Logout**: User logout functionality
-   **Protected Routes**: JWT token-based authentication

### API Integration

-   Axios instance configured with backend URL
-   Automatic token handling
-   Error handling and user feedback
-   Form validation

## API Endpoints Used

-   `POST /api/auth/login` - User login
-   `POST /api/auth/signup` - User registration
-   `POST /api/auth/logout` - User logout
-   `GET /api/auth/profile` - Get user profile (protected)

## Authentication Flow

1. **Login/Signup**: Users authenticate and receive JWT token
2. **Token Storage**: Token stored in localStorage
3. **Automatic Headers**: Axios automatically adds Bearer token to requests
4. **Token Expiry**: Automatic redirect to login on token expiry
5. **Logout**: Token removed from localStorage

## Dependencies

-   react: Frontend framework
-   react-router-dom: Routing
-   axios: HTTP client
-   react-icons: Icons
-   tailwindcss: Styling
