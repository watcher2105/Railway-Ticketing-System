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

-- Insert sample trains for 10 journeys (50 trains total)
INSERT INTO trains (train_number, train_name, source, destination, departure_time, arrival_time, total_seats, fare) VALUES
-- Journey 1: New Delhi to Mumbai (5 trains)
('12951', 'Rajdhani Express', 'New Delhi', 'Mumbai', '16:00:00', '08:15:00', 500, 2500.00),
('12953', 'August Kranti Rajdhani', 'New Delhi', 'Mumbai', '17:30:00', '09:45:00', 480, 2400.00),
('12215', 'Bandra Garib Rath', 'New Delhi', 'Mumbai', '15:15:00', '06:30:00', 450, 1800.00),
('12137', 'Punjab Mail', 'New Delhi', 'Mumbai', '19:35:00', '13:25:00', 520, 1500.00),
('12909', 'Maharashtra Sampark Kranti', 'New Delhi', 'Mumbai', '11:40:00', '03:20:00', 490, 2100.00),

-- Journey 2: New Delhi to Chandigarh (5 trains)
('12011', 'Shatabdi Express', 'New Delhi', 'Chandigarh', '07:20:00', '10:50:00', 400, 800.00),
('12045', 'New Delhi Chandigarh Shatabdi', 'New Delhi', 'Chandigarh', '16:30:00', '20:00:00', 420, 850.00),
('12005', 'Kalka Shatabdi', 'New Delhi', 'Chandigarh', '17:40:00', '21:05:00', 380, 780.00),
('12459', 'NDLS CDG AC Express', 'New Delhi', 'Chandigarh', '06:00:00', '10:30:00', 440, 750.00),
('12053', 'Chandigarh Jn Shatabdi', 'New Delhi', 'Chandigarh', '07:45:00', '11:10:00', 410, 820.00),

-- Journey 3: Mumbai to Kolkata (5 trains)
('12859', 'Gitanjali Express', 'Mumbai', 'Kolkata', '06:00:00', '10:30:00', 600, 3000.00),
('12869', 'Csmt Howrah SF Express', 'Mumbai', 'Kolkata', '19:30:00', '20:45:00', 550, 2800.00),
('12809', 'Howrah Mail', 'Mumbai', 'Kolkata', '20:05:00', '22:30:00', 580, 2500.00),
('12261', 'Duronto Express', 'Mumbai', 'Kolkata', '11:05:00', '08:40:00', 620, 3200.00),
('12833', 'Howrah Express', 'Mumbai', 'Kolkata', '18:50:00', '20:05:00', 560, 2700.00),

-- Journey 4: Chennai to Bangalore (5 trains)
('12607', 'Lalbagh Express', 'Chennai', 'Bangalore', '06:00:00', '11:30:00', 350, 600.00),
('12639', 'Brindavan Express', 'Chennai', 'Bangalore', '15:00:00', '20:30:00', 380, 650.00),
('12609', 'Bangalore Express', 'Chennai', 'Bangalore', '22:00:00', '04:40:00', 400, 580.00),
('12295', 'Sanghamitra Express', 'Chennai', 'Bangalore', '18:45:00', '01:15:00', 370, 620.00),
('22625', 'Double Decker AC Express', 'Chennai', 'Bangalore', '06:50:00', '12:25:00', 360, 700.00),

-- Journey 5: Kolkata to New Delhi (5 trains)
('12301', 'Howrah Rajdhani', 'Kolkata', 'New Delhi', '17:00:00', '09:55:00', 450, 2300.00),
('12311', 'Kalka Mail', 'Kolkata', 'New Delhi', '22:35:00', '22:10:00', 500, 1800.00),
('12313', 'Sealdah Rajdhani', 'Kolkata', 'New Delhi', '16:50:00', '10:05:00', 480, 2400.00),
('12381', 'Poorva Express', 'Kolkata', 'New Delhi', '15:55:00', '13:55:00', 520, 2000.00),
('12303', 'Poorva Express AC', 'Kolkata', 'New Delhi', '08:15:00', '06:30:00', 460, 2200.00),

-- Journey 6: Bangalore to Hyderabad (5 trains)
('12785', 'Kacheguda SF Express', 'Bangalore', 'Hyderabad', '20:15:00', '06:05:00', 440, 900.00),
('12163', 'Bangalore Hyderabad Express', 'Bangalore', 'Hyderabad', '18:50:00', '04:30:00', 420, 850.00),
('12794', 'Rayalaseema Express', 'Bangalore', 'Hyderabad', '21:45:00', '07:25:00', 460, 880.00),
('12605', 'Hyderabad Express', 'Bangalore', 'Hyderabad', '22:10:00', '08:00:00', 450, 920.00),
('12797', 'Kacheguda Express', 'Bangalore', 'Hyderabad', '06:30:00', '16:15:00', 430, 870.00),

-- Journey 7: Delhi to Jaipur (5 trains)
('12015', 'Ajmer Shatabdi', 'New Delhi', 'Jaipur', '06:05:00', '10:30:00', 380, 750.00),
('12413', 'Jaipur AC Superfast', 'New Delhi', 'Jaipur', '15:45:00', '21:15:00', 400, 680.00),
('12958', 'Swarna Jayanti Rajdhani', 'New Delhi', 'Jaipur', '17:55:00', '23:00:00', 420, 1200.00),
('12916', 'Ashram Express', 'New Delhi', 'Jaipur', '15:20:00', '20:35:00', 450, 650.00),
('12986', 'Double Decker', 'New Delhi', 'Jaipur', '17:15:00', '22:30:00', 360, 700.00),

-- Journey 8: Mumbai to Pune (5 trains)
('12127', 'Pragati Express', 'Mumbai', 'Pune', '06:05:00', '09:25:00', 320, 400.00),
('12125', 'Pune Pragati SF', 'Mumbai', 'Pune', '17:40:00', '21:00:00', 340, 420.00),
('11301', 'Deccan Queen', 'Mumbai', 'Pune', '17:10:00', '20:25:00', 350, 450.00),
('12123', 'Deccan Express', 'Mumbai', 'Pune', '18:30:00', '22:00:00', 330, 390.00),
('11007', 'Mumbai Pune Double Decker', 'Mumbai', 'Pune', '07:25:00', '10:40:00', 310, 480.00),

-- Journey 9: Chennai to Hyderabad (5 trains)
('12604', 'Hyderabad Express', 'Chennai', 'Hyderabad', '17:30:00', '05:45:00', 460, 1100.00),
('12759', 'Charminar Express', 'Chennai', 'Hyderabad', '18:25:00', '06:30:00', 480, 1050.00),
('12786', 'Kacheguda SF Express', 'Chennai', 'Hyderabad', '20:00:00', '06:00:00', 440, 1150.00),
('12793', 'Rayalaseema SF Express', 'Chennai', 'Hyderabad', '21:00:00', '07:15:00', 450, 1080.00),
('12764', 'Padmavati Express', 'Chennai', 'Hyderabad', '16:00:00', '03:30:00', 470, 1120.00),

-- Journey 10: Ahmedabad to Mumbai (5 trains)
('12927', 'Paschim Express', 'Ahmedabad', 'Mumbai', '20:45:00', '06:35:00', 390, 850.00),
('12901', 'Gujarat Mail', 'Ahmedabad', 'Mumbai', '21:35:00', '07:50:00', 410, 800.00),
('12933', 'Karnavati Express', 'Ahmedabad', 'Mumbai', '06:50:00', '14:25:00', 420, 780.00),
('19023', 'Firozpur Janta Express', 'Ahmedabad', 'Mumbai', '11:45:00', '21:20:00', 380, 720.00),
('12471', 'Swaraj Express', 'Ahmedabad', 'Mumbai', '15:10:00', '23:05:00', 400, 760.00);
