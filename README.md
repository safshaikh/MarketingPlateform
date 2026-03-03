ServiceHub - On-Demand Service Marketplace
ServiceHub is a modern, responsive web application that connects customers with local service providers (cleaners, plumbers, electricians, etc.). Built entirely with HTML5, CSS3, and Vanilla JavaScript, it features a dual-dashboard system, simulated payments, and a booking management workflow without requiring a backend server.

ServiceHub Hero Section

🚀 Features
👤 Customer Features
Browse Services: View a grid of available services with images, prices, and ratings.
Search & Filter: Find specific services by category or keyword.
Book Appointments: Select date, time, and address for service requests.
Secure Payment Simulation: Multi-step booking process with simulated Card/UPI/Wallet payments and invoice generation.
Booking Management: Track booking status (Pending, Accepted, Completed).
Rating System: Rate and review services after completion.

🛠 Provider Features
Service Management: Add new services with descriptions, prices, and images.
Booking Requests: Accept or Reject incoming booking requests from customers.
Earnings Dashboard: Track total earnings, pending bookings, and average ratings.
Profile Management: View business profile details.

🎨 UI/UX Highlights
Modern Design: Glassmorphism effects, soft gradients, and 3D hover animations.
Responsive: Fully optimized for desktop, tablet, and mobile devices.
Dark Mode: Toggle between light and dark themes.
Toast Notifications: Real-time feedback for user actions.

🛠 Tech Stack
Frontend: HTML5, CSS3 (Flexbox & Grid)
Logic: Vanilla JavaScript (ES6+)
Data Storage: localStorage (Simulates a database in the browser)
Icons: FontAwesome 6
Fonts: Google Fonts (Poppins)

📂 Folder Structure
/servicehub
│
├── index.html              # Landing Page
├── login.html              # Login Page
├── register.html           # Registration Page
├── dashboard-customer.html # Customer Dashboard (Home)
├── dashboard-provider.html # Provider Dashboard (Home)
├── bookings.html           # Booking History Page
├── profile.html            # User Profile Page
│
├── css/
│   └── style.css           # Global Styles & Themes
│
├── js/
│   ├── app.js              # Main App Logic (Theme, Data Loading)
│   ├── auth.js             # Authentication (Login/Register/Session)
│   ├── booking.js          # Booking & Payment Logic
│   └── rating.js           # Rating System Logic
│
└── README.md               # Project Documentation
⚡ How to Run
Since this project uses localStorage and no backend, it is very easy to run:

Clone or Download this repository.
Navigate to the project folder.
Double-click on index.html to open it in your web browser.
Optional (Recommended): Use the "Live Server" extension in VS Code for the best experience.
🧪 Testing the App
To test the full flow, follow these steps:

Register a Provider:
Go to Register -> Select "Service Provider".
Login and add a new service (e.g., "AC Repair").
Register a Customer:
Open an Incognito window (or logout).
Register as a "Customer".
Book a Service:
As a customer, find the service and click "Book Now".
Complete the payment simulation.
Manage Booking:
Login as the Provider again.
Go to "Bookings" and "Accept" the request.
Mark it as "Completed".
Rate Service:
Login as Customer.
You will see a "Pending Review" card on your dashboard. Rate the service!


📝 License
This project is open-source and available for educational purposes.
