document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('mohacademy_token') || localStorage.getItem('token');
    
    // UI Elements
    const askBtn = document.getElementById('action-ask-btn');
    const authModal = document.getElementById('auth-gateway-modal');
    const postModal = document.getElementById('ask-question-modal');
    const closeAuthBtn = document.getElementById('close-auth-modal-btn');
    const closePostBtn = document.getElementById('close-post-modal-btn');
    const cancelPostBtn = document.getElementById('cancel-post-modal-btn');
    const postForm = document.getElementById('new-post-form');
    const feedContainer = document.getElementById('posts-feed');
    const categoryBtns = document.querySelectorAll('.category-btn');

    let currentSubject = 'all';

    // Formats dates nicely (e.g., "Oct 12, 2026")
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Modal Triggers
    askBtn.addEventListener('click', () => {
        if (!token) {
            authModal.classList.remove('layout-hidden');
        } else {
            postModal.classList.remove('layout-hidden');
        }
    });

    closeAuthBtn.addEventListener('click', () => authModal.classList.add('layout-hidden'));
    closePostBtn.addEventListener('click', () => postModal.classList.add('layout-hidden'));
    cancelPostBtn.addEventListener('click', () => postModal.classList.add('layout-hidden'));

    // Submit a New Question
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('post-form-title').value;
        const subject = document.getElementById('post-form-subject').value;
        const content = document.getElementById('post-form-body').value;

        try {
            const res = await fetch('http://localhost:5000/api/forum/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ title, subject, content })
            });

            if (res.ok) {
                postForm.reset();
                postModal.classList.add('layout-hidden');
                loadFeed(currentSubject); // Refresh feed
            } else {
                alert('Failed to post question. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('Server network error.');
        }
    });

    // Sidebar Category Filtering
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSubject = btn.getAttribute('data-subject');
            loadFeed(currentSubject);
        });
    });

    // Load Feed from Backend
    async function loadFeed(subjectFilter = 'all') {
        feedContainer.innerHTML = '<div style="text-align:center; padding: 40px;"><i class="fas fa-circle-notch fa-spin fa-2x" style="color:var(--fr-primary)"></i></div>';
        
        try {
            let url = 'http://localhost:5000/api/forum/posts';
            if (subjectFilter !== 'all') {
                url += `?subject=${subjectFilter}`;
            }

            const res = await fetch(url);
            const posts = await res.json();

            feedContainer.innerHTML = '';

            if (posts.length === 0) {
                feedContainer.innerHTML = `<div style="text-align:center; padding:40px; color:var(--fr-text-muted);">No questions found for this topic yet. Be the first to ask!</div>`;
                return;
            }

            posts.forEach(post => {
                const authorName = post.student ? post.student.name : 'Unknown Student';
                const authorXP = post.student ? post.student.xpScore : 0;
                
                const postHTML = `
                    <div class="forum-post-card">
                        <div class="post-main-content">
                            <div class="post-header">
                                <span class="subject-badge tag-${post.subject.replace(' ', '').toLowerCase()}">${post.subject}</span>
                                <div class="post-meta-info">
                                    <span class="author-tag"><i class="fas fa-star"></i> ${authorXP} XP</span>
                                    <span class="author-name">${authorName}</span>
                                    <span>•</span>
                                    <span>${formatDate(post.createdAt)}</span>
                                </div>
                            </div>
                            <h3 class="post-title">${post.title}</h3>
                            <div class="post-excerpt">${typeof marked !== 'undefined' ? marked.parse(post.content) : post.content}</div>
                            
                            <div class="post-footer-actions">
                                <button class="comment-toggle-btn" onclick="toggleComments('${post._id}')">
                                    <i class="far fa-comments"></i> View / Write Answers
                                </button>
                            </div>

                            <div class="post-comments-wrapper" id="comments-${post._id}">
                                <div id="comment-list-${post._id}">
                                    <div style="font-size:0.85rem; color:gray;"><i class="fas fa-spinner fa-spin"></i> Loading...</div>
                                </div>
                                <div class="main-comment-form-box">
                                    <textarea id="comment-input-${post._id}" class="comment-textarea" rows="3" placeholder="Write an answer..."></textarea>
                                    <button class="btn-sm btn-primary" onclick="submitComment('${post._id}')">Post Answer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                feedContainer.innerHTML += postHTML;
            });
            if (typeof renderMathInElement !== 'undefined') {
                renderMathInElement(feedContainer, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false}
                    ],
                    throwOnError: false
                });
            }

        } catch (error) {
            console.error(error);
            feedContainer.innerHTML = `<div style="text-align:center; padding:40px; color:red;">Failed to connect to the forum servers.</div>`;
        }
    }

    // Toggle Comments & Load them
    window.toggleComments = async (postId) => {
        const commentSection = document.getElementById(`comments-${postId}`);
        commentSection.classList.toggle('active');

        if (commentSection.classList.contains('active')) {
            await fetchComments(postId);
        }
    };

    // Fetch Comments from Backend
    // Fetch Comments from Backend
    window.fetchComments = async (postId) => {
        const listContainer = document.getElementById(`comment-list-${postId}`);
        try {
            const res = await fetch(`http://localhost:5000/api/forum/posts/${postId}/comments`);
            const comments = await res.json();
            
            listContainer.innerHTML = '';
            
            if (comments.length === 0) {
                listContainer.innerHTML = `<div style="font-size:0.9rem; color:gray; margin-bottom: 15px;">No answers yet.</div>`;
                return;
            }

            comments.forEach(c => {
                let authorDisplay = '';
                let nodeClass = 'comment-branch-node';

                if (c.isBot) {
                    // Render official AI Bot Style
                    nodeClass += ' bot-reply';
                    authorDisplay = `<strong style="color:var(--fr-accent-ai);"><i class="fas fa-robot"></i> ${c.botName} <i class="fas fa-check-circle"></i></strong>`;
                } else {
                    // Render normal student style
                    const studentName = c.student ? c.student.name : 'Unknown';
                    const xp = c.student ? c.student.xpScore : 0;
                    authorDisplay = `<strong>${studentName}</strong> <span style="background:#1e293b; color:var(--xp-gold); padding:2px 6px; border-radius:4px; font-size:0.7rem;">${xp} XP</span>`;
                }

                listContainer.innerHTML += `
                    <div class="${nodeClass}">
                        <div class="comment-avatar-meta">
                            ${authorDisplay}
                            <span style="color:var(--fr-text-muted);">• ${formatDate(c.createdAt)}</span>
                        </div>
                        <!-- FIX 1: This line now translates Markdown for comments -->
                        <div class="comment-body-text">${typeof marked !== 'undefined' ? marked.parse(c.text) : c.text}</div>
                    </div>
                `;
            });

            // FIX 2: This block translates LaTeX into Math equations for comments
            if (typeof renderMathInElement !== 'undefined') {
                renderMathInElement(listContainer, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false}
                    ],
                    throwOnError: false
                });
            }

        } catch (err) {
            console.error(err);
            listContainer.innerHTML = `<div style="color:red;">Error loading comments.</div>`;
        }
    };

    // Submit a Comment
    window.submitComment = async (postId) => {
        if (!token) {
            authModal.classList.remove('layout-hidden');
            return;
        }

        const input = document.getElementById(`comment-input-${postId}`);
        const text = input.value.trim();
        if (!text) return;

        try {
            const res = await fetch(`http://localhost:5000/api/forum/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ text })
            });

            if (res.ok) {
                input.value = '';
                fetchComments(postId); // Reload just this comment section
            }
        } catch (err) {
            console.error(err);
            alert("Network error.");
        }
    };

    // Initial Load
    loadFeed();
});