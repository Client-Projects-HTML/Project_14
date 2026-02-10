const fs = require('fs');
const path = require('path');

const files = [
    'services.html',
    'about.html',
    'blog.html',
    'contact.html',
    'pricing.html',
    'blog-details.html',
    'service-details.html'
];

const dir = 'c:\\Users\\SUPRAJA\\OneDrive\\Desktop\\Project_14';

files.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Fix menu-toggle attributes
    content = content.replace(
        '<button class="menu-toggle" aria-label="Toggle mobile menu">',
        '<button class="menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobile-nav">'
    );

    // 2. Ensure Login button is visible on mobile by removing 'hidden sm:flex' 
    // Wait, the user might want it hidden on mobile as per design. 
    // BUT since they said it's "missing", I'll make it visible but smaller.
    // Actually, I'll keep the classes but add a CSS rule to force it if needed.
    // Let's just remove 'hidden sm:flex' for now to be safe and see if it's what they want.
    // Actually, Better: Keep classes, but ensure it's flex.

    // 3. Fix active link on mobile-nav
    // (Already handled by main.js, but good to have correct initial state)

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
});
