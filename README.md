# Railway Ticketing System

A comprehensive web-based railway ticketing system built with HTML, CSS, JavaScript (frontend) and Node.js with Express (backend), featuring user authentication, real-time seat availability, and booking management.

## 🚂 Features

### User Authentication
- **Sign Up**: New users can register with username, email, password, full name, and phone number
- **Login**: Secure authentication with SHA-256 password hashing
- **Session Management**: User sessions maintained using sessionStorage
- **Protected Routes**: All pages require authentication except login/signup

### Train Search & Booking
- **Search Trains**: Find trains by source and destination stations
- **Real-time Availability**: Check live seat availability for selected travel dates
- **50 Trains**: 10 major routes with 5 trains each
- **Detailed Information**: View train names, numbers, timings, routes, and fares

### Booking System
- **Passenger Details**: Enter passenger name, email, and number of seats
- **Overbooking Prevention**: Database-level locks prevent double booking
- **PNR Generation**: Unique 10-character PNR for each booking
- **Booking Confirmation**: Detailed confirmation page with all booking details
- **Booking History**: View all your past and upcoming bookings

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic structure
- **CSS3**: Responsive design with gradient backgrounds and modern UI
- **JavaScript (ES6+)**: Async/await for API calls, DOM manipulation, session handling

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MySQL2**: Database driver with connection pooling
- **dotenv**: Environment variable management
- **crypto**: Password hashing (SHA-256)

### Database
- **MySQL**: Relational database
- **Tables**: 
  - `users` - User account information
  - `trains` - Train details and schedules
  - `bookings` - Booking records with foreign keys

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm (comes with Node.js)
- Web browser (Chrome, Firefox, Edge, etc.)

## 🚀 Getting Started

Follow these steps to run the project locally:

### Step 1: Clone the Repository
```bash
git clone https://github.com/watcher2105/Railway-Ticketing-System.git
cd Railway-Ticketing-System
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up MySQL Database
1. Start your MySQL server
2. Open MySQL command line or MySQL Workbench
3. Create the database:
```sql
CREATE DATABASE railway_ticketing_system;
```
4. Import the database schema and sample data:
```bash
mysql -u root -p railway_ticketing_system < railway.sql
```
Or if using MySQL Workbench:
- Open `railway.sql` file
- Execute the script

### Step 4: Configure Environment Variables
1. Copy the example environment file:
```bash
cp .env.example .env
```
2. Open `.env` file and update with your MySQL credentials:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=railway_ticketing_system
PORT=3000
```

### Step 5: Start the Server
```bash
npm start
```
Or for development with auto-restart:
```bash
npm run dev
```

You should see:
```
Server is running on http://localhost:3000
API endpoints available at http://localhost:3000/api/
Connected to MySQL database
```

### Step 6: Open the Application
Open your web browser and navigate to:
```
http://localhost:3000/login.html
```

### Step 7: Create an Account
1. Click on "Sign Up" tab
2. Fill in your details (username, email, password, full name, phone)
3. Click "Sign Up"
4. Login with your credentials

### Step 8: Start Booking!
- Search for trains by entering source and destination
- Select a train and book tickets
- View your booking history


## 📁 Project Structure

```
Railway-Ticketing-System/
├── backend/                    # Backend directory (placeholder)
├── .env                        # Environment variables (not in git)
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── package.json               # npm dependencies
├── server.js                  # Express server & API endpoints
├── railway.sql                # Database schema & sample data
│
├── login.html                 # Authentication page
├── Index.html                 # Train search page
├── booking.html               # Passenger booking form
├── confirm.html               # Booking confirmation page
├── bookings.html              # User booking history
│
├── auth.js                    # Login/signup logic
├── script.js                  # Main frontend logic
└── styles.css                 # Application styles
```

## 🔄 Application Flow

### 1. User Registration/Login
```
User opens login.html
↓
Enters credentials (sign up or login)
↓
Frontend sends POST to /api/signup or /api/login
↓
Backend validates & hashes password (SHA-256)
↓
User data stored in sessionStorage
↓
Redirect to Index.html
```

### 2. Train Search
```
User enters source, destination, travel date
↓
Frontend sends GET to /api/search-trains
↓
Backend queries trains table
↓
For each train, fetch availability via /api/check-availability
↓
Display trains with available seats highlighted
```

### 3. Booking Process
```
User clicks "Book Now" on a train
↓
Redirect to booking.html with train data
↓
User enters passenger details & seats
↓
Frontend sends POST to /api/book-ticket
↓
Backend starts transaction with row lock (FOR UPDATE)
↓
Check seat availability
↓
If available: Create booking, generate PNR, update seats
↓
Commit transaction
↓
Redirect to confirm.html with booking details
```

### 4. View Bookings
```
User clicks "View Bookings"
↓
Frontend sends GET to /api/user-bookings/:user_id
↓
Backend queries bookings JOIN trains
↓
Display all user bookings with status
```

## 🗄️ Database Schema

### users
```sql
- id (PRIMARY KEY, AUTO_INCREMENT)
- username (UNIQUE)
- email (UNIQUE)
- password (SHA-256 hash)
- full_name
- phone
- created_at (TIMESTAMP)
```

### trains
```sql
- id (PRIMARY KEY, AUTO_INCREMENT)
- train_number (UNIQUE)
- train_name
- source
- destination
- departure_time
- arrival_time
- total_seats
- fare (DECIMAL)
```

### bookings
```sql
- id (PRIMARY KEY, AUTO_INCREMENT)
- user_id (FOREIGN KEY → users.id)
- train_id (FOREIGN KEY → trains.id)
- pnr (UNIQUE)
- passenger_name
- passenger_email
- travel_date
- seats_booked
- total_fare
- booking_status (ENUM: Confirmed, Pending, Cancelled)
- booking_date (TIMESTAMP)
```

## 🔒 Security Features

- **Password Hashing**: SHA-256 encryption for passwords
- **Session Management**: Client-side session with user validation
- **SQL Injection Prevention**: Parameterized queries with mysql2
- **Transaction Locks**: Row-level locks prevent race conditions
- **Environment Variables**: Sensitive credentials stored in .env
- **.gitignore**: Prevents .env from being committed

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Gradient Background**: Modern purple gradient theme
- **Color-coded Status**: Green (available), Red (sold out), Status badges
- **Interactive Cards**: Hover effects on train and booking cards
- **Form Validation**: Client-side and server-side validation
- **Loading States**: User feedback during API calls

## 📄 License

This project is licensed under the MIT License.


**Happy Journey! 🚂**
