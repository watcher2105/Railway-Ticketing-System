-- Active: 1763540327470@@localhost@3306@railway_ticketing_system
-- Use existing database
USE railway_ticketing_system;

-- Drop tables if they exist
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS trains;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trains table
CREATE TABLE trains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_number VARCHAR(20) UNIQUE NOT NULL,
    train_name VARCHAR(100) NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    total_seats INT NOT NULL,
    fare DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    train_id INT NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_email VARCHAR(100) NOT NULL,
    travel_date DATE NOT NULL,
    seats_booked INT NOT NULL,
    pnr VARCHAR(20) UNIQUE NOT NULL,
    booking_status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
    total_fare DECIMAL(10,2) NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (train_id) REFERENCES trains(id)
);

-- Insert sample trains for 5 journeys (10 trains total)
INSERT INTO trains (train_number, train_name, source, destination, departure_time, arrival_time, total_seats, fare) VALUES
-- Journey 1: New Delhi to Mumbai
('12951', 'Rajdhani Express', 'New Delhi', 'Mumbai', '16:00:00', '08:15:00', 500, 2500.00),
('12953', 'August Kranti Rajdhani', 'New Delhi', 'Mumbai', '17:30:00', '09:45:00', 480, 2400.00),

-- Journey 2: New Delhi to Chandigarh
('12011', 'Shatabdi Express', 'New Delhi', 'Chandigarh', '07:20:00', '10:50:00', 400, 800.00),
('12045', 'New Delhi Chandigarh Shatabdi', 'New Delhi', 'Chandigarh', '16:30:00', '20:00:00', 420, 850.00),

-- Journey 3: Mumbai to Kolkata
('12859', 'Gitanjali Express', 'Mumbai', 'Kolkata', '06:00:00', '10:30:00', 600, 3000.00),
('12869', 'Csmt Howrah SF Express', 'Mumbai', 'Kolkata', '19:30:00', '20:45:00', 550, 2800.00),

-- Journey 4: Chennai to Bangalore
('12607', 'Lalbagh Express', 'Chennai', 'Bangalore', '06:00:00', '11:30:00', 350, 600.00),
('12639', 'Brindavan Express', 'Chennai', 'Bangalore', '15:00:00', '20:30:00', 380, 650.00),

-- Journey 5: Kolkata to New Delhi
('12301', 'Howrah Rajdhani', 'Kolkata', 'New Delhi', '17:00:00', '09:55:00', 450, 2300.00),
('12311', 'Kalka Mail', 'Kolkata', 'New Delhi', '22:35:00', '22:10:00', 500, 1800.00);
