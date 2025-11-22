const API_BASE_URL = 'http://localhost:3000/api';
let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const userStr = sessionStorage.getItem('user');
    if (!userStr) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(userStr);
    document.getElementById('userInfo').textContent = `Welcome, ${currentUser.full_name}`;
    
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '' || currentPage === 'Index.html') {
        initSearchPage();
    } else if (currentPage === 'booking.html') {
        initBookingPage();
    } else if (currentPage === 'confirm.html') {
        initConfirmPage();
    } else if (currentPage === 'bookings.html') {
        initBookingsPage();
    }
});

function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

function initSearchPage() {
    const searchForm = document.getElementById('searchForm');
    const travelDateInput = document.getElementById('travel_date');
    
    const today = new Date().toISOString().split('T')[0];
    travelDateInput.setAttribute('min', today);
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        searchTrains();
    });
}

async function searchTrains() {
    const source = document.getElementById('source').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const travelDate = document.getElementById('travel_date').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/search-trains?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`);
        const trains = await response.json();
        
        if (trains.error) {
            alert(trains.error);
            return;
        }
        
        await displayTrains(trains, travelDate);
    } catch (error) {
        alert('Error searching trains: ' + error.message);
    }
}

async function displayTrains(trains, travelDate) {
    const resultsDiv = document.getElementById('results');
    const trainsListDiv = document.getElementById('trainsList');
    
    if (trains.length === 0) {
        trainsListDiv.innerHTML = '<p class="no-results">No trains found for this route.</p>';
        resultsDiv.style.display = 'block';
        return;
    }
    
    trainsListDiv.innerHTML = '<p class="loading">Loading seat availability...</p>';
    resultsDiv.style.display = 'block';
    
    const trainCards = [];
    
    for (const train of trains) {
        try {
            const availabilityResponse = await fetch(`${API_BASE_URL}/check-availability?train_id=${train.id}&travel_date=${travelDate}`);
            const availability = await availabilityResponse.json();
            
            const trainCard = document.createElement('div');
            trainCard.className = 'train-card';
            
            const availableSeats = availability.available_seats || 0;
            const seatStatus = availableSeats > 0 ? `<span class="seats-available">${availableSeats} seats available</span>` : '<span class="seats-full">Fully Booked</span>';
            
            trainCard.innerHTML = `
                <div class="train-info">
                    <div class="train-header">
                        <h3>${train.train_name}</h3>
                        <span class="train-number">${train.train_number}</span>
                    </div>
                    <div class="train-route">
                        <div class="route-point">
                            <span class="station">${train.source}</span>
                            <span class="time">${formatTime(train.departure_time)}</span>
                        </div>
                        <div class="route-arrow">→</div>
                        <div class="route-point">
                            <span class="station">${train.destination}</span>
                            <span class="time">${formatTime(train.arrival_time)}</span>
                        </div>
                    </div>
                    <div class="seats-info">
                        <p>Total Seats: ${train.total_seats}</p>
                        <p class="availability">${seatStatus}</p>
                        <p class="fare">Fare: ₹${train.fare} per seat</p>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="selectTrain(${train.id}, '${train.train_name}', '${train.train_number}', '${train.source}', '${train.destination}', '${train.departure_time}', '${train.arrival_time}', '${travelDate}', ${train.fare})" ${availableSeats <= 0 ? 'disabled' : ''}>
                    ${availableSeats > 0 ? 'Book Now' : 'Sold Out'}
                </button>
            `;
            trainCards.push(trainCard);
        } catch (error) {
            console.error('Error fetching availability for train:', train.id, error);
        }
    }
    
    trainsListDiv.innerHTML = '';
    trainCards.forEach(card => trainsListDiv.appendChild(card));
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function selectTrain(trainId, trainName, trainNumber, source, destination, departureTime, arrivalTime, travelDate, fare) {
    const trainData = {
        id: trainId,
        name: trainName,
        number: trainNumber,
        source: source,
        destination: destination,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        travel_date: travelDate,
        fare: fare
    };
    
    localStorage.setItem('selectedTrain', JSON.stringify(trainData));
    window.location.href = 'booking.html';
}

function initBookingPage() {
    const trainData = JSON.parse(localStorage.getItem('selectedTrain'));
    
    if (!trainData) {
        alert('No train selected. Redirecting to search page.');
        window.location.href = 'index.html';
        return;
    }
    
    displaySelectedTrain(trainData);
    
    const seatsInput = document.getElementById('seats_booked');
    seatsInput.addEventListener('input', function() {
        checkAvailability(trainData.id, trainData.travel_date);
    });
    
    checkAvailability(trainData.id, trainData.travel_date);
    
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        bookTicket(trainData);
    });
}

function displaySelectedTrain(trainData) {
    const selectedTrainDiv = document.getElementById('selectedTrain');
    selectedTrainDiv.innerHTML = `
        <div class="train-card selected">
            <div class="train-header">
                <h3>${trainData.name}</h3>
                <span class="train-number">${trainData.number}</span>
            </div>
            <div class="train-route">
                <div class="route-point">
                    <span class="station">${trainData.source}</span>
                    <span class="time">${formatTime(trainData.departure_time)}</span>
                </div>
                <div class="route-arrow">→</div>
                <div class="route-point">
                    <span class="station">${trainData.destination}</span>
                    <span class="time">${formatTime(trainData.arrival_time)}</span>
                </div>
            </div>
            <p><strong>Travel Date:</strong> ${formatDate(trainData.travel_date)}</p>
            <p><strong>Fare per seat:</strong> ₹${trainData.fare}</p>
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function checkAvailability(trainId, travelDate) {
    try {
        const response = await fetch(`${API_BASE_URL}/check-availability?train_id=${trainId}&travel_date=${travelDate}`);
        const data = await response.json();
        
        if (data.error) {
            document.getElementById('availability').innerHTML = `<p class="error">${data.error}</p>`;
            return;
        }
        
        const availabilityDiv = document.getElementById('availability');
        availabilityDiv.innerHTML = `
            <div class="availability-details">
                <p><strong>Total Seats:</strong> ${data.total_seats}</p>
                <p><strong>Booked Seats:</strong> ${data.booked_seats}</p>
                <p class="available-seats"><strong>Available Seats:</strong> ${data.available_seats}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error checking availability:', error);
    }
}

async function bookTicket(trainData) {
    const passengerName = document.getElementById('passenger_name').value.trim();
    const passengerEmail = document.getElementById('passenger_email').value.trim();
    const seatsBooked = parseInt(document.getElementById('seats_booked').value);
    
    if (!currentUser) {
        alert('Please login first');
        window.location.href = 'login.html';
        return;
    }
    
    const bookingData = {
        user_id: currentUser.id,
        train_id: trainData.id,
        passenger_name: passengerName,
        passenger_email: passengerEmail,
        travel_date: trainData.travel_date,
        seats_booked: seatsBooked
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/book-ticket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            const confirmationData = {
                pnr: result.pnr,
                train: trainData,
                passenger_name: passengerName,
                passenger_email: passengerEmail,
                seats_booked: seatsBooked,
                total_fare: result.total_fare
            };
            
            localStorage.setItem('bookingConfirmation', JSON.stringify(confirmationData));
            localStorage.removeItem('selectedTrain');
            window.location.href = 'confirm.html';
        } else {
            alert('Booking failed: ' + result.error);
        }
    } catch (error) {
        alert('Error booking ticket: ' + error.message);
    }
}

function initConfirmPage() {
    const confirmationData = JSON.parse(localStorage.getItem('bookingConfirmation'));
    
    if (!confirmationData) {
        alert('No booking confirmation found. Redirecting to search page.');
        window.location.href = 'index.html';
        return;
    }
    
    displayConfirmation(confirmationData);
}

function displayConfirmation(data) {
    const confirmationInfoDiv = document.getElementById('confirmationInfo');
    confirmationInfoDiv.innerHTML = `
        <div class="confirmation-card">
            <div class="pnr-section">
                <h4>PNR Number</h4>
                <p class="pnr-number">${data.pnr}</p>
            </div>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="label">Passenger Name:</span>
                    <span class="value">${data.passenger_name}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Email:</span>
                    <span class="value">${data.passenger_email}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Train:</span>
                    <span class="value">${data.train.name} (${data.train.number})</span>
                </div>
                <div class="detail-item">
                    <span class="label">From:</span>
                    <span class="value">${data.train.source}</span>
                </div>
                <div class="detail-item">
                    <span class="label">To:</span>
                    <span class="value">${data.train.destination}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Departure:</span>
                    <span class="value">${formatTime(data.train.departure_time)}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Arrival:</span>
                    <span class="value">${formatTime(data.train.arrival_time)}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Travel Date:</span>
                    <span class="value">${formatDate(data.train.travel_date)}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Seats Booked:</span>
                    <span class="value">${data.seats_booked}</span>
                </div>
                <div class="detail-item total-fare">
                    <span class="label">Total Fare:</span>
                    <span class="value">₹${data.total_fare}</span>
                </div>
            </div>
        </div>
    `;
}

async function initBookingsPage() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    const loadingDiv = document.getElementById('loadingMessage');
    const bookingsListDiv = document.getElementById('bookingsList');
    
    try {
        loadingDiv.style.display = 'block';
        
        const response = await fetch(`${API_BASE_URL}/user-bookings/${currentUser.id}`);
        const bookings = await response.json();
        
        loadingDiv.style.display = 'none';
        
        if (bookings.length === 0) {
            bookingsListDiv.innerHTML = '<div class="no-bookings">No bookings found. <a href="Index.html">Search for trains</a></div>';
            return;
        }
        
        bookingsListDiv.innerHTML = bookings.map(booking => `
            <div class="booking-card">
                <div class="booking-header">
                    <h3>${booking.train_name} (${booking.train_number})</h3>
                    <span class="booking-status ${booking.booking_status.toLowerCase()}">${booking.booking_status}</span>
                </div>
                <div class="booking-details">
                    <div class="detail-row">
                        <div class="detail-item">
                            <label>PNR:</label>
                            <strong>${booking.pnr}</strong>
                        </div>
                        <div class="detail-item">
                            <label>Booking Date:</label>
                            <span>${new Date(booking.booking_date).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-item">
                            <label>Route:</label>
                            <span>${booking.source} → ${booking.destination}</span>
                        </div>
                        <div class="detail-item">
                            <label>Travel Date:</label>
                            <span>${new Date(booking.travel_date).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-item">
                            <label>Timing:</label>
                            <span>${formatTime(booking.departure_time)} - ${formatTime(booking.arrival_time)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Seats:</label>
                            <span>${booking.seats_booked}</span>
                        </div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-item">
                            <label>Passenger:</label>
                            <span>${booking.passenger_name}</span>
                        </div>
                        <div class="detail-item">
                            <label>Total Fare:</label>
                            <strong>₹${booking.total_fare}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error fetching bookings:', error);
        loadingDiv.innerHTML = '<div class="error">Error loading bookings. Please try again.</div>';
    }
}
