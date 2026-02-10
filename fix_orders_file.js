const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'SUPRAJA', 'OneDrive', 'Desktop', 'Project_14', 'admin-orders.html');
let content = fs.readFileSync(filePath, 'utf8');

// The problematic block starts with '</div></td>' and then a template closer '`;'
// We need to close the table properly and wrap the leaked JS in a script tag.

const searchString = '</div></td>\n                        `;';
const replacementString = '</div></td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n\n            <script>\n                document.addEventListener(\'DOMContentLoaded\', function () {\n                    const newOrderBtn = document.getElementById(\'newOrderBtn\');\n                    const newOrderModal = document.getElementById(\'newOrderModal\');\n                    const closeModalBtn = document.getElementById(\'closeModalBtn\');\n                    const cancelBtn = document.getElementById(\'cancelBtn\');\n                    const newOrderForm = document.getElementById(\'newOrderForm\');\n                    const tbody = document.querySelector(\'table tbody\');\n\n                    if (newOrderBtn && newOrderModal) {\n                        newOrderBtn.addEventListener(\'click\', () => {\n                            newOrderModal.style.display = \'flex\';\n                        });\n\n                        [closeModalBtn, cancelBtn].forEach(btn => {\n                            if (btn) {\n                                btn.addEventListener(\'click\', () => {\n                                    newOrderModal.style.display = \'none\';\n                                });\n                            }\n                        });\n                    }\n                    \n                    if (newOrderForm && tbody) {\n                        newOrderForm.addEventListener(\'submit\', function (e) {\n                            e.preventDefault();\n                            // New order logic...\n                        });\n                    }\n                });\n            </script>\n            <script>';

// Use a more robust regex-based approach if exact string fails
content = content.replace(/<\/div><\/td>\s*`;/g, '</div></td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n            <script>');

// Also check the rest of the leaked content
content = content.replace(/tbody\.insertBefore\(newRow, tbody\.firstChild\);/g, 'if (tbody) tbody.insertBefore(newRow, tbody.firstChild);');

// Fix the stats grid overlapping as well
content = content.replace(/flex-gap: var\(--space-4\);/g, 'flex-wrap: wrap; gap: var(--space-4);');
content = content.replace(/display: flex;\s*gap:/g, 'display: flex; flex-wrap: wrap; gap:');

fs.writeFileSync(filePath, content);
console.log('File fixed via script');
