# College Connect

A MERN stack web application for college issue management where students can submit and track their issues, and admins can manage and resolve them.

## Features

- **Student Authentication**: Sign up and login for students
- **Admin Authentication**: Secure admin login
- **Issue Management**: Students can submit issues in different categories
- **Issue Tracking**: Students can track the status of their submitted issues
- **Admin Dashboard**: Admins can view, filter, and update issue statuses
- **Responsive Design**: Clean and modern UI with Bootstrap

## Tech Stack

- **Frontend**: React.js with Bootstrap
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd college-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

   This will start both frontend (port 3000) and backend (port 5000)

## License

MIT
