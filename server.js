const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const db = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'yourpassword',
    database: 'railway_ticketing_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }
    console.log('Connected to MySQL database');
    connection.release();
});

// Helper function to hash passwords
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// User Registration
app.post('/api/signup', (req, res) => {
    const { username, email, password, full_name, phone } = req.body;
    
    if (!username || !email || !password || !full_name) {
        return res.status(400).json({ success: false, error: 'All required fields must be filled' });
    }
    
    const hashedPassword = hashPassword(password);
    
    const query = 'INSERT INTO users (username, email, password, full_name, phone) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [username, email, hashedPassword, full_name, phone || null], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, error: 'Username or email already exists' });
            }
            console.error('Signup error:', err);
            return res.status(500).json({ success: false, error: 'Registration failed' });
        }
        
        res.json({ success: true, message: 'Registration successful', userId: result.insertId });
    });
});

// User Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password are required' });
    }
    
    const hashedPassword = hashPassword(password);
    
    const query = 'SELECT id, username, email, full_name, phone FROM users WHERE username = ? AND password = ?';
    
    db.query(query, [username, hashedPassword], (err, results) => {
        if (err) {
            console.error('Login error:', err);
            return res.status(500).json({ success: false, error: 'Login failed' });
        }
        
        if (results.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid username or password' });
        }
        
        const user = results[0];
        res.json({ 
            success: true, 
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                phone: user.phone
            }
        });
    });
});

app.get('/api/search-trains', (req, res) => {
    const { source, destination } = req.query;
    
    if (!source || !destination) {
        return res.status(400).json({ error: 'Source and destination are required' });
    }
    
    const query = `
        SELECT id, train_number, train_name, source, destination, departure_time, arrival_time, total_seats, fare 
        FROM trains 
        WHERE LOWER(source) = LOWER(?) AND LOWER(destination) = LOWER(?)
    `;
    
    db.query(query, [source, destination], (err, results) => {
        if (err) {
            console.error('Error searching trains:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

app.get('/api/check-availability', (req, res) => {
    const { train_id, travel_date } = req.query;
    
    if (!train_id || !travel_date) {
        return res.status(400).json({ error: 'Train ID and travel date are required' });
    }
    
    const trainQuery = 'SELECT total_seats FROM trains WHERE id = ?';
    
    db.query(trainQuery, [train_id], (err, trainResults) => {
        if (err) {
            console.error('Error fetching train:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (trainResults.length === 0) {
            return res.status(404).json({ error: 'Train not found' });
        }
        
        const total_seats = trainResults[0].total_seats;
        
        const bookingQuery = `
            SELECT COALESCE(SUM(seats_booked), 0) as booked_seats 
            FROM bookings 
            WHERE train_id = ? AND travel_date = ?
        `;
        
        db.query(bookingQuery, [train_id, travel_date], (err, bookingResults) => {
            if (err) {
                console.error('Error fetching bookings:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            const booked_seats = bookingResults[0].booked_seats;
            const available_seats = total_seats - booked_seats;
            
            res.json({
                total_seats,
                booked_seats,
                available_seats
            });
        });
    });
});

app.post('/api/book-ticket', (req, res) => {
    const { user_id, train_id, passenger_name, passenger_email, travel_date, seats_booked } = req.body;
    
    if (!user_id || !train_id || !passenger_name || !passenger_email || !travel_date || !seats_booked) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    
    if (seats_booked <= 0) {
        return res.status(400).json({ success: false, error: 'Invalid number of seats' });
    }
    
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Connection error:', err);
            return res.status(500).json({ success: false, error: 'Database connection error' });
        }
        
        connection.beginTransaction(err => {
            if (err) {
                connection.release();
                return res.status(500).json({ success: false, error: 'Transaction error' });
            }
            
            const trainQuery = 'SELECT total_seats, fare FROM trains WHERE id = ? FOR UPDATE';
            
            connection.query(trainQuery, [train_id], (err, trainResults) => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ success: false, error: 'Database error' });
                    });
                }
                
                if (trainResults.length === 0) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(404).json({ success: false, error: 'Train not found' });
                    });
                }
                
                const total_seats = trainResults[0].total_seats;
                const fare = trainResults[0].fare;
                const total_fare = fare * seats_booked;
                
                const bookingQuery = `
                    SELECT COALESCE(SUM(seats_booked), 0) as booked_seats 
                    FROM bookings 
                    WHERE train_id = ? AND travel_date = ? AND booking_status = 'confirmed' FOR UPDATE
                `;
                
                connection.query(bookingQuery, [train_id, travel_date], (err, bookingResults) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(500).json({ success: false, error: 'Database error' });
                        });
                    }
                    
                    const booked_seats = bookingResults[0].booked_seats;
                    const available_seats = total_seats - booked_seats;
                    
                    if (available_seats < seats_booked) {
                        return connection.rollback(() => {
                            connection.release();
                            res.status(400).json({ 
                                success: false, 
                                error: `Not enough seats available. Only ${available_seats} seats left.` 
                            });
                        });
                    }
                    
                    const pnr = 'PNR' + Math.random().toString(36).substr(2, 10).toUpperCase();
                    
                    const insertQuery = `
                        INSERT INTO bookings (user_id, train_id, passenger_name, passenger_email, travel_date, seats_booked, pnr, total_fare) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    
                    connection.query(insertQuery, [user_id, train_id, passenger_name, passenger_email, travel_date, seats_booked, pnr, total_fare], (err) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                res.status(500).json({ success: false, error: 'Booking failed' });
                            });
                        }
                        
                        connection.commit(err => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ success: false, error: 'Commit failed' });
                                });
                            }
                            
                            connection.release();
                            res.json({ success: true, pnr, total_fare });
                        });
                    });
                });
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api/`);
});
