const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'SUPRAJA', 'OneDrive', 'Desktop', 'Project_14', 'admin-orders.html');
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

const newScript = `            <script>
                document.addEventListener('DOMContentLoaded', function () {
                    const newOrderBtn = document.getElementById('newOrderBtn');
                    const newOrderModal = document.getElementById('newOrderModal');
                    const closeModalBtn = document.getElementById('closeModalBtn');
                    const cancelBtn = document.getElementById('cancelBtn');
                    const newOrderForm = document.getElementById('newOrderForm');
                    const tbody = document.querySelector('table tbody');

                    if (newOrderBtn && newOrderModal) {
                        newOrderBtn.addEventListener('click', () => {
                            newOrderModal.style.display = 'flex';
                        });

                        [closeModalBtn, cancelBtn].forEach(btn => {
                            if (btn) {
                                btn.addEventListener('click', () => {
                                    newOrderModal.style.display = 'none';
                                });
                            }
                        });

                        window.addEventListener('click', (e) => {
                            if (e.target === newOrderModal) {
                                newOrderModal.style.display = 'none';
                            }
                        });
                    }

                    if (newOrderForm && tbody) {
                        newOrderForm.addEventListener('submit', function (e) {
                            e.preventDefault();

                            const clientInput = document.getElementById('newOrderClient');
                            const serviceInput = document.getElementById('newOrderService');
                            const dateInput = document.getElementById('newOrderDate');
                            const amountInput = document.getElementById('newOrderAmount');

                            if (clientInput.value && serviceInput.value && dateInput.value && amountInput.value) {
                                const orderId = 'ORD-2026-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                                const newRow = document.createElement('tr');
                                newRow.innerHTML = \`
                                    <td><strong>\${orderId}</strong></td>
                                    <td>
                                        <div class="order-info">
                                            <div class="user-avatar" style="width: 32px; height: 32px; font-size: var(--text-sm);">\${clientInput.value.substring(0, 2).toUpperCase()}</div>
                                            <span>\${clientInput.value}</span>
                                        </div>
                                    </td>
                                    <td>\${serviceInput.value}</td>
                                    <td>\${new Date(dateInput.value).toLocaleDateString()}</td>
                                    <td><span class="badge badge-warning">Pending</span></td>
                                    <td>$\${Number(amountInput.value).toLocaleString()}</td>
                                    <td>
                                        <div style="display: flex; gap: 4px;">
                                            <button class="action-btn" title="View" data-action="view"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                                            <button class="action-btn" title="Edit" data-action="edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                                            <button class="action-btn delete" title="Delete" data-action="delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                                        </div>
                                    </td>
                                \`;
                                tbody.insertBefore(newRow, tbody.firstChild);

                                newOrderModal.style.display = 'none';
                                newOrderForm.reset();
                                updateStats();
                                alert('Order ' + orderId + ' created successfully!');
                            }
                        });
                    }
                });

                function updateStats() {
                    const total = document.querySelectorAll('table tbody tr').length;
                    const pending = document.querySelectorAll('table tbody tr .badge-warning').length;
                    const stats = document.querySelectorAll('.stat-card h3');
                    if (stats[0]) stats[0].textContent = total;
                    if (stats[1]) stats[1].textContent = pending;
                }
            </script>`;

// Replace lines 507 to 565 (indices 506 to 564)
// My lines index is 0-based.
lines.splice(506, 565 - 506 + 1, newScript);

fs.writeFileSync(filePath, lines.join('\n'));
console.log('File cleaned up successfully');
