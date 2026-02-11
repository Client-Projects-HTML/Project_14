/**
 * Pipeline Inspection Services - Main JavaScript
 * ===============================================
 * Core functionality for the template
 * 
 * @version 1.0.0
 * @author Stackly
 */

(function () {
    'use strict';

    // ============================================
    // Configuration
    // ============================================
    const CONFIG = {
        theme: {
            storageKey: 'theme',
            defaultTheme: 'light',
            darkClass: 'dark'
        },
        animations: {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        },
        debounce: {
            delay: 150
        }
    };

    // ============================================
    // Utility Functions
    // ============================================
    const Utils = {
        /**
         * Debounce function execution
         * @param {Function} func - Function to debounce
         * @param {number} wait - Delay in milliseconds
         * @returns {Function}
         */
        debounce(func, wait = CONFIG.debounce.delay) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Throttle function execution
         * @param {Function} func - Function to throttle
         * @param {number} limit - Time limit in milliseconds
         * @returns {Function}
         */
        throttle(func, limit = 100) {
            let inThrottle;
            return function (...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        /**
         * Check if element is in viewport
         * @param {Element} element - Element to check
         * @returns {boolean}
         */
        isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        /**
         * Get URL parameter
         * @param {string} name - Parameter name
         * @returns {string|null}
         */
        getUrlParam(name) {
            const params = new URLSearchParams(window.location.search);
            return params.get(name);
        },

        /**
         * Set cookie
         * @param {string} name - Cookie name
         * @param {string} value - Cookie value
         * @param {number} days - Expiration days
         */
        setCookie(name, value, days = 365) {
            const expires = new Date(Date.now() + days * 864e5).toUTCString();
            document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
        },

        /**
         * Get cookie
         * @param {string} name - Cookie name
         * @returns {string|null}
         */
        getCookie(name) {
            return document.cookie.split('; ').reduce((r, v) => {
                const parts = v.split('=');
                return parts[0] === name ? decodeURIComponent(parts[1]) : r;
            }, null);
        }
    };

    // ============================================
    // Theme Manager
    // ============================================
    const ThemeManager = {
        currentTheme: CONFIG.theme.defaultTheme,

        init() {
            this.loadTheme();
            this.bindEvents();
            this.applyTheme(this.currentTheme);
        },

        loadTheme() {
            // Check localStorage first
            const savedTheme = localStorage.getItem(CONFIG.theme.storageKey);

            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            // Determine theme
            if (savedTheme) {
                this.currentTheme = savedTheme;
            } else if (prefersDark) {
                this.currentTheme = 'dark';
            }
        },

        applyTheme(theme) {
            this.currentTheme = theme;
            document.documentElement.setAttribute('data-theme', theme);

            // Update all theme toggle buttons if present
            const themeToggles = document.querySelectorAll('.theme-toggle');
            if (themeToggles.length) {
                const isDark = theme === 'dark';
                themeToggles.forEach(btn => {
                    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
                    btn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
                });
            }

            // Show/hide sun and moon icons if present
            const sun = document.querySelectorAll('.sun-icon');
            const moon = document.querySelectorAll('.moon-icon');
            if (sun.length || moon.length) {
                const showSun = theme !== 'dark';
                sun.forEach(s => s.style.display = showSun ? 'inline-block' : 'none');
                moon.forEach(m => m.style.display = showSun ? 'none' : 'inline-block');
            }

            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
        },

        toggle() {
            const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            this.applyTheme(newTheme);
            localStorage.setItem(CONFIG.theme.storageKey, newTheme);
        },

        bindEvents() {
            // Theme toggle buttons (attach to all)
            const themeToggles = document.querySelectorAll('.theme-toggle');
            if (themeToggles.length) {
                themeToggles.forEach(btn => btn.addEventListener('click', () => this.toggle()));
            }

            // Restore RTL preference
            const savedDir = localStorage.getItem('dir');
            if (savedDir) {
                document.documentElement.setAttribute('dir', savedDir);
            }

            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(CONFIG.theme.storageKey)) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    };

    // ============================================
    // Navigation Manager
    // ============================================
    const NavigationManager = {
        header: null,
        mobileNav: null,
        menuToggle: null,

        init() {
            this.header = document.querySelector('.header');
            this.mobileNav = document.querySelector('.mobile-nav');
            this.menuToggle = document.querySelector('.menu-toggle');

            this.bindEvents();
            this.handleScroll();
        },

        bindEvents() {
            // Mobile menu toggle
            if (this.menuToggle && this.mobileNav) {
                this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
            }

            // Close mobile menu on link click
            const mobileLinks = document.querySelectorAll('.mobile-nav-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });

            // Close mobile menu on outside click
            document.addEventListener('click', (e) => {
                if (this.mobileNav?.classList.contains('active') &&
                    !this.mobileNav.contains(e.target) &&
                    !this.menuToggle?.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Handle scroll
            window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 100));

            // Active nav link highlighting
            this.highlightActiveLink();
        },

        toggleMobileMenu() {
            this.menuToggle?.classList.toggle('active');
            this.mobileNav?.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        },

        closeMobileMenu() {
            this.menuToggle?.classList.remove('active');
            this.mobileNav?.classList.remove('active');
            document.body.classList.remove('menu-open');
        },

        handleScroll() {
            if (this.header) {
                if (window.scrollY > 50) {
                    this.header.classList.add('scrolled');
                } else {
                    this.header.classList.remove('scrolled');
                }
            }
        },

        highlightActiveLink() {
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    const linkPath = new URL(href, window.location.origin).pathname;
                    if (currentPath === linkPath || currentPath.endsWith(linkPath)) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                }
            });
        }
    };

    // ============================================
    // Scroll Animation Manager
    // ============================================
    const ScrollAnimationManager = {
        observer: null,
        elements: [],

        init() {
            if (!('IntersectionObserver' in window)) {
                // Fallback for browsers without IntersectionObserver
                this.elements = document.querySelectorAll('.reveal');
                this.elements.forEach(el => el.classList.add('active'));
                return;
            }

            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    threshold: CONFIG.animations.threshold,
                    rootMargin: CONFIG.animations.rootMargin
                }
            );

            this.elements = document.querySelectorAll('.reveal');
            this.elements.forEach(el => this.observer.observe(el));
        },

        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Optionally unobserve after animation
                    // this.observer.unobserve(entry.target);
                }
            });
        }
    };

    // ============================================
    // Form Validation Manager
    // ============================================
    const FormValidationManager = {
        forms: [],

        init() {
            this.forms = document.querySelectorAll('form[data-validate]');
            this.forms.forEach(form => this.bindForm(form));
        },

        bindForm(form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e, form));

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
        },

        handleSubmit(e, form) {
            e.preventDefault();

            if (this.validateForm(form)) {
                // Form is valid - submit
                const submitEvent = new CustomEvent('form:valid', { detail: { form } });
                form.dispatchEvent(submitEvent);

                // Show success message
                this.showSuccess(form);
            }
        },

        validateForm(form) {
            const inputs = form.querySelectorAll('input, textarea, select');
            let isValid = true;

            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            return isValid;
        },

        validateField(field) {
            const value = field.value.trim();
            const type = field.type;
            const required = field.required;
            let isValid = true;
            let errorMessage = '';

            // Clear previous error
            this.clearError(field);

            // Required validation
            if (required && !value) {
                isValid = false;
                errorMessage = `${this.getFieldLabel(field)} is required`;
            }

            // Email validation
            if (isValid && value && type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            }

            // Phone validation
            if (isValid && value && type === 'tel') {
                const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
            }

            // Min length validation
            if (isValid && value && field.minLength && value.length < field.minLength) {
                isValid = false;
                errorMessage = `Minimum ${field.minLength} characters required`;
            }

            // Pattern validation
            if (isValid && value && field.pattern) {
                const pattern = new RegExp(field.pattern);
                if (!pattern.test(value)) {
                    isValid = false;
                    errorMessage = field.dataset.errorMessage || 'Invalid format';
                }
            }

            if (!isValid) {
                this.showError(field, errorMessage);
            }

            return isValid;
        },

        showError(field, message) {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');

            // Find or create error element
            let errorEl = field.parentElement.querySelector('.form-error');
            if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.className = 'form-error';
                errorEl.setAttribute('role', 'alert');
                field.parentElement.appendChild(errorEl);
            }
            errorEl.textContent = message;
        },

        clearError(field) {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');

            const errorEl = field.parentElement.querySelector('.form-error');
            if (errorEl) {
                errorEl.remove();
            }
        },

        showSuccess(form) {
            const successEl = document.createElement('div');
            successEl.className = 'alert alert-success';
            successEl.textContent = form.dataset.successMessage || 'Form submitted successfully!';

            form.insertBefore(successEl, form.firstChild);

            setTimeout(() => {
                successEl.remove();
            }, 5000);

            form.reset();
        },

        getFieldLabel(field) {
            const label = field.parentElement.querySelector('.form-label');
            return label ? label.textContent.replace('*', '').trim() : 'This field';
        }
    };

    // ============================================
    // Smooth Scroll Manager
    // ============================================
    const SmoothScrollManager = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => this.handleClick(e, anchor));
            });
        },

        handleClick(e, anchor) {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        }
    };

    // ============================================
    // Loading State Manager
    // ============================================
    const LoadingStateManager = {
        init() {
            // Show skeleton loaders initially
            this.showSkeletons();

            // Hide on page load
            window.addEventListener('load', () => this.hideSkeletons());
        },

        showSkeletons() {
            document.querySelectorAll('[data-skeleton]').forEach(el => {
                el.classList.add('skeleton');
            });
        },

        hideSkeletons() {
            document.querySelectorAll('.skeleton').forEach(el => {
                el.classList.remove('skeleton');
            });
        },

        setButtonLoading(button, loading = true) {
            if (loading) {
                button.disabled = true;
                button.dataset.originalText = button.textContent;
                button.innerHTML = '<span class="animate-spin">⟳</span> Loading...';
            } else {
                button.disabled = false;
                button.textContent = button.dataset.originalText || button.textContent;
            }
        }
    };

    // ============================================
    // Counter Animation
    // ============================================
    const CounterAnimation = {
        init() {
            const counters = document.querySelectorAll('[data-counter]');

            if (!('IntersectionObserver' in window)) {
                counters.forEach(counter => this.animateCounter(counter));
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(counter => observer.observe(counter));
        },

        animateCounter(counter) {
            const target = parseInt(counter.dataset.counter, 10);
            const duration = parseInt(counter.dataset.duration, 10) || 2000;
            const suffix = counter.dataset.suffix || '';
            const prefix = counter.dataset.prefix || '';

            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (ease-out)
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeOut * target);

                counter.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
                }
            };

            requestAnimationFrame(updateCounter);
        }
    };

    // ============================================
    // Accessibility Manager
    // ============================================
    const AccessibilityManager = {
        init() {
            this.handleFocusVisible();
            this.skipLinks();
        },

        handleFocusVisible() {
            // Add focus-visible class for keyboard navigation
            document.body.addEventListener('mousedown', () => {
                document.body.classList.add('using-mouse');
            });

            document.body.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.remove('using-mouse');
                }
            });
        },

        skipLinks() {
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(skipLink.getAttribute('href'));
                    if (target) {
                        target.setAttribute('tabindex', '-1');
                        target.focus();
                    }
                });
            }
        }
    };

    /**
     * Role-Based Navigation Manager
     */
    const RoleNavigationManager = {
        init() {
            const role = localStorage.getItem('userRole');
            if (!role) return;

            this.updateLinks(role);
            this.toggleSections(role);
            this.updateHeader(role);
        },

        updateLinks(role) {
            const dashboardLinks = document.querySelectorAll('a[href*="dashboard.html"]');
            dashboardLinks.forEach(link => {
                if (role === 'admin') {
                    link.href = 'admin-dashboard.html';
                } else if (role === 'client') {
                    link.href = 'client-dashboard.html';
                }
            });

            // Update logo links to go to main website (index.html)
            const logoLinks = document.querySelectorAll('.logo');
            logoLinks.forEach(link => {
                link.href = 'index.html';
            });

            // Update generic dashboard links that might not have the full filename
            const allLinks = document.querySelectorAll('.sidebar-link, .nav-item');
            allLinks.forEach(link => {
                const text = link.textContent.trim().toLowerCase();
                if (text === 'dashboard') {
                    link.href = role === 'admin' ? 'admin-dashboard.html' : 'client-dashboard.html';
                }
            });
        },

        toggleSections(role) {
            // New approach: Use data-role attribute for precise control
            const roleElements = document.querySelectorAll('[data-role]');
            roleElements.forEach(el => {
                const targetRole = el.getAttribute('data-role');
                if (targetRole === 'admin' && role !== 'admin') {
                    el.style.display = 'none';
                } else if (targetRole === 'client' && role !== 'client') {
                    el.style.display = 'none';
                } else {
                    el.style.display = '';
                }
            });

            // Fallback for existing structure
            const sidebarSections = document.querySelectorAll('.sidebar-section');
            sidebarSections.forEach(section => {
                if (section.hasAttribute('data-role')) return; // Skip if already handled

                const title = section.querySelector('.sidebar-section-title');
                if (!title) return;

                const sectionTitle = title.textContent.trim().toLowerCase();

                // Admin only sections
                if (sectionTitle === 'management' || sectionTitle === 'admin') {
                    if (role !== 'admin') {
                        section.style.display = 'none';
                    }
                }
            });

            // Individual links visibility (legacy support)
            const allLinks = document.querySelectorAll('.sidebar-link, .nav-item');
            allLinks.forEach(link => {
                if (link.hasAttribute('data-role')) return; // Skip if already handled

                const text = link.textContent.trim().toLowerCase();

                // Admin only items
                const adminOnly = ['users', 'all users', 'admin users'];
                if (adminOnly.includes(text)) {
                    if (role !== 'admin') {
                        link.style.display = 'none';
                    }
                }

                // Client only items
                const clientOnly = ['my orders', 'my inspections'];
                if (clientOnly.includes(text)) {
                    if (role !== 'client') {
                        link.style.display = 'none';
                    }
                }
            });
        },

        updateHeader(role) {
            const userMenus = document.querySelectorAll('.user-menu, .user-menu-dropdown');
            if (userMenus.length === 0) return;

            const userName = role === 'admin' ? "John Smith" : "Sarah Jenkins";
            const userEmail = role === 'admin' ? "john.smith@company.com" : "sarah.j@chevron.com";
            const avatarUrl = role === 'admin'
                ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face";
            const initials = role === 'admin' ? 'JS' : 'SJ';

            userMenus.forEach(userMenu => {
                // Update Name and Role based on structure
                const pElements = userMenu.querySelectorAll('p');
                if (pElements.length >= 2) {
                    pElements[0].textContent = userName;
                    pElements[1].textContent = role.charAt(0).toUpperCase() + role.slice(1);
                } else if (pElements.length === 1) {
                    // Try to find if it's name or role
                    const text = pElements[0].textContent.toLowerCase();
                    if (text.includes('admin') || text.includes('client')) {
                        pElements[0].textContent = role.charAt(0).toUpperCase() + role.slice(1);
                    } else {
                        pElements[0].textContent = userName;
                    }
                }

                // Update Avatar (Image or Div)
                const avatarImg = userMenu.querySelector('img.user-avatar');
                if (avatarImg) {
                    avatarImg.src = avatarUrl;
                } else {
                    const avatarDiv = userMenu.querySelector('.user-avatar');
                    if (avatarDiv && avatarDiv.tagName === 'DIV') {
                        avatarDiv.textContent = initials;
                        avatarDiv.style.backgroundImage = 'none';
                    }
                }
            });

            // Update Profile Page specific elements (if present)
            const profileImg = document.getElementById('profileImage');
            if (profileImg) {
                profileImg.src = avatarUrl;
            }

            const profileName = document.getElementById('profileName');
            if (profileName) {
                profileName.textContent = userName;
            }

            const profileRole = document.getElementById('profileRole');
            if (profileRole) {
                profileRole.textContent = role.charAt(0).toUpperCase() + role.slice(1);
            }

            // Update Profile Form Fields
            const nameInput = document.querySelector('input[name="full_name"]') || document.querySelector('input[placeholder*="Name"]');
            if (nameInput) nameInput.value = userName;

            const emailInput = document.querySelector('input[name="email"]') || document.querySelector('input[type="email"]');
            if (emailInput) emailInput.value = userEmail;
        }
    };

    // ============================================
    // Initialize Application
    // ============================================
    function init() {
        // Initialize all managers
        ThemeManager.init();
        NavigationManager.init();
        ScrollAnimationManager.init();
        FormValidationManager.init();
        SmoothScrollManager.init();
        LoadingStateManager.init();
        CounterAnimation.init();
        AccessibilityManager.init();
        RoleNavigationManager.init();

        // Log initialization
        console.log('🚀 Pipeline Inspection Services - Application initialized');

        // Dispatch ready event
        window.dispatchEvent(new CustomEvent('app:ready'));
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose to global scope for debugging
    window.PipelineApp = {
        Utils,
        ThemeManager,
        NavigationManager,
        FormValidationManager
    };

    // Global Logout Handler
    window.handleLogout = function (e) {
        if (e) e.preventDefault();
        localStorage.removeItem('userRole');
        window.location.href = 'login.html';
    };

    // RTL Toggle Handler
    window.toggleRTL = function () {
        const dir = localStorage.getItem('dir') || 'ltr';
        const newDir = dir === 'ltr' ? 'rtl' : 'ltr';
        localStorage.setItem('dir', newDir);
        document.documentElement.setAttribute('dir', newDir);
        document.documentElement.setAttribute('lang', newDir === 'rtl' ? 'ar' : 'en');
    };

    // Theme Toggle Handler
    window.toggleTheme = function () {
        const theme = localStorage.getItem('theme') || 'light';
        const newTheme = theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

})();
