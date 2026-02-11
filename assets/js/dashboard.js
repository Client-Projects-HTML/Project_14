/**
 * Pipeline Inspection Services - Dashboard JavaScript
 * ====================================================
 * Dashboard-specific functionality
 * 
 * @version 1.0.0
 * @author Stackly
 */

(function () {
    'use strict';

    // ============================================
    // Chart Configuration
    // ============================================
    const ChartConfig = {
        colors: {
            primary: getComputedStyle(document.documentElement).getPropertyValue('--color-primary-600').trim() || '#3b82f6',
            primaryLight: getComputedStyle(document.documentElement).getPropertyValue('--color-primary-100').trim() || '#93c5fd',
            secondary: getComputedStyle(document.documentElement).getPropertyValue('--color-secondary-600').trim() || '#f97316',
            success: getComputedStyle(document.documentElement).getPropertyValue('--color-success-600').trim() || '#22c55e',
            warning: getComputedStyle(document.documentElement).getPropertyValue('--color-warning-600').trim() || '#f59e0b',
            error: getComputedStyle(document.documentElement).getPropertyValue('--color-error-600').trim() || '#ef4444',
            neutral: getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim() || '#94a3b8'
        },
        fonts: {
            family: "'Inter', sans-serif"
        }
    };

    // ============================================
    // Dashboard Manager
    // ============================================
    const DashboardManager = {
        sidebar: null,
        sidebarToggle: null,
        userMenu: null,
        notificationDropdown: null,

        init() {
            this.sidebar = document.querySelector('.sidebar');
            this.sidebarToggle = document.querySelector('.sidebar-toggle');
            this.userMenu = document.querySelector('.user-menu-dropdown');
            this.notificationDropdown = document.querySelector('.notification-dropdown');

            this.bindEvents();
            this.initCharts();
            this.initDataTables();
            ViewAllInline.init();
            TableActions.init();
            FormHandlers.init();
            ToggleSwitch.init();
            TwoFactorAuth.init();
            PhotoUploader.init();
        },

        bindEvents() {
            // Delegation fallback - Handles all sidebar toggles that don't have explicit onclick
            document.addEventListener('click', (e) => {
                const toggle = e.target.closest('.sidebar-toggle');

                // If it's the main toggle with an onclick attribute, let the attribute handle it
                if (toggle && toggle.id === 'sidebarToggle' && toggle.hasAttribute('onclick')) {
                    return;
                }

                if (toggle) {
                    console.log('Sidebar toggle clicked (Delegated)');
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleSidebar();
                }
            });

            // Close sidebar on mobile when clicking outside
            document.addEventListener('click', (e) => {
                if (window.innerWidth < 1024 &&
                    this.sidebar?.classList.contains('active') &&
                    !this.sidebar.contains(e.target) &&
                    !e.target.closest('.sidebar-toggle')) {
                    this.closeSidebar();
                }
            });

            // User menu dropdown
            const userMenuBtn = document.querySelector('.user-menu-btn');
            if (userMenuBtn && this.userMenu) {
                userMenuBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleDropdown(this.userMenu);
                });
            }

            // Notification dropdown
            const notificationBtn = document.querySelector('.notification-btn');
            if (notificationBtn && this.notificationDropdown) {
                notificationBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleDropdown(this.notificationDropdown);
                    this.markNotificationsRead();
                });
            }

            // Close dropdowns on outside click
            document.addEventListener('click', (e) => {
                // Don't close dropdowns if clicking on a button or link
                if (e.target.closest('button, a, .btn, [data-action], [data-view-all]')) {
                    return;
                }
                this.closeAllDropdowns();
            });

            // RTL Toggle Delegation
            document.addEventListener('click', (e) => {
                const toggle = e.target.closest('.rtl-toggle') || e.target.closest('#rtlToggle');

                // If has onclick attribute, let it handle it
                if (toggle && toggle.hasAttribute('onclick')) {
                    return;
                }

                if (toggle) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleRTL();
                }
            });

            // Window resize
            window.addEventListener('resize', this.debounce(() => {
                if (window.innerWidth > 1024) {
                    this.sidebar?.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                }
            }, 150));
        },

        toggleSidebar() {
            if (!this.sidebar) {
                this.sidebar = document.querySelector('.sidebar');
                if (!this.sidebar) {
                    console.error('Sidebar element not found!');
                    return;
                }
            }
            console.log('Toggling sidebar via JS', this.sidebar);
            const isActive = this.sidebar.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');

            // Sync all toggle buttons
            document.querySelectorAll('.sidebar-toggle').forEach(btn => {
                btn.classList.toggle('active', isActive);
            });
        },

        closeSidebar() {
            if (!this.sidebar) this.sidebar = document.querySelector('.sidebar');
            this.sidebar?.classList.remove('active');
            document.body.classList.remove('sidebar-open');

            // Sync all toggle buttons
            document.querySelectorAll('.sidebar-toggle').forEach(btn => {
                btn.classList.remove('active');
            });
        },

        toggleRTL() {
            const html = document.documentElement;
            const currentDir = html.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            html.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);

            // Trigger custom event for other components
            window.dispatchEvent(new CustomEvent('rtlchange', { detail: { dir: newDir } }));

            console.log('RTL toggled to:', newDir);
        },

        toggleDropdown(dropdown) {
            const isOpen = dropdown.classList.contains('active');
            this.closeAllDropdowns();
            if (!isOpen) {
                dropdown.classList.add('active');
                dropdown.style.display = 'block';
            } else {
                dropdown.style.display = 'none';
            }
        },

        closeAllDropdowns() {
            this.userMenu?.classList.remove('active');
            this.notificationDropdown?.classList.remove('active');
            if (this.userMenu) {
                this.userMenu.style.display = '';
            }
            if (this.notificationDropdown) {
                this.notificationDropdown.style.display = 'none';
            }
        },

        markNotificationsRead() {
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                badge.style.display = 'none';
            }
        },

        debounce(func, wait) {
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

        // ============================================
        // Charts Initialization
        // ============================================
        initCharts() {
            this.initInspectionsChart();
            this.initIntegrityChart();
            this.initDefectsChart();
            this.initActivityChart();
        },

        initInspectionsChart() {
            const ctx = document.getElementById('inspectionsChart');
            if (!ctx) return;

            // Check if Chart.js is available
            if (typeof Chart === 'undefined') {
                console.warn('Chart.js not loaded');
                return;
            }

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Inspections Completed',
                        data: [45, 52, 48, 65, 72, 68, 75, 82, 78, 85, 90, 88],
                        borderColor: ChartConfig.colors.primary,
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Scheduled',
                        data: [50, 55, 52, 70, 75, 72, 78, 85, 82, 88, 92, 90],
                        borderColor: ChartConfig.colors.secondary,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            align: 'end',
                            labels: {
                                usePointStyle: true,
                                font: { family: ChartConfig.fonts.family }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        },

        initIntegrityChart() {
            const ctx = document.getElementById('integrityChart');
            if (!ctx || typeof Chart === 'undefined') return;

            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'],
                    datasets: [{
                        data: [35, 40, 15, 7, 3],
                        backgroundColor: [
                            ChartConfig.colors.success,
                            ChartConfig.colors.primary,
                            ChartConfig.colors.warning,
                            ChartConfig.colors.secondary,
                            ChartConfig.colors.error
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: { family: ChartConfig.fonts.family }
                            }
                        }
                    }
                }
            });
        },

        initDefectsChart() {
            const ctx = document.getElementById('defectsChart');
            if (!ctx || typeof Chart === 'undefined') return;

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Metal Loss', 'Cracks', 'Dents', 'Lamination', 'Gouges', 'Other'],
                    datasets: [{
                        label: 'Detected Defects',
                        data: [145, 32, 28, 15, 22, 18],
                        backgroundColor: ChartConfig.colors.primary,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        },

        initActivityChart() {
            const ctx = document.getElementById('activityChart');
            if (!ctx || typeof Chart === 'undefined') return;

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Activity',
                        data: [12, 19, 15, 25, 22, 30, 28],
                        borderColor: ChartConfig.colors.secondary,
                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            display: false
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        },

        // ============================================
        // Data Tables
        // ============================================
        initDataTables() {
            const tables = document.querySelectorAll('.data-table[data-sortable]');
            tables.forEach(table => this.initSortableTable(table));
        },

        initSortableTable(table) {
            const headers = table.querySelectorAll('th[data-sort]');

            headers.forEach(header => {
                header.style.cursor = 'pointer';
                header.addEventListener('click', () => this.sortTable(table, header));
            });
        },

        sortTable(table, header) {
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const columnIndex = Array.from(header.parentNode.children).indexOf(header);
            const sortType = header.dataset.sort;
            const isAscending = !header.classList.contains('sort-asc');

            // Remove sort classes from all headers
            table.querySelectorAll('th').forEach(th => {
                th.classList.remove('sort-asc', 'sort-desc');
            });

            // Add sort class to current header
            header.classList.add(isAscending ? 'sort-asc' : 'sort-desc');

            // Sort rows
            rows.sort((a, b) => {
                const aValue = a.children[columnIndex].textContent.trim();
                const bValue = b.children[columnIndex].textContent.trim();

                let comparison = 0;

                if (sortType === 'number') {
                    comparison = parseFloat(aValue) - parseFloat(bValue);
                } else if (sortType === 'date') {
                    comparison = new Date(aValue) - new Date(bValue);
                } else {
                    comparison = aValue.localeCompare(bValue);
                }

                return isAscending ? comparison : -comparison;
            });

            // Reorder rows
            rows.forEach(row => tbody.appendChild(row));
        }
    };

    // ============================================
    // Report Generator
    // ============================================
    const ReportGenerator = {
        init() {
            const generateBtn = document.querySelector('[data-generate-report]');
            if (generateBtn) {
                generateBtn.addEventListener('click', () => this.generateReport());
            }
        },

        async generateReport() {
            const btn = document.querySelector('[data-generate-report]');
            const originalText = btn.textContent;

            // Show loading state
            btn.disabled = true;
            btn.innerHTML = '<span class="animate-spin">⟳</span> Generating...';

            try {
                // Simulate API call
                await this.simulateDelay(2000);

                // Show success message
                this.showNotification('Report generated successfully!', 'success');

                // Trigger download (placeholder)
                this.downloadReport();
            } catch (error) {
                this.showNotification('Failed to generate report', 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        },

        simulateDelay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        downloadReport() {
            // Placeholder for actual report download
            console.log('Downloading report...');
        },

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `alert alert-${type} notification-toast`;
            notification.textContent = message;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };

    // ============================================
    // Real-time Updates
    // ============================================
    const RealtimeUpdates = {
        init() {
            // Simulate real-time data updates
            this.startStatsUpdates();
        },

        startStatsUpdates() {
            // Update stats every 30 seconds (simulated)
            setInterval(() => {
                this.updateRandomStat();
            }, 30000);
        },

        updateRandomStat() {
            const statValues = document.querySelectorAll('.stat-value[data-live]');
            if (statValues.length === 0) return;

            const randomStat = statValues[Math.floor(Math.random() * statValues.length)];
            const currentValue = parseInt(randomStat.textContent.replace(/[^0-9]/g, ''), 10);
            const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
            const newValue = Math.max(0, currentValue + change);

            // Animate the change
            this.animateValue(randomStat, currentValue, newValue, 500);
        },

        animateValue(element, start, end, duration) {
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(start + (end - start) * easeProgress);

                element.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };

            requestAnimationFrame(update);
        }
    };

    // ============================================
    // View All Inline Functionality
    // ============================================
    const ViewAllInline = {
        currentContainer: null,

        init() {
            console.log('ViewAllInline.init() called');
            document.querySelectorAll('[data-view-all]').forEach(btn => {
                console.log('Found view-all button:', btn);
                btn.addEventListener('click', (e) => {
                    console.log('View All clicked:', btn.dataset.viewAll);
                    e.preventDefault();
                    const type = btn.dataset.viewAll;
                    this.showInline(type, btn);
                });
            });
        },

        showInline(type, triggerBtn) {
            // Close any existing container
            this.closeInline();

            // Create inline container (using CSS class)
            const container = document.createElement('div');
            container.className = 'view-all-inline';

            let title = '';
            let items = [];

            if (type === 'activity') {
                title = 'All Recent Activity';
                items = [
                    { icon: '✓', color: 'var(--color-success-100)', textColor: 'var(--color-success-600)', title: 'Password changed successfully', desc: 'Your password was updated on Jan 20, 2024 at 10:30 AM' },
                    { icon: '👤', color: 'var(--color-primary-100)', textColor: 'var(--color-primary-600)', title: 'Profile information updated', desc: 'Your profile details were modified on Jan 18, 2024 at 2:15 PM' },
                    { icon: '⬇', color: 'var(--color-warning-100)', textColor: 'var(--color-warning-700)', title: 'Report downloaded', desc: 'You downloaded "MFL Inspection Report - Line 101" on Jan 15, 2024' },
                    { icon: '✓', color: 'var(--color-success-100)', textColor: 'var(--color-success-600)', title: 'Email notifications enabled', desc: 'You enabled email notifications on Jan 12, 2024' },
                    { icon: '👤', color: 'var(--color-primary-100)', textColor: 'var(--color-primary-600)', title: 'Profile picture updated', desc: 'Your profile picture was changed on Jan 10, 2024' },
                    { icon: '✓', color: 'var(--color-success-100)', textColor: 'var(--color-success-600)', title: 'Inspection completed', desc: 'Line 12A finished successfully on Jan 8, 2024' },
                    { icon: '⚠', color: 'var(--color-warning-100)', textColor: 'var(--color-warning-700)', title: 'System alert', desc: 'High memory usage detected on Jan 5, 2024' },
                    { icon: '✓', color: 'var(--color-success-100)', textColor: 'var(--color-success-600)', title: 'Order confirmed', desc: 'Your order #ORD-9921 was confirmed on Jan 3, 2024' }
                ];
            } else if (type === 'users') {
                title = 'All Recent Registrations';
                items = [
                    { icon: 'SJ', color: 'var(--color-primary-50)', textColor: 'var(--color-primary-700)', title: 'Sarah Jenkins', desc: 'Client - Registered Feb 06, 2026 - Pending' },
                    { icon: 'MK', color: 'var(--color-success-50)', textColor: 'var(--color-success-700)', title: 'Mike K.', desc: 'Inspector - Registered Feb 05, 2026 - Verified' },
                    { icon: 'AB', color: 'var(--color-warning-50)', textColor: 'var(--color-warning-700)', title: 'Alex B.', desc: 'Client - Registered Feb 05, 2026 - Review' },
                    { icon: 'JD', color: 'var(--color-primary-50)', textColor: 'var(--color-primary-700)', title: 'John Doe', desc: 'Admin - Registered Feb 04, 2026 - Approved' },
                    { icon: 'SM', color: 'var(--color-warning-50)', textColor: 'var(--color-warning-700)', title: 'Sarah Miller', desc: 'Client - Registered Feb 03, 2026 - Pending' },
                    { icon: 'RJ', color: 'var(--color-success-50)', textColor: 'var(--color-success-700)', title: 'Robert Johnson', desc: 'Inspector - Registered Feb 02, 2026 - Verified' }
                ];
            } else if (type === 'orders') {
                title = 'All Recent Orders';
                items = [
                    { icon: '📦', color: 'var(--color-primary-50)', textColor: 'var(--color-primary-700)', title: 'ORD-9921', desc: 'Chevron Corp. - $12,500 - Pending' },
                    { icon: '📦', color: 'var(--color-success-50)', textColor: 'var(--color-success-700)', title: 'ORD-9920', desc: 'ExxonMobil - $8,200 - Paid' },
                    { icon: '📦', color: 'var(--color-warning-50)', textColor: 'var(--color-warning-700)', title: 'ORD-9919', desc: 'Shell Oil - $15,000 - Processing' },
                    { icon: '📦', color: 'var(--color-success-50)', textColor: 'var(--color-success-700)', title: 'ORD-9918', desc: 'BP America - $9,500 - Paid' },
                    { icon: '📦', color: 'var(--color-primary-50)', textColor: 'var(--color-primary-700)', title: 'ORD-9917', desc: 'TotalEnergies - $11,000 - Pending' }
                ];
            } else if (type === 'messages') {
                title = 'All Messages';
                items = [
                    { icon: '✉', color: 'var(--color-primary-100)', textColor: 'var(--color-primary-600)', title: 'Tech Support Request', desc: 'From: Dr. Sarah Jenkins - System access issue - 15 mins ago' },
                    { icon: '✉', color: 'var(--bg-secondary)', textColor: 'var(--text-primary)', title: 'New Inquiry', desc: 'From: PetroCorp - Quote for 500km MFL - 1 hour ago' },
                    { icon: '✉', color: 'var(--color-warning-100)', textColor: 'var(--color-warning-700)', title: 'Quote Follow-up', desc: 'From: ExxonMobil - MFL Inspection quote follow-up - 2 hours ago' },
                    { icon: '✉', color: 'var(--color-success-100)', textColor: 'var(--color-success-600)', title: 'Report Ready', desc: 'From: Chevron Corp. - Inspection report ready - 3 hours ago' },
                    { icon: '✉', color: 'var(--color-primary-100)', textColor: 'var(--color-primary-600)', title: 'Schedule Change', desc: 'From: Shell Oil - Inspection rescheduled - 5 hours ago' }
                ];
            }

            let itemsHtml = items.map(item => `
                <div class="activity-item">
                    <div class="activity-icon" style="background-color: ${item.color}; color: ${item.textColor};">
                        ${item.icon.startsWith('<') ? item.icon : `<span style="font-weight: bold; font-size: 12px;">${item.icon}</span>`}
                    </div>
                    <div class="activity-content">
                        <h4>${item.title}</h4>
                        <p>${item.desc}</p>
                    </div>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="view-all-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
                    <h3 style="font-size: var(--text-base); font-weight: var(--font-semibold);">${title}</h3>
                    <button class="inline-close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="activity-list" style="display: flex; flex-direction: column;">
                    ${itemsHtml}
                </div>
            `;

            // Find parent section and insert INSIDE it (within the same card)
            let parentSection = triggerBtn.closest('.section-card');
            if (parentSection) {
                // Find the table container or first child and insert after it
                const tableContainer = parentSection.querySelector('.table-container');
                const existingInline = parentSection.querySelector('.view-all-inline');

                // Remove any existing inline container first
                if (existingInline) {
                    existingInline.remove();
                }

                // Insert the new container inside the card, after the table
                if (tableContainer) {
                    tableContainer.after(container);
                } else {
                    parentSection.appendChild(container);
                }
            } else {
                const dashboardContent = document.querySelector('.dashboard-content > div');
                if (dashboardContent) {
                    dashboardContent.appendChild(container);
                }
            }

            this.currentContainer = container;

            // Add close event
            container.querySelector('.inline-close').addEventListener('click', () => this.closeInline());

            // Scroll to container
            container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        },

        closeInline() {
            if (this.currentContainer) {
                this.currentContainer.remove();
                this.currentContainer = null;
            }
        }
    };

    // ============================================
    // Reports Toggle Functions
    // ============================================
    function toggleDetailedReports(event) {
        event.preventDefault();
        const additionalSection = document.getElementById('additionalDetailedReports');
        const link = event.target;

        if (additionalSection.style.display === 'none') {
            additionalSection.style.display = 'block';
            link.textContent = 'Show Less';
        } else {
            additionalSection.style.display = 'none';
            link.textContent = 'View All';
        }
    }

    function toggleSummaryReports(event) {
        event.preventDefault();
        const additionalSection = document.getElementById('additionalSummaryReports');
        const link = event.target;

        if (additionalSection.style.display === 'none') {
            additionalSection.style.display = 'block';
            link.textContent = 'Show Less';
        } else {
            additionalSection.style.display = 'none';
            link.textContent = 'View All';
        }
    }

    // ============================================
    // Form Handlers
    // ============================================
    const FormHandlers = {
        init() {
            // Profile form
            const profileForm = document.querySelector('.section-card form');
            if (profileForm) {
                profileForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.saveProfile();
                });
            }

            // Password form
            const passwordForm = profileForm?.nextElementSibling;
            if (passwordForm && passwordForm.tagName === 'FORM') {
                passwordForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.updatePassword();
                });
            }
        },

        saveProfile() {
            const saveBtn = document.querySelector('.section-card form .btn-primary');
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.innerHTML = '<span class="animate-spin">⟳</span> Saving...';

                setTimeout(() => {
                    saveBtn.disabled = false;
                    saveBtn.textContent = 'Save Changes';
                    this.showNotification('Profile updated successfully!', 'success');
                }, 1000);
            }
        },

        updatePassword() {
            const updateBtn = document.querySelector('.section-card:nth-child(2) form .btn-primary');
            if (updateBtn) {
                updateBtn.disabled = true;
                updateBtn.innerHTML = '<span class="animate-spin">⟳</span> Updating...';

                setTimeout(() => {
                    updateBtn.disabled = false;
                    updateBtn.textContent = 'Update Password';
                    this.showNotification('Password updated successfully!', 'success');
                }, 1000);
            }
        },

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `alert alert-${type} notification-toast`;
            notification.textContent = message;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };

    // ============================================
    // Modal Manager
    // ============================================
    const ModalManager = {
        overlay: null,

        init() {
            if (!document.querySelector('.modal-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'modal-overlay';
                overlay.innerHTML = `
                    <div class="modal-container">
                        <div class="modal-header">
                            <h3 class="modal-title" id="modalTitle">Details</h3>
                            <button class="modal-close" id="modalClose">&times;</button>
                        </div>
                        <div class="modal-body" id="modalBody">
                            <!-- Content injected here -->
                        </div>
                        <div class="modal-footer" id="modalFooter">
                            <button class="btn btn-secondary" id="modalCancel">Close</button>
                            <button class="btn btn-primary" id="modalSubmit">Save Changes</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(overlay);
                this.overlay = overlay;

                // Event Listeners
                document.getElementById('modalClose').addEventListener('click', () => this.close());
                document.getElementById('modalCancel').addEventListener('click', () => this.close());
                this.overlay.addEventListener('click', (e) => {
                    if (e.target === this.overlay) this.close();
                });
            } else {
                this.overlay = document.querySelector('.modal-overlay');
            }
        },

        show(options) {
            const { title, body, footer, onConfirm, confirmType } = options;
            this.init();

            document.getElementById('modalTitle').textContent = title || 'Details';
            document.getElementById('modalBody').innerHTML = body || '';

            const submitBtn = document.getElementById('modalSubmit');
            if (onConfirm) {
                submitBtn.style.display = 'block';
                submitBtn.textContent = options.confirmText || 'Save Changes';

                // Reset and set intent classes
                submitBtn.className = 'btn';
                if (confirmType === 'destructive') {
                    submitBtn.classList.add('btn-destructive');
                } else {
                    submitBtn.classList.add('btn-primary');
                }

                // Clone button to clear old event listeners
                const newSubmitBtn = submitBtn.cloneNode(true);
                submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
                newSubmitBtn.addEventListener('click', () => {
                    onConfirm();
                    this.close();
                });
            } else {
                submitBtn.style.display = 'none';
            }


            this.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        },

        close() {
            if (this.overlay) {
                this.overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    };

    // ============================================
    // Table Action Buttons
    // ============================================
    const TableActions = {
        init() {
            ModalManager.init();
            // Use event delegation for actions to handle dynamically added rows
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-action]');
                if (!btn) return;

                const action = btn.dataset.action;

                if (action === 'approve') {
                    e.preventDefault();
                    this.approveItem(btn);
                } else if (action === 'view') {
                    e.preventDefault();
                    this.viewItem(btn);
                } else if (action === 'edit') {
                    e.preventDefault();
                    this.editItem(btn);
                } else if (action === 'delete') {
                    e.preventDefault();
                    this.deleteItem(btn);
                }
            });
        },

        getRowData(row) {
            const table = row.closest('table');
            const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
            const cells = Array.from(row.querySelectorAll('td'));

            const data = {};
            headers.forEach((header, index) => {
                const headerText = header.toLowerCase();
                if (headerText && !headerText.includes('action')) {
                    const cell = cells[index];
                    if (!cell) return;

                    let value = cell.textContent.trim();

                    // Specific handling for complex cells
                    if (cell.querySelector('strong')) {
                        value = cell.querySelector('strong').textContent.trim();
                    } else if (cell.querySelector('.user-info')) {
                        value = cell.querySelector('.user-info div div:first-child')?.textContent.trim() ||
                            cell.querySelector('.user-info strong')?.textContent.trim() || value;
                    } else if (cell.querySelector('.status-badge')) {
                        value = cell.querySelector('.status-badge').textContent.trim();
                    } else if (cell.querySelector('.badge')) {
                        value = cell.querySelector('.badge').textContent.trim();
                    }

                    data[header] = value;
                }
            });
            return data;
        },

        generateDetailsHtml(data) {
            return Object.entries(data).map(([label, value]) => `
                <div class="detail-row">
                    <div class="detail-label">${label}</div>
                    <div class="detail-value">${value}</div>
                </div>
            `).join('');
        },

        generateEditFormHtml(data) {
            return Object.entries(data).map(([label, value]) => `
                <div class="detail-row">
                    <label class="detail-label" style="display: block; margin-bottom: 8px;">${label}</label>
                    <input type="text" class="form-control" value="${value}" style="width: 100%; padding: 8px; border: 1px solid var(--border-primary); border-radius: 4px; background: var(--bg-primary); color: var(--text-primary);">
                </div>
            `).join('');
        },

        approveItem(btn) {
            const row = btn.closest('tr');
            const statusBadge = row?.querySelector('.status-badge');

            btn.disabled = true;
            btn.textContent = 'Approved';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-success');

            if (statusBadge) {
                statusBadge.classList.remove('pending');
                statusBadge.classList.add('completed');
                statusBadge.textContent = 'Approved';
            }

            this.showNotification('Item approved successfully', 'success');
        },

        viewItem(btn) {
            const row = btn.closest('tr');
            if (!row) return;

            const data = this.getRowData(row);
            const html = this.generateDetailsHtml(data);

            ModalManager.show({
                title: 'Item Details',
                body: html
            });
        },

        editItem(btn) {
            const row = btn.closest('tr');
            if (!row) return;

            const data = this.getRowData(row);
            const html = this.generateEditFormHtml(data);

            ModalManager.show({
                title: 'Edit Information',
                body: html,
                confirmText: 'Update Details',
                onConfirm: () => {
                    this.showNotification('Information updated successfully', 'success');
                }
            });
        },

        deleteItem(btn) {
            const row = btn.closest('tr');
            if (!row) return;

            const data = this.getRowData(row);
            const itemName = Object.values(data)[0] || 'this item';

            ModalManager.show({
                title: 'Confirm Deletion',
                body: `<p>Are you sure you want to delete <strong>${itemName}</strong>? This action cannot be undone.</p>`,
                confirmText: 'Delete',
                confirmType: 'destructive',
                onConfirm: () => {
                    row.style.opacity = '0.5';
                    row.style.backgroundColor = 'var(--color-error-50)';
                    setTimeout(() => {
                        row.remove();
                        this.showNotification('Item deleted successfully', 'success');
                    }, 500);
                }
            });
        },

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `alert alert-${type} notification-toast`;
            notification.textContent = message;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        },
    };

    // ============================================
    // Toggle Switch Functionality
    // ============================================
    const ToggleSwitch = {
        init() {
            const toggleLabels = document.querySelectorAll('.section-card label');
            toggleLabels.forEach(label => {
                const checkbox = label.querySelector('input[type="checkbox"]');
                if (checkbox && !label.classList.contains('toggle-initialized')) {
                    label.classList.add('toggle-initialized');
                    label.addEventListener('click', (e) => {
                        e.stopPropagation();
                        checkbox.checked = !checkbox.checked;
                        this.updateToggleVisual(label, checkbox.checked);

                        // Trigger change event for any handlers
                        checkbox.dispatchEvent(new Event('change'));
                    });
                }
            });
        },

        updateToggleVisual(label, isChecked) {
            const toggle = label.querySelector('span');
            const knob = toggle?.querySelector('span:nth-child(2)');

            if (toggle && knob) {
                if (isChecked) {
                    toggle.style.backgroundColor = 'var(--color-primary-600)';
                    knob.style.left = '26px';
                } else {
                    toggle.style.backgroundColor = 'var(--bg-tertiary)';
                    knob.style.left = '3px';
                }
            }
        }
    };

    // ============================================
    // Two-Factor Authentication Toggle
    // ============================================
    const TwoFactorAuth = {
        enabled: false,

        init() {
            const enableBtn = document.querySelector('[data-2fa-toggle]');
            if (enableBtn) {
                enableBtn.addEventListener('click', () => this.toggle());
            }
        },

        toggle() {
            this.enabled = !this.enabled;
            const btn = document.querySelector('[data-2fa-toggle]');

            if (this.enabled) {
                btn.textContent = 'Disable';
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');
                this.showNotification('Two-factor authentication enabled', 'success');
            } else {
                btn.textContent = 'Enable';
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');
                this.showNotification('Two-factor authentication disabled', 'info');
            }
        },

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `alert alert-${type} notification-toast`;
            notification.textContent = message;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };

    // ============================================
    // Photo Upload Functionality
    // ============================================
    const PhotoUploader = {
        init() {
            const uploadBtn = document.getElementById('uploadPhotoBtn');
            const photoInput = document.getElementById('photoUpload');

            if (uploadBtn && photoInput) {
                uploadBtn.addEventListener('click', () => {
                    photoInput.click();
                });

                photoInput.addEventListener('change', (e) => {
                    if (e.target.files && e.target.files[0]) {
                        this.handleFileUpload(e.target.files[0]);
                    }
                });
            }
        },

        handleFileUpload(file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                this.showNotification('Please select a valid image file (JPG, PNG, or GIF)', 'error');
                return;
            }

            // Validate file size (2MB max)
            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
                this.showNotification('File size must be less than 2MB', 'error');
                return;
            }

            // Create FormData for upload
            const formData = new FormData();
            formData.append('photo', file);

            // Show loading state
            this.showNotification('Uploading photo...', 'info');

            // Simulate upload (in production, this would be an actual API call)
            const reader = new FileReader();
            reader.onload = (e) => {
                const profileImg = document.getElementById('profileImage');
                if (profileImg) {
                    profileImg.src = e.target.result;
                }
                this.showNotification('Photo uploaded successfully!', 'success');
            };
            reader.readAsDataURL(file);
        },

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `alert alert-${type} notification-toast`;
            notification.textContent = message;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };

    // ============================================
    // Search & Filter
    // ============================================
    const SearchFilter = {
        init() {
            const searchInputs = document.querySelectorAll('[data-search-table]');
            searchInputs.forEach(input => {
                input.addEventListener('input', (e) => this.filterTable(e.target));
            });

            const filterSelects = document.querySelectorAll('[data-filter-table]');
            filterSelects.forEach(select => {
                select.addEventListener('change', (e) => this.filterTable(e.target));
            });
        },

        filterTable(input) {
            const tableId = input.dataset.searchTable || input.dataset.filterTable;
            const table = document.getElementById(tableId);
            if (!table) return;

            const searchTerm = input.value.toLowerCase();
            const rows = table.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                const shouldShow = text.includes(searchTerm);
                row.style.display = shouldShow ? '' : 'none';
            });
        }
    };

    // ============================================
    // Initialize Dashboard
    // ============================================
    function init() {
        console.log('init() function called');
        // Ensure buttons are clickable
        const style = document.createElement('style');
        style.textContent = `
            .btn {
                pointer-events: auto !important;
                cursor: pointer !important;
            }
            .btn:disabled {
                pointer-events: none !important;
                opacity: 0.6 !important;
            }
            button[data-action], button[type="submit"], a[data-view-all] {
                pointer-events: auto !important;
            }
        `;
        document.head.appendChild(style);

        console.log('Calling DashboardManager.init()...');
        DashboardManager.init();
        console.log('Calling ReportGenerator.init()...');
        ReportGenerator.init();
        console.log('Calling RealtimeUpdates.init()...');
        RealtimeUpdates.init();
        console.log('Calling SearchFilter.init()...');
        SearchFilter.init();

        console.log('📊 Dashboard initialized');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        try {
            init();
        } catch (error) {
            console.error('Error initializing dashboard:', error);
            alert('Error initializing dashboard. Please check the console for details.');
        }
    }

    // Global click handler as fallback
    document.addEventListener('click', function (e) {
        // Handle approve buttons
        if (e.target.matches('[data-action="approve"]')) {
            console.log('Approve clicked via global handler');
            e.preventDefault();
            const btn = e.target;
            btn.disabled = true;
            btn.textContent = 'Approved';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-success');

            const row = btn.closest('tr');
            const statusBadge = row?.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.classList.remove('pending');
                statusBadge.classList.add('completed');
                statusBadge.textContent = 'Approved';
            }

            // Show notification
            const notification = document.createElement('div');
            notification.className = 'alert alert-success notification-toast';
            notification.textContent = 'Item approved successfully';
            notification.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: var(--color-success); color: white; padding: 12px 24px; border-radius: 8px; z-index: 10000;';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }

        // Handle view buttons
        if (e.target.matches('[data-action="view"]')) {
            console.log('View clicked via global handler');
            e.preventDefault();
            const notification = document.createElement('div');
            notification.className = 'alert alert-info notification-toast';
            notification.textContent = 'Opening item details...';
            notification.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: var(--color-primary-600); color: white; padding: 12px 24px; border-radius: 8px; z-index: 10000;';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }

        // Handle view-all buttons
        if (e.target.matches('[data-view-all]')) {
            console.log('View All clicked via global handler:', e.target.dataset.viewAll);
            e.preventDefault();
            const type = e.target.dataset.viewAll;
            const btn = e.target;

            // Close any existing inline container
            const existing = document.querySelector('.view-all-inline');
            if (existing) existing.remove();

            // Create inline container
            const container = document.createElement('div');
            container.className = 'view-all-inline';
            container.style.cssText = 'background: var(--bg-primary); border-radius: var(--radius-xl); padding: var(--space-6); margin-top: var(--space-4); border: 1px solid var(--border-primary);';

            let title = '';
            let items = [];

            if (type === 'activity') {
                title = 'All Recent Activity';
                items = [
                    { icon: '✓', color: '#dcfce7', textColor: '#15803d', title: 'Password changed successfully', desc: 'Your password was updated on Jan 20, 2024' },
                    { icon: '👤', color: 'var(--color-primary-100)', textColor: 'var(--color-primary-600)', title: 'Profile information updated', desc: 'Your profile details were modified on Jan 18, 2024' },
                    { icon: '⬇', color: '#ffedd5', textColor: '#c2410c', title: 'Report downloaded', desc: 'You downloaded "MFL Inspection Report" on Jan 15, 2024' }
                ];
            } else if (type === 'users') {
                title = 'All Recent Registrations';
                items = [
                    { icon: 'SJ', color: '#e0f2fe', textColor: '#0369a1', title: 'Sarah Jenkins', desc: 'Client - Feb 06, 2026 - Pending' },
                    { icon: 'MK', color: '#f0fdf4', textColor: '#15803d', title: 'Mike K.', desc: 'Inspector - Feb 05, 2026 - Verified' },
                    { icon: 'AB', color: '#fefce8', textColor: '#a16207', title: 'Alex B.', desc: 'Client - Feb 05, 2026 - Review' }
                ];
            } else if (type === 'orders') {
                title = 'All Recent Orders';
                items = [
                    { icon: '📦', color: '#e0f2fe', textColor: '#0369a1', title: 'ORD-9921', desc: 'Chevron Corp. - $12,500 - Pending' },
                    { icon: '📦', color: '#f0fdf4', textColor: '#15803d', title: 'ORD-9920', desc: 'ExxonMobil - $8,200 - Paid' },
                    { icon: '📦', color: '#fefce8', textColor: '#a16207', title: 'ORD-9919', desc: 'Shell Oil - $15,000 - Processing' }
                ];
            } else if (type === 'messages') {
                title = 'All Messages';
                items = [
                    { icon: '✉', color: 'var(--color-primary-100)', textColor: 'var(--color-primary-600)', title: 'Tech Support Request', desc: 'From: Dr. Sarah Jenkins - 15 mins ago' },
                    { icon: '✉', color: 'var(--bg-secondary)', textColor: 'var(--text-primary)', title: 'New Inquiry', desc: 'From: PetroCorp - 1 hour ago' }
                ];
            }

            let itemsHtml = items.map(item => `
                <div style="padding: var(--space-3) 0; border-bottom: 1px solid var(--border-primary); display: flex; align-items: center; gap: var(--space-3);">
                    <div style="background-color: ${item.color}; color: ${item.textColor}; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-full); flex-shrink: 0; font-weight: bold; font-size: 12px;">${item.icon}</div>
                    <div style="flex: 1;">
                        <h4 style="font-size: var(--text-sm); font-weight: var(--font-medium); margin: 0;">${item.title}</h4>
                        <p style="font-size: var(--text-xs); color: var(--text-tertiary); margin: 0;">${item.desc}</p>
                    </div>
                </div>
            `).join('');

            container.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
                    <h3 style="font-size: var(--text-base); font-weight: var(--font-semibold);">${title}</h3>
                    <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; cursor: pointer; padding: var(--space-1); color: var(--text-tertiary);">✕</button>
                </div>
                <div style="display: flex; flex-direction: column;">
                    ${itemsHtml}
                </div>
            `;

            const parentSection = btn.closest('.section-card');
            if (parentSection && parentSection.parentElement) {
                parentSection.parentElement.insertBefore(container, parentSection.nextSibling);
            } else {
                document.querySelector('.dashboard-content > div')?.appendChild(container);
            }
        }
    });

    // Expose to global scope
    window.DashboardApp = {
        DashboardManager,
        ReportGenerator,
        RealtimeUpdates
    };

    // Expose toggle functions globally
    window.toggleDetailedReports = toggleDetailedReports;
    window.toggleSummaryReports = toggleSummaryReports;
    window.downloadReport = downloadReport;

    // ============================================
    // File Download Function
    // ============================================
    function downloadReport(reportName, format) {
        // Create a dummy file for download demonstration
        const content = `Report: ${reportName}\nGenerated: ${new Date().toLocaleDateString()}\nFormat: ${format.toUpperCase()}\n\nThis is a sample report file for demonstration purposes.`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        // Clean filename for download
        const filename = reportName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.href = url;
        a.download = `${filename}.txt`;

        // Trigger download
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Show notification
        showNotification(`Downloading: ${reportName}`, 'success');
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification-toast`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Expose for global access (debugging and inline handlers)
    window.DashboardManager = DashboardManager;

    // Global notification toggle for cross-page compatibility
    window.toggleNotificationDropdown = function () {
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    };

    // Close notification dropdown when clicking outside
    document.addEventListener('click', function (e) {
        const dropdown = document.getElementById('notificationDropdown');
        const btn = document.getElementById('notificationBtn');
        if (dropdown && dropdown.style.display === 'block') {
            if (!dropdown.contains(e.target) && (!btn || !btn.contains(e.target))) {
                dropdown.style.display = 'none';
            }
        }
    });

    // Initialize dashboard manager
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => DashboardManager.init());
    } else {
        DashboardManager.init();
    }

})();
