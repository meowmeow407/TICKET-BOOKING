const API_URL = 'http://localhost:5000';

// 1. Submit a Booking
async function bookTicket() {
    const name = document.getElementById('userName').value;
    const event = document.getElementById('event').value;
    const seatNumber = document.getElementById('seat').value;
    const statusDiv = document.getElementById('status');

    if(!name || !seatNumber) {
        statusDiv.style.color = "red";
        statusDiv.innerText = "Please fill all fields!";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, event, seatNumber })
        });

        if (response.ok) {
            statusDiv.style.color = "green";
            statusDiv.innerText = "✅ Success! Reserved.";
            // Clear inputs
            document.getElementById('userName').value = "";
            document.getElementById('seat').value = "";
            // Auto-refresh the table
            fetchReservations();
        }
    } catch (err) {
        statusDiv.innerText = "Error connecting to server.";
    }
}

// 2. Fetch all Bookings for the table
async function fetchReservations() {
    const list = document.getElementById('ticketList');
    
    try {
        const response = await fetch(`${API_URL}/tickets`);
        const tickets = await response.json();

        list.innerHTML = ""; // Clear current rows

        tickets.forEach(t => {
            const row = `
                <tr>
                    <td>${t.name}</td>
                    <td>${t.event}</td>
                    <td>${t.seatNumber}</td>
                </tr>
            `;
            list.innerHTML += row;
        });
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

// Load data immediately when page opens
window.onload = fetchReservations;