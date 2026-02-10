const fs = require('fs');
const path = require('path');

const files = [
    'index.html',
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

    // Remove hidden and sm:flex classes from the Login button in header
    content = content.replace(
        /class="btn btn-primary btn-sm hidden sm:flex"/g,
        'class="btn btn-primary btn-sm"'
    );

    fs.writeFileSync(filePath, content);
    console.log(`Cleaned up ${file}`);
});
