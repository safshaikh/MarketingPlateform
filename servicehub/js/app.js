/**
 * ServiceHub - Main Application Logic
 * Handles UI interactions, Data Management, and Routing
 */

const App = {
    // Initialize App
    init() {
        this.loadTheme();
        this.setupNavigation();
        this.loadDummyData();
        this.setupModals();
        this.setupToasts();
    },

    // Load Theme Preference
    loadTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.checked = theme === 'dark';
            themeToggle.addEventListener('change', () => {
                const newTheme = themeToggle.checked ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    },

    // Setup Navigation Active State
    setupNavigation() {
        const currentPath = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    },

    // Load Dummy Data if LocalStorage is empty
    loadDummyData() {
        if (!localStorage.getItem('services')) {
            const dummyServices = [
                {
                    id: 's1',
                    providerId: 'p1',
                    providerName: 'John Doe',
                    category: 'Cleaning',
                    name: 'Deep House Cleaning',
                    description: 'Full house deep cleaning service including kitchen and bathroom.',
                    price: 150,
                    rating: 4.8,
                    reviews: 12,
                    image: 'https://images.unsplash.com/photo-1581578731117-104f2a8d23e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 's2',
                    providerId: 'p2',
                    providerName: 'Jane Smith',
                    category: 'Plumbing',
                    name: 'Leak Fix & Pipe Repair',
                    description: 'Professional plumbing service for leaks and pipe repairs.',
                    price: 80,
                    rating: 4.5,
                    reviews: 8,
                    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 's3',
                    providerId: 'p3',
                    providerName: 'Mike Johnson',
                    category: 'Electrician',
                    name: 'Wiring & Installation',
                    description: 'Electrical wiring and appliance installation services.',
                    price: 120,
                    rating: 4.9,
                    reviews: 20,
                    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 's4',
                    providerId: 'p4',
                    providerName: 'Sarah Williams',
                    category: 'Beauty',
                    name: 'Bridal Makeup',
                    description: 'Professional bridal makeup services for your special day.',
                    price: 200,
                    rating: 4.7,
                    reviews: 15,
                    image: 'https://images.unsplash.com/photo-1487412947132-232984567461?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 's5',
                    providerId: 'p5',
                    providerName: 'David Brown',
                    category: 'Gardening',
                    name: 'Lawn Mowing & Maintenance',
                    description: 'Keep your garden looking fresh and green with our services.',
                    price: 60,
                    rating: 4.6,
                    reviews: 10,
                    image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 's6',
                    providerId: 'p6',
                    providerName: 'Emily Davis',
                    category: 'Cleaning',
                    name: 'Carpet Cleaning',
                    description: 'Deep cleaning for carpets to remove stains and odors.',
                    price: 90,
                    rating: 4.4,
                    reviews: 6,
                    image: 'https://images.unsplash.com/photo-1527512860163-49091243a4b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                }
            ];
            localStorage.setItem('services', JSON.stringify(dummyServices));
        }

        if (!localStorage.getItem('users')) {
            const dummyUsers = [
                {
                    id: 'p1',
                    name: 'John Doe',
                    email: 'john@provider.com',
                    password: 'password123',
                    role: 'provider',
                    joinedDate: new Date().toISOString()
                },
                {
                    id: 'c1',
                    name: 'Alice Customer',
                    email: 'alice@customer.com',
                    password: 'password123',
                    role: 'customer',
                    joinedDate: new Date().toISOString()
                }
            ];
            localStorage.setItem('users', JSON.stringify(dummyUsers));
        }
    },

    // Setup Modal Logic
    setupModals() {
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.close-modal');

        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                modal.classList.remove('active');
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    },

    // Show Toast Notification
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Helper: Generate ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Helper: Format Currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    },

    // Helper: Format Date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
