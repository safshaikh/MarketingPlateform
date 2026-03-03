/**
 * ServiceHub - Booking Module
 * Handles Booking Creation, Management, and Status Updates
 */

const Booking = {
    // Initialize Booking
    init() {
        this.bindEvents();
        this.loadBookings();
    },

    // Create New Booking
    createBooking(serviceId, date, time, address) {
        const user = Auth.getCurrentUser();
        if (!user) {
            App.showToast('Please login to book a service', 'error');
            return;
        }

        const service = this.getServiceById(serviceId);
        if (!service) {
            App.showToast('Service not found', 'error');
            return;
        }

        const booking = {
            id: App.generateId(),
            customerId: user.id,
            providerId: service.providerId,
            serviceId: service.id,
            serviceName: service.name,
            providerName: service.providerName,
            customerName: user.name,
            date,
            time,
            address,
            status: 'pending', // pending, accepted, rejected, completed, cancelled
            price: service.price,
            createdAt: new Date().toISOString(),
            paymentStatus: 'paid', // Simulated payment
            paymentMethod: document.querySelector('.payment-option.selected')?.dataset.method || 'card'
        };

        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Show Success Step
        this.showStep('step-success');
        
        // Generate Invoice Details
        document.getElementById('invoiceId').innerText = `#INV-${booking.id.toUpperCase()}`;
        document.getElementById('invoiceDate').innerText = new Date().toLocaleDateString();
        document.getElementById('invoiceAmount').innerText = App.formatCurrency(booking.price);
        
        // Refresh bookings list in background
        this.loadBookings(); 
    },

    // Get Service Details
    getServiceById(id) {
        const services = JSON.parse(localStorage.getItem('services')) || [];
        return services.find(s => s.id === id);
    },

    // Load Bookings for Current User
    loadBookings() {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const userBookings = bookings.filter(b => 
            user.role === 'customer' ? b.customerId === user.id : b.providerId === user.id
        );

        const container = document.getElementById('bookingsList');
        if (!container) return;

        container.innerHTML = '';

        if (userBookings.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No bookings found.</p>';
            return;
        }

        userBookings.forEach(booking => {
            const card = document.createElement('div');
            card.className = `booking-card ${booking.status}`;
            card.innerHTML = `
                <div class="booking-header">
                    <h4>${booking.serviceName}</h4>
                    <span class="status-badge ${booking.status}">${booking.status}</span>
                </div>
                <div class="booking-details">
                    <p><strong>Date:</strong> ${booking.date} at ${booking.time}</p>
                    <p><strong>Address:</strong> ${booking.address}</p>
                    <p><strong>Price:</strong> ${App.formatCurrency(booking.price)}</p>
                    ${user.role === 'provider' ? `<p><strong>Customer:</strong> ${booking.customerName}</p>` : `<p><strong>Provider:</strong> ${booking.providerName}</p>`}
                </div>
                <div class="booking-actions">
                    ${this.renderActions(booking, user.role)}
                </div>
            `;
            container.appendChild(card);
        });
    },

    // Render Action Buttons based on Role and Status
    renderActions(booking, role) {
        if (role === 'customer') {
            if (booking.status === 'pending') {
                return `<button onclick="Booking.cancelBooking('${booking.id}')" class="btn btn-danger btn-sm">Cancel</button>`;
            } else if (booking.status === 'completed') {
                return `<button onclick="Rating.openRateModal('${booking.id}')" class="btn btn-primary btn-sm">Rate Service</button>`;
            }
        } else {
            if (booking.status === 'pending') {
                return `
                    <button onclick="Booking.updateStatus('${booking.id}', 'accepted')" class="btn btn-success btn-sm">Accept</button>
                    <button onclick="Booking.updateStatus('${booking.id}', 'rejected')" class="btn btn-danger btn-sm">Reject</button>
                `;
            } else if (booking.status === 'accepted') {
                return `<button onclick="Booking.updateStatus('${booking.id}', 'completed')" class="btn btn-primary btn-sm">Mark Complete</button>`;
            }
        }
        return '';
    },

    // Update Booking Status
    updateStatus(bookingId, status) {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const index = bookings.findIndex(b => b.id === bookingId);

        if (index !== -1) {
            bookings[index].status = status;
            localStorage.setItem('bookings', JSON.stringify(bookings));
            App.showToast(`Booking ${status}`, 'success');
            this.loadBookings();
        }
    },

    // Cancel Booking
    cancelBooking(bookingId) {
        if (confirm('Are you sure you want to cancel this booking?')) {
            this.updateStatus(bookingId, 'cancelled');
        }
    },

    // Bind Events
    bindEvents() {
        // Payment Method Selection
        const paymentOptions = document.querySelectorAll('.payment-option');
        paymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                paymentOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // Step 1: Proceed to Payment
        const toPaymentBtn = document.getElementById('toPaymentBtn');
        if (toPaymentBtn) {
            toPaymentBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const form = document.getElementById('bookingForm');
                if (form.checkValidity()) {
                    this.showStep('step-payment');
                } else {
                    form.reportValidity();
                }
            });
        }

        // Step 2: Confirm Payment
        const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
        if (confirmPaymentBtn) {
            confirmPaymentBtn.addEventListener('click', () => {
                // Simulate processing
                confirmPaymentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                confirmPaymentBtn.disabled = true;

                setTimeout(() => {
                    const serviceId = document.getElementById('serviceId').value;
                    const date = document.getElementById('bookingDate').value;
                    const time = document.getElementById('bookingTime').value;
                    const address = document.getElementById('bookingAddress').value;
                    
                    this.createBooking(serviceId, date, time, address);
                    
                    confirmPaymentBtn.innerHTML = 'Pay Now';
                    confirmPaymentBtn.disabled = false;
                }, 1500);
            });
        }
        
        // Back Buttons
        const backToDetailsBtn = document.getElementById('backToDetailsBtn');
        if (backToDetailsBtn) {
            backToDetailsBtn.addEventListener('click', () => {
                this.showStep('step-details');
            });
        }
    },

    // Helper: Show specific step
    showStep(stepId) {
        document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
        document.getElementById(stepId).classList.add('active');
    },

    // Open Booking Modal
    openBookingModal(serviceId) {
        const modal = document.getElementById('bookingModal');
        const serviceIdInput = document.getElementById('serviceId');
        
        // Reset to first step
        this.showStep('step-details');
        document.getElementById('bookingForm').reset();
        
        // Set Service Info
        const service = this.getServiceById(serviceId);
        if (service) {
            document.getElementById('summaryServiceName').innerText = service.name;
            document.getElementById('summaryServicePrice').innerText = App.formatCurrency(service.price);
            document.getElementById('payAmount').innerText = App.formatCurrency(service.price);
        }

        if (modal && serviceIdInput) {
            serviceIdInput.value = serviceId;
            modal.classList.add('active');
        }
    },

    // Close Modal
    closeModal() {
        const modal = document.getElementById('bookingModal');
        if (modal) {
            modal.classList.remove('active');
            document.getElementById('bookingForm').reset();
        }
    },
    
    // Download Invoice (Simulation)
    downloadInvoice() {
        const id = document.getElementById('invoiceId').innerText;
        const amount = document.getElementById('invoiceAmount').innerText;
        const date = document.getElementById('invoiceDate').innerText;
        
        const invoiceText = `
        SERVICEHUB INVOICE
        ------------------
        Invoice ID: ${id}
        Date: ${date}
        Amount Paid: ${amount}
        Status: Paid
        ------------------
        Thank you for your business!
        `;
        
        const blob = new Blob([invoiceText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${id.replace('#', '')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    Booking.init();
});
