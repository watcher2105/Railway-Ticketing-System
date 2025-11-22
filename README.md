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

### Routes Covered
1. New Delhi → Mumbai
2. New Delhi → Chandigarh
3. Mumbai → Kolkata
4. Chennai → Bangalore
5. Kolkata → New Delhi
6. Bangalore → Hyderabad
7. Delhi → Jaipur
8. Mumbai → Pune
9. Chennai → Hyderabad
10. Ahmedabad → Mumbai

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

## 🔌 API Endpoints

### Authentication
- **POST** `/api/signup` - Register new user
- **POST** `/api/login` - User login

### Trains
- **GET** `/api/search-trains?source=X&destination=Y` - Search trains
- **GET** `/api/check-availability?train_id=X&travel_date=Y` - Check seats

### Bookings
- **POST** `/api/book-ticket` - Create new booking
- **GET** `/api/user-bookings/:user_id` - Get user's bookings

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

## 🚀 Deployment

### Netlify Deployment

This application can be deployed on Netlify with the following considerations:

#### Prerequisites
- Netlify account
- MySQL database hosting service (e.g., PlanetScale, Railway, AWS RDS, or any cloud MySQL provider)

#### Steps to Deploy

1. **Prepare Backend for Deployment**
   - Update `.env` file with production database credentials
   - Consider deploying backend separately on services like:
     - **Heroku**: For Node.js backend
     - **Railway**: For full-stack deployment
     - **Render**: For backend API
     - **AWS EC2/Elastic Beanstalk**: For scalable deployment

2. **Update API Base URL**
   - In `script.js`, update `API_BASE_URL` to your deployed backend URL:
   ```javascript
   const API_BASE_URL = 'https://your-backend-url.com/api';
   ```

3. **Deploy Frontend to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: (leave empty for static files)
   - Set publish directory: `/` (root directory)
   - Deploy the site

4. **Environment Variables**
   - For backend deployment, set environment variables in your hosting platform
   - Ensure all variables from `.env` are configured

5. **Database Setup**
   - Host MySQL database on cloud provider
   - Import `railway.sql` schema and data
   - Update backend `.env` with production database credentials

#### Recommended Deployment Architecture
```
Frontend (Netlify) → Backend API (Heroku/Railway/Render) → MySQL Database (PlanetScale/AWS RDS)
```

#### Alternative: Full-Stack Deployment
For easier deployment, consider using platforms that support both frontend and backend:
- **Railway**: Deploy entire Node.js application
- **Render**: Free tier with PostgreSQL/MySQL support
- **Vercel**: Deploy with serverless functions

**Note**: Since this is a Node.js backend application, Netlify alone won't suffice. You need separate backend hosting or use Netlify Functions to convert the Express API to serverless functions.

## 🐛 Troubleshooting

### Server won't start
- Check if MySQL is running
- Verify credentials in `.env`
- Ensure port 3000 is not in use

### Database connection failed
- Check MySQL service status
- Verify DB_HOST (use `127.0.0.1` instead of `localhost` if issues)
- Confirm database exists and user has permissions

### No trains showing
- Verify railway.sql was imported correctly
- Check browser console for errors
- Ensure server is running on port 3000

### Booking fails
- Check available seats before booking
- Verify user is logged in (check sessionStorage)
- Check server logs for errors

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Happy Journey! 🚂**
