# Digital Health Wallet

A secure application to store, manage, and share medical reports and track health vitals.

## Project Overview
This project allows users to:
- Securely register and login.
- Upload medical reports (PDF, Images, etc.).
- Track vital signs (BP, Heart Rate) over time with visualization.
- Share access to reports with other users (e.g., Doctors, Family).

## Tech Stack
- **Frontend**: React.js, Recharts, Axios
- **Backend**: Node.js, Express, SQLite, Multer, JWT
- **Database**: SQLite (`health_wallet.db`)

## Setup Instructions

### Prerequisites
- Node.js (v18+)

### Installation
1.  **Clone/Download the repository**.
2.  **Install Backend Dependencies**:
    ```bash
    cd digital-health-wallet/server
    npm install
    ```
3.  **Install Frontend Dependencies**:
    ```bash
    cd digital-health-wallet/client
    npm install
    ```

## Running the Application

### 1. Start the Backend Server
Open a terminal:
```bash
cd digital-health-wallet/server
node index.js
```
The server runs on `http://localhost:5001`.

### 2. Start the Frontend Application
Open a **new** terminal:
```bash
cd digital-health-wallet/client
npm start
```
The application will open in your browser at `http://localhost:3000`.

## Testing
To run the automated backend verification script:
1.  Ensure the backend server is running.
2.  Run:
    ```bash
    node verify_backend.js
    ```

## Project Structure
- `client/`: React frontend code.
- `server/`: Express backend code.
- `server/uploads/`: Directory where uploaded files are stored.
- `server/health_wallet.db`: SQLite database file (created on first run).
