/**
 * Pipeline Inspection Services - Blog Details Logic
 * ===============================================
 * Handles dynamic content loading for blog-details.html
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        // Get blog ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const blogId = urlParams.get('id');

        // Check if data exists
        if (!blogId || !window.BLOG_DATA || !window.BLOG_DATA[blogId]) {
            // Default to first post or show error
            console.warn('Blog post not found, showing default content');
            return;
        }

        const post = window.BLOG_DATA[blogId];

        // Update Page Title
        document.title = `${post.title} | PipelinePro Blog`;

        // Update Meta Description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', post.title);

        // Update Badges
        const badgeContainer = document.querySelector('.hero .badge-primary').parentElement;
        if (badgeContainer) {
            badgeContainer.innerHTML = `
                <span class="badge badge-primary">${post.badge}</span>
                ${post.featured ? '<span class="badge badge-secondary">Featured</span>' : ''}
            `;
        }

        // Update Title
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) heroTitle.textContent = post.title;

        // Update Meta Info
        const blogMeta = document.querySelector('.blog-meta');
        if (blogMeta) {
            blogMeta.innerHTML = `
                <span>${post.date}</span>
                <span>•</span>
                <span>${post.readTime}</span>
                <span>•</span>
                <span>By ${post.author}</span>
            `;
        }

        // Update Featured Image
        const featuredImage = document.querySelector('article img');
        if (featuredImage) {
            featuredImage.src = post.image;
            featuredImage.alt = post.title;
        }

        // Update Content Body
        const contentBody = document.querySelector('article .reveal[style*="font-size: var(--text-lg)"]');
        if (contentBody) {
            contentBody.innerHTML = post.content;
        }

        // Update Tags
        const tagsContainer = document.querySelector('.hero + section + section div[style*="flex-wrap: wrap"]');
        const tagsWrapper = document.querySelector('article > div:last-child div[style*="flex-wrap: wrap"]');

        // Let's find the tags container more reliably
        const tagSection = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.trim().toUpperCase() === 'TAGS')?.parentElement;
        if (tagSection) {
            const tagList = tagSection.querySelector('div');
            if (tagList) {
                tagList.innerHTML = post.tags.map(tag => `<span class="badge badge-primary">${tag}</span>`).join('');
            }
        }

        // Update Author Info in Sidebar
        const authorSection = document.querySelector('aside .card img')?.parentElement;
        if (authorSection) {
            const authorImg = authorSection.querySelector('img');
            const authorName = authorSection.querySelector('h3');
            const authorRole = authorSection.querySelector('p:nth-child(3)');

            if (authorImg) authorImg.src = post.authorImage;
            if (authorName) authorName.textContent = post.author;
            if (authorRole) authorRole.textContent = post.authorRole;
        }
    });
})();
