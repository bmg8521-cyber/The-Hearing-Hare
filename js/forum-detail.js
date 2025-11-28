// Forum Detail Page JavaScript
class ForumDetail {
    constructor() {
        this.forumData = null;
        this.comments = [];
        this.init();
    }

    init() {
        this.loadForumData();
        this.setupEventListeners();
        this.loadComments();
    }

    setupEventListeners() {
        const addCommentBtn = document.getElementById('add-comment-btn');
        if (addCommentBtn) {
            addCommentBtn.addEventListener('click', () => {
                this.addComment();
            });
        }
    }

    loadForumData() {
        // Get forum data from URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const forumId = urlParams.get('id') || localStorage.getItem('currentForumId');
        const forumTitle = urlParams.get('title') || localStorage.getItem('currentForumTitle');
        const forumAuthor = urlParams.get('author') || localStorage.getItem('currentForumAuthor');
        const forumGenre = urlParams.get('genre') || localStorage.getItem('currentForumGenre');
        const forumContent = urlParams.get('content') || localStorage.getItem('currentForumContent');

        if (forumTitle) {
            this.forumData = {
                id: forumId || 'default',
                title: decodeURIComponent(forumTitle),
                author: decodeURIComponent(forumAuthor || 'Community Member'),
                genre: decodeURIComponent(forumGenre || 'General'),
                content: decodeURIComponent(forumContent || 'Welcome to this discussion!')
            };
            this.renderForumHeader();
        } else {
            // Default forum if no data available
            this.forumData = {
                id: 'default',
                title: 'How Music Helps with Mental Health',
                author: 'Community',
                genre: 'General',
                content: 'This is a space to discuss how music has helped you on your mental health journey. Share your experiences and connect with others who understand the healing power of music.'
            };
            this.renderForumHeader();
        }
    }

    renderForumHeader() {
        const forumHeader = document.getElementById('forum-header');
        if (!forumHeader || !this.forumData) return;

        forumHeader.innerHTML = `
            <div class="forum-title-section">
                <div class="forum-title-main">
                    <h1>${this.forumData.title}</h1>
                    <div class="forum-meta">
                        <span class="forum-genre-badge">${this.forumData.genre}</span>
                        <span class="forum-author">Started by ${this.forumData.author}</span>
                    </div>
                </div>
                <div class="forum-description">
                    <p>${this.forumData.content}</p>
                </div>
            </div>
        `;
    }

    loadComments() {
        // Load existing comments from localStorage or use default comments
        const storedComments = localStorage.getItem(`forum-${this.forumData?.id}-comments`);
        
        if (storedComments) {
            this.comments = JSON.parse(storedComments);
        } else {
            // Default comments for demonstration
            this.comments = [
                {
                    id: 1,
                    author: 'MusicHealer',
                    content: 'I\'ve found that listening to classical music, especially pieces by Ludovico Einaudi, really helps calm my anxiety. The repetitive melodies create a sense of peace that I can\'t find elsewhere.',
                    timestamp: '2 hours ago',
                    likes: 5,
                    replies: [
                        {
                            id: 4,
                            author: 'PianoLover',
                            content: 'I completely agree! Einaudi\'s "Nuvole Bianche" is my go-to when I need to calm down. There\'s something about those gentle piano notes that just soothes the soul.',
                            timestamp: '1 hour ago',
                            likes: 3,
                            replies: []
                        }
                    ]
                },
                {
                    id: 2,
                    author: 'RhythmOfLife',
                    content: 'For me, it\'s all about hip-hop. Artists like Kendrick Lamar and J. Cole speak to my experiences and make me feel less alone. Their lyrics about struggle and growth really resonate.',
                    timestamp: '4 hours ago',
                    likes: 8,
                    replies: []
                },
                {
                    id: 3,
                    author: 'QuietMelodies',
                    content: 'Folk music has been my companion through depression. The raw honesty in artists like Bon Iver and Phoebe Bridgers helps me process difficult emotions.',
                    timestamp: '1 day ago',
                    likes: 12,
                    replies: [
                        {
                            id: 5,
                            author: 'IndieFan',
                            content: 'Phoebe Bridgers is incredible! "Scott Street" helped me through one of my darkest periods. Her vulnerability makes it okay to feel vulnerable too.',
                            timestamp: '12 hours ago',
                            likes: 7,
                            replies: []
                        }
                    ]
                }
            ];
        }

        this.renderComments();
    }

    renderComments() {
        const commentsList = document.getElementById('comments-list');
        if (!commentsList) return;

        if (this.comments.length === 0) {
            commentsList.innerHTML = `
                <div class="no-comments">
                    <p>Be the first to share your thoughts on this topic!</p>
                </div>
            `;
            return;
        }

        commentsList.innerHTML = this.comments.map(comment => this.renderComment(comment)).join('');
        
        // Add event listeners for reply buttons
        commentsList.querySelectorAll('.comment-reply-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commentId = parseInt(btn.dataset.commentId);
                this.toggleReplyForm(commentId);
            });
        });
        
        // Add event listeners for submit reply buttons
        commentsList.querySelectorAll('.submit-reply-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commentId = parseInt(btn.dataset.commentId);
                this.submitReply(commentId);
            });
        });
        
        // Add event listeners for cancel reply buttons
        commentsList.querySelectorAll('.cancel-reply-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commentId = parseInt(btn.dataset.commentId);
                this.toggleReplyForm(commentId);
            });
        });
    }
    
    renderComment(comment, isReply = false) {
        const replies = comment.replies || [];
        const replyClass = isReply ? 'comment-reply' : 'comment';
        
        return `
            <div class="${replyClass}" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <strong class="comment-author">${comment.author}</strong>
                    <span class="comment-time">${comment.timestamp}</span>
                </div>
                <div class="comment-content">
                    <p>${comment.content}</p>
                </div>
                <div class="comment-actions">
                    <button class="comment-like-btn" onclick="forumDetail.likeComment(${comment.id})">
                        ❤️ ${comment.likes}
                    </button>
                    <button class="comment-reply-btn" data-comment-id="${comment.id}">Reply</button>
                </div>
                
                <div class="reply-form" id="reply-form-${comment.id}" style="display: none;">
                    <div class="form-group">
                        <textarea id="reply-text-${comment.id}" rows="3" placeholder="Write your reply..."></textarea>
                    </div>
                    <div class="form-group">
                        <input type="text" id="reply-author-${comment.id}" placeholder="Your name">
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn-primary btn-small submit-reply-btn" data-comment-id="${comment.id}">Submit Reply</button>
                        <button class="btn-secondary btn-small cancel-reply-btn" data-comment-id="${comment.id}">Cancel</button>
                    </div>
                </div>
                
                ${replies.length > 0 ? `
                    <div class="replies-container">
                        ${replies.map(reply => this.renderComment(reply, true)).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    toggleReplyForm(commentId) {
        const replyForm = document.getElementById(`reply-form-${commentId}`);
        if (replyForm) {
            const isVisible = replyForm.style.display !== 'none';
            replyForm.style.display = isVisible ? 'none' : 'block';
            
            // Clear form if hiding
            if (isVisible) {
                document.getElementById(`reply-text-${commentId}`).value = '';
                document.getElementById(`reply-author-${commentId}`).value = '';
            }
        }
    }
    
    submitReply(parentCommentId) {
        const replyText = document.getElementById(`reply-text-${parentCommentId}`).value.trim();
        const replyAuthor = document.getElementById(`reply-author-${parentCommentId}`).value.trim();
        
        if (!replyText || !replyAuthor) {
            alert('Please fill in both your reply and name.');
            return;
        }
        
        const newReply = {
            id: Date.now(),
            author: replyAuthor,
            content: replyText,
            timestamp: 'Just now',
            likes: 0,
            replies: []
        };
        
        // Find the parent comment and add the reply
        const parentComment = this.findComment(this.comments, parentCommentId);
        if (parentComment) {
            if (!parentComment.replies) {
                parentComment.replies = [];
            }
            parentComment.replies.push(newReply);
            
            this.saveComments();
            this.renderComments();
            this.showSuccessMessage('Your reply has been added!');
        }
    }
    
    findComment(comments, commentId) {
        const newComment = {
            id: Date.now(),
            author: commentAuthor,
            content: commentText,
            timestamp: 'Just now',
            likes: 0,
            replies: []
        };      if (found) return found;
            }
        }
        return null;
    }

    addComment() {
        const commentText = document.getElementById('comment-text').value.trim();
        const commentAuthor = document.getElementById('comment-author').value.trim();

        if (!commentText || !commentAuthor) {
            alert('Please fill in both your comment and name.');
            return;
        }

        const newComment = {
            id: Date.now(),
            author: commentAuthor,
            content: commentText,
            timestamp: 'Just now',
            likes: 0
        };

        this.comments.unshift(newComment); // Add to beginning of array
        this.saveComments();
        this.renderComments();

        // Clear the form
        document.getElementById('comment-text').value = '';
        document.getElementById('comment-author').value = '';

        // Show success message
        this.showSuccessMessage('Your comment has been added to the discussion!');
    }

    likeComment(commentId) {
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) {
            comment.likes++;
            this.saveComments();
            this.renderComments();
        }
    }

    saveComments() {
        if (this.forumData?.id) {
            localStorage.setItem(`forum-${this.forumData.id}-comments`, JSON.stringify(this.comments));
        }
    }

    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            background: #F2F49D; 
            color: #112875; 
            padding: 1rem; 
            border-radius: 8px; 
            margin: 1rem 0; 
            font-weight: 600;
            border-left: 4px solid #112875;
        `;
        successDiv.textContent = message;

        const commentForm = document.querySelector('.comment-form');
        commentForm.insertAdjacentElement('afterend', successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.forumDetail = new ForumDetail();
});