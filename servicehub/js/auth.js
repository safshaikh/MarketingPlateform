/**
 * ServiceHub - Authentication Module
 * Handles Login, Register, Logout and Session Management
 */

const Auth = {
    // Initialize Auth
    init() {
        this.checkAuth();
        this.bindEvents();
    },

    // Check if user is logged in and handle redirects
    checkAuth() {
        const user = this.getCurrentUser();
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const authPages = ['login.html', 'register.html'];
        const protectedPages = ['dashboard-customer.html', 'dashboard-provider.html', 'bookings.html', 'profile.html'];

        if (user) {
            // If user is logged in and tries to access login/register page, redirect them to their dashboard
            if (authPages.includes(currentPage)) {
                this.redirectToDashboard(user.role);
            }
        } else {
            // If user is not logged in and tries to access a protected page, redirect to login
            if (protectedPages.includes(currentPage)) {
                window.location.href = 'login.html';
            }
        }
    },

    // Redirect user to the correct dashboard based on their role
    redirectToDashboard(role) {
        if (role === 'customer') {
            window.location.href = 'dashboard-customer.html';
        } else {
            window.location.href = 'dashboard-provider.html';
        }
    },

    // Register User
    register(name, email, password, role) {
        if (!name || !email || !password) {
            return { success: false, message: 'Please fill in all fields' };
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const emailToRegister = email.trim().toLowerCase();

        // Check if email exists (case-insensitive)
        if (users.find(u => u.email.toLowerCase() === emailToRegister)) {
            return { success: false, message: 'Email already registered' };
        }

        const newUser = {
            id: `user_${Date.now()}`,
            name: name.trim(),
            email: emailToRegister, // Save the lowercase version
            password, // In a real app, hash this!
            role,
            joinedDate: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto login after register
        this.login(emailToRegister, password);
        
        return { success: true, message: 'Registration successful' };
    },

    // Login User
    login(email, password) {
        if (!email || !password) {
            return { success: false, message: 'Please enter both email and password' };
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userToFind = email.trim().toLowerCase();
        
        const user = users.find(u => u.email.toLowerCase() === userToFind && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.redirectToDashboard(user.role);
            return { success: true };
        }
        
        return { success: false, message: 'Invalid credentials' };
    },

    // Logout User
    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    },

    // Get Current User
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    },

    // Bind Events (for login/register pages)
    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        // Use event delegation for logout buttons
        document.body.addEventListener('click', (e) => {
            if (e.target.id === 'logoutBtn') {
                e.preventDefault();
                this.logout();
            }
        });

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                const result = this.login(email, password);
                
                if (!result.success) {
                    App.showToast(result.message, 'error');
                }
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const role = document.getElementById('role').value;
                
                const result = this.register(name, email, password, role);
                if (!result.success) {
                    App.showToast(result.message, 'error');
                }
            });
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});
