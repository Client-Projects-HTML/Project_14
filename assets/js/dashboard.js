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
            primary: '#3b82f6',
            primaryLight: '#93c5fd',
            secondary: '#f97316',
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            neutral: '#94a3b8'
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
        },

        bindEvents() {
            // Sidebar toggle
            if (this.sidebarToggle) {
                this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
            }

            // Close sidebar on mobile when clicking outside
            document.addEventListener('click', (e) => {
                if (window.innerWidth < 1024 &&
                    this.sidebar?.classList.contains('active') &&
                    !this.sidebar.contains(e.target) &&
                    !this.sidebarToggle?.contains(e.target)) {
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
            document.addEventListener('click', () => {
                this.closeAllDropdowns();
            });

            // Window resize
            window.addEventListener('resize', this.debounce(() => {
                if (window.innerWidth >= 1024) {
                    this.sidebar?.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                }
            }, 150));
        },

        toggleSidebar() {
            this.sidebar?.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
        },

        closeSidebar() {
            this.sidebar?.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        },

        toggleDropdown(dropdown) {
            const isOpen = dropdown.classList.contains('active');
            this.closeAllDropdowns();
            if (!isOpen) {
                dropdown.classList.add('active');
            }
        },

        closeAllDropdowns() {
            this.userMenu?.classList.remove('active');
            this.notificationDropdown?.classList.remove('active');
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
        DashboardManager.init();
        ReportGenerator.init();
        RealtimeUpdates.init();
        SearchFilter.init();

        console.log('📊 Dashboard initialized');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose to global scope
    window.DashboardApp = {
        DashboardManager,
        ReportGenerator,
        RealtimeUpdates
    };

})();
