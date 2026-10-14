/**
 * Neo-Virex Portfolio Script
 * Theme toggle, project category filters, live blog sync with right-side thumbnail media.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ───── 1. Theme Toggle ─────
    const themeToggle = document.getElementById('theme-toggle');
    const iconLight = document.getElementById('theme-icon-light');
    const iconDark = document.getElementById('theme-icon-dark');
    const savedTheme = localStorage.getItem('theme') || 'dark';

    function applyTheme(mode) {
        if (mode === 'light') {
            document.body.classList.add('light-mode');
            if (iconLight) iconLight.style.display = 'none';
            if (iconDark) iconDark.style.display = 'inline-block';
        } else {
            document.body.classList.remove('light-mode');
            if (iconLight) iconLight.style.display = 'inline-block';
            if (iconDark) iconDark.style.display = 'none';
        }
    }

    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = document.body.classList.contains('light-mode');
            const newMode = isLight ? 'dark' : 'light';
            applyTheme(newMode);
            localStorage.setItem('theme', newMode);
        });
    }

    // ───── 2. Project Category Filters ─────
    const filterPills = document.querySelectorAll('.filter-pill');
    const projectItems = document.querySelectorAll('.project-item');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = (pill.dataset.filter || 'all').toLowerCase();

            projectItems.forEach(item => {
                const categories = (item.dataset.category || '').toLowerCase().split(/\s+/);
                if (filter === 'all' || categories.includes(filter)) {
                    item.style.display = '';
                    item.style.animation = 'fadeIn 0.3s ease-out forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // ───── 3. Live Blog Sync from neo-virex.vercel.app ─────
    const blogsContainer = document.getElementById('recent-blogs-container');
    const refreshBtn = document.getElementById('refresh-blog-btn');
    const refreshLabel = document.getElementById('refresh-label');

    // Known curated post descriptions from meta tags on neo-virex.vercel.app
    const POST_DESCRIPTIONS = {
        'hackthebox_puppet': 'Password reuse was the key. One reused password led to mailbox access, then to the app creds hidden in email.',
        'hackthebox_Enigma': 'The real path is password reuse across the email accounts + a web-app exploit. So the next move is: reuse The password on the other mailboxes and read email to find internal app creds.',
        'University_CTF_Zoromegbia': 'This challenge focused on web and sub-directory exploitation, exposed internal files, and local privilege escalation via a known CVE.',
        'University_CTF_Alzymer': 'Web and directory fuzzing walkthrough covering file discovery, authentication bypass, and privilege escalation.',
        'Project_GPSSimulator': 'A GPS movement simulator for Android that produces human-like running behavior, natural pace variation, and clean repeatable simulation.',
        'University_CTF_Aria': 'Deep dive into initial web foothold enumeration, filter evasion, local service discovery, and clean escalation to root authority.'
    };

    // Known curated post thumbnails from neo-virex.github.io
    const POST_IMAGES = {
        'hackthebox_puppet': 'https://neo-virex.github.io/images/hackthebox/hackthebox_puppet/roomimg.webp',
        'hackthebox_Enigma': 'https://neo-virex.github.io/images/hackthebox/hackthebox_enigma/room-img.png',
        'University_CTF_Zoromegbia': 'https://neo-virex.github.io/images/ctf/uni-2026/post/zoromegbia/room-img.png',
        'University_CTF_Alzymer': 'https://neo-virex.github.io/images/ctf/uni-2026/post/alzymer/room-img.png',
        'Project_GPSSimulator': 'https://neo-virex.github.io/images/blogs/GPSSimulator/room-img.png',
        'University_CTF_Aria': 'https://neo-virex.github.io/images/ctf/uni-2026/post/aria/room_img.png'
    };

    function cleanText(raw) {
        if (!raw) return '';
        const doc = new DOMParser().parseFromString(raw, 'text/html');
        return doc.body.textContent || '';
    }

    function formatDate(rawDate) {
        if (!rawDate) return 'Recent';
        try {
            const parts = rawDate.split(' ')[0].split('-');
            if (parts.length === 3) {
                const year = parts[0];
                const monthNum = parseInt(parts[1], 10);
                const monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
                return `${monthNames[monthNum - 1] || ''} ${year}`;
            }
        } catch (e) {
            console.error('Date parsing error:', e);
        }
        return rawDate;
    }

    async function getPostDetails(url, fallbackContent, title) {
        let description = '';
        let image = '';

        // Fast-path: check dictionary by URL slug
        for (const [slug, desc] of Object.entries(POST_DESCRIPTIONS)) {
            if (url.includes(slug)) {
                description = desc;
                break;
            }
        }
        for (const [slug, img] of Object.entries(POST_IMAGES)) {
            if (url.includes(slug)) {
                image = img;
                break;
            }
        }

        // Live fetch from post HTML meta tags if missing
        if (!description || !image) {
            try {
                const res = await fetch(url, { cache: 'default' });
                if (res.ok) {
                    const html = await res.text();
                    const doc = new DOMParser().parseFromString(html, 'text/html');
                    if (!description) {
                        const meta = doc.querySelector('meta[name="description"]') || 
                                     doc.querySelector('meta[property="og:description"]');
                        if (meta && meta.content && meta.content.trim()) {
                            description = meta.content.trim();
                        }
                    }
                    if (!image) {
                        const metaImg = doc.querySelector('meta[property="og:image"]') || 
                                        doc.querySelector('meta[name="twitter:image"]');
                        if (metaImg && metaImg.content && metaImg.content.trim()) {
                            image = metaImg.content.trim();
                        }
                    }
                }
            } catch (e) {
                // Ignore fetch error and fall back
            }
        }

        if (!description) {
            let text = cleanText(fallbackContent || '');
            text = text.replace(/^(nmap|Starting Nmap|PORT STATE SERVICE|Introduction\s*)+/i, '').trim();
            if (text.length > 175) {
                text = text.slice(0, 175).replace(/\s+\S*$/, '') + '...';
            }
            description = text || `Technical walkthrough, exploitation mechanics, and flag documentation for ${title}.`;
        }

        if (!image) {
            image = 'https://neo-virex.github.io/images/hackthebox/hackthebox_puppet/roomimg.webp';
        }

        return { description, image };
    }

    async function syncRecentBlogPosts(isManual = false) {
        if (!blogsContainer) return;
        if (refreshBtn) refreshBtn.classList.add('loading');
        if (refreshLabel && isManual) refreshLabel.textContent = 'Syncing...';

        try {
            const url = `https://neo-virex.vercel.app/assets/js/data/search.json?_t=${Date.now()}`;
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const posts = await res.json();

            if (!Array.isArray(posts) || posts.length === 0) return;

            // Sort posts by date descending
            posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

            // Take top 3 recent posts
            const recent = posts.slice(0, 3);

            const resolvedCards = await Promise.all(recent.map(async post => {
                const cleanTitle = cleanText(post.title || '')
                    .replace(/^["\s\u201C\u201D\u2018\u2019]+|["\s\u201C\u201D\u2018\u2019]+$/g, '')
                    .trim();
                const fullUrl = (post.url && post.url.startsWith('http')) 
                    ? post.url 
                    : `https://neo-virex.vercel.app${post.url || ''}`;
                const dateStr = formatDate(post.date);
                const category = post.categories ? post.categories.split(',')[0].trim() : 'Research';
                const { description, image } = await getPostDetails(fullUrl, post.content, cleanTitle);

                let tagsList = [];
                if (typeof post.tags === 'string' && post.tags.trim()) {
                    tagsList = post.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 4);
                } else if (Array.isArray(post.tags)) {
                    tagsList = post.tags.slice(0, 4);
                }
                if (tagsList.length === 0) {
                    tagsList = ['Security', 'Writeup', 'RedTeam'];
                }

                const tagsHtml = tagsList.map(tag => `<span>${tag}</span>`).join('');

                return `
                <a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="blog-card group">
                    <div class="blog-card-content">
                        <div class="blog-meta-row">
                            <span class="blog-chip">${category}</span>
                            <span class="blog-date">${dateStr}</span>
                        </div>
                        <h3 class="blog-title">${cleanTitle}</h3>
                        <p class="blog-excerpt">${description}</p>
                        <div class="blog-tags">
                            ${tagsHtml}
                        </div>
                    </div>
                    <div class="blog-card-media">
                        <img src="${image}" alt="${cleanTitle}" class="blog-thumb-img" loading="lazy">
                    </div>
                </a>
                `;
            }));

            blogsContainer.innerHTML = resolvedCards.join('');

            if (refreshLabel) refreshLabel.textContent = 'Updated Just Now';
            setTimeout(() => {
                if (refreshLabel) refreshLabel.textContent = 'Check for Updates';
            }, 3000);

        } catch (err) {
            console.warn('Could not sync live writeups, keeping static cards:', err);
            if (refreshLabel && isManual) {
                refreshLabel.textContent = 'Sync failed';
                setTimeout(() => {
                    if (refreshLabel) refreshLabel.textContent = 'Check for Updates';
                }, 3000);
            }
        } finally {
            if (refreshBtn) refreshBtn.classList.remove('loading');
        }
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', (e) => {
            e.preventDefault();
            syncRecentBlogPosts(true);
        });
    }

    // Auto-sync on page load
    syncRecentBlogPosts(false);

});
