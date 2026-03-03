/**
 * ServiceHub - Rating Module
 * Handles Rating Submission and Calculation
 */

const Rating = {
    // Initialize Rating
    init() {
        this.bindEvents();
    },

    // Submit Rating
    submitRating(bookingId, rating, comment) {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const booking = bookings.find(b => b.id === bookingId);

        if (!booking) {
            App.showToast('Booking not found', 'error');
            return;
        }

        const newRating = {
            id: App.generateId(),
            bookingId,
            providerId: booking.providerId,
            customerId: booking.customerId,
            rating: parseInt(rating),
            comment,
            createdAt: new Date().toISOString()
        };

        const ratings = JSON.parse(localStorage.getItem('ratings')) || [];
        ratings.push(newRating);
        localStorage.setItem('ratings', JSON.stringify(ratings));

        // Update Provider Average Rating
        this.updateProviderRating(booking.providerId);

        App.showToast('Thank you for your feedback!', 'success');
        this.closeModal();
    },

    // Update Provider Average Rating
    updateProviderRating(providerId) {
        const ratings = JSON.parse(localStorage.getItem('ratings')) || [];
        const providerRatings = ratings.filter(r => r.providerId === providerId);

        if (providerRatings.length === 0) return;

        const totalRating = providerRatings.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = (totalRating / providerRatings.length).toFixed(1);

        // Update in Services (assuming provider rating is stored with service for simplicity)
        const services = JSON.parse(localStorage.getItem('services')) || [];
        services.forEach(service => {
            if (service.providerId === providerId) {
                service.rating = parseFloat(averageRating);
                service.reviews = providerRatings.length;
            }
        });
        localStorage.setItem('services', JSON.stringify(services));
    },

    // Bind Events
    bindEvents() {
        const ratingForm = document.getElementById('ratingForm');
        if (ratingForm) {
            ratingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const bookingId = document.getElementById('ratingBookingId').value;
                const rating = document.querySelector('input[name="rating"]:checked').value;
                const comment = document.getElementById('ratingComment').value;
                
                this.submitRating(bookingId, rating, comment);
            });
        }
    },

    // Open Rating Modal
    openRateModal(bookingId) {
        const modal = document.getElementById('ratingModal');
        const bookingIdInput = document.getElementById('ratingBookingId');
        if (modal && bookingIdInput) {
            bookingIdInput.value = bookingId;
            modal.classList.add('active');
        }
    },

    // Close Modal
    closeModal() {
        const modal = document.getElementById('ratingModal');
        if (modal) {
            modal.classList.remove('active');
            document.getElementById('ratingForm').reset();
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    Rating.init();
});
