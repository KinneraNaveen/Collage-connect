# College Connect - Frontend

React frontend for the College Connect application.

## Features

- **Responsive Design**: Mobile-first approach with Bootstrap
- **User Authentication**: Login/Register with JWT
- **Student Dashboard**: Submit and track issues
- **Admin Dashboard**: Manage students and issues
- **Real-time Updates**: Live status updates
- **Clean UI**: Modern, professional interface

## Tech Stack

- React 18
- React Router DOM
- Bootstrap 5
- React Bootstrap
- Axios for API calls
- React Icons
- React Toastify for notifications

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/     # Reusable components
├── context/       # Authentication context
├── hooks/         # Custom hooks
├── utils/         # Utility functions
├── styles/        # CSS files
└── App.js         # Main app component
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## API Configuration

The app is configured to proxy requests to `http://localhost:5000` (backend server).
