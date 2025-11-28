// The Hearing Hare - Main JavaScript File
// Mental Health Through Music Platform

class HearingHare {
    constructor() {
        this.selectedGenres = new Set();
        this.selectedMood = null;
        this.userData = {
            genres: [],
            mood: null,
            moodDescription: '',
            spotifyConnected: false
        };
        this.init();
    }

    init() {
        console.log('Initializing HearingHare...');
        this.setupEventListeners();
        this.renderGenres();
        this.renderMoods();
        // Setup forum features after everything else loads
        setTimeout(() => {
            this.setupForumFeatures();
        }, 100);
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Main tab navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = link.dataset.tab;
                this.switchMainTab(tabName);
                this.updateActiveNavLink(link);
            });
        });

        // Mood recommendations
        const getRecommendationsBtn = document.getElementById('get-recommendations');
        if (getRecommendationsBtn) {
            getRecommendationsBtn.addEventListener('click', () => {
                this.getMoodRecommendations();
            });
        }
        
        // Handle hash navigation on load
        const hash = window.location.hash;
        if (hash) {
            const tabName = hash.substring(1); // Remove the #
            if (['info', 'suggestions', 'forums'].includes(tabName)) {
                setTimeout(() => {
                    this.switchMainTab(tabName);
                    const activeLink = document.querySelector(`.nav-link[data-tab="${tabName}"]`);
                    if (activeLink) this.updateActiveNavLink(activeLink);
                }, 100);
            }
        } else {
            // Default to info tab
            setTimeout(() => {
                this.switchMainTab('info');
            }, 100);
        }
    }
    
    switchMainTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show the selected tab
        const selectedTab = document.getElementById(`${tabName}-tab`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Update URL hash
        window.location.hash = tabName;
        
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Initialize forums when switching to forums tab
        if (tabName === 'forums') {
            // Use setTimeout to ensure the tab is visible before rendering
            setTimeout(() => {
                this.renderForums();
            }, 50);
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = section.offsetTop - navHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    // Genre System
    renderGenres() {
        const genres = [
            { id: 'rock', name: 'Rock', icon: '🎸', description: 'Raw energy and powerful emotions' },
            { id: 'pop', name: 'Pop', icon: '🎵', description: 'Uplifting and relatable melodies' },
            { id: 'jazz', name: 'Jazz', icon: '🎷', description: 'Smooth and contemplative rhythms' },
            { id: 'classical', name: 'Classical', icon: '🎼', description: 'Timeless compositions for focus' },
            { id: 'hip-hop', name: 'Hip Hop', icon: '🎤', description: 'Storytelling through rhythm' },
            { id: 'electronic', name: 'Electronic', icon: '🎛️', description: 'Digital soundscapes and beats' },
            { id: 'indie', name: 'Indie', icon: '🎧', description: 'Authentic and alternative sounds' },
            { id: 'folk', name: 'Folk', icon: '🪕', description: 'Acoustic stories and traditions' },
            { id: 'r&b', name: 'R&B', icon: '💫', description: 'Soulful expressions of emotion' },
            { id: 'country', name: 'Country', icon: '🤠', description: 'Heartfelt stories and values' },
            { id: 'reggae', name: 'Reggae', icon: '🌴', description: 'Peaceful vibes and unity' },
            { id: 'blues', name: 'Blues', icon: '🎺', description: 'Deep emotions and healing' }
        ];

        const genreGrid = document.getElementById('genre-grid');
        if (!genreGrid) return;

        genreGrid.innerHTML = genres.map(genre => `
            <div class="genre-card" data-genre="${genre.id}">
                <div class="genre-icon">${genre.icon}</div>
                <h3>${genre.name}</h3>
                <p>${genre.description}</p>
            </div>
        `).join('');

        // Add click handlers for genre selection
        document.querySelectorAll('.genre-card').forEach(card => {
            card.addEventListener('click', () => {
                this.toggleGenre(card);
            });
        });
    }

    toggleGenre(card) {
        const genreId = card.dataset.genre;
        
        if (this.selectedGenres.has(genreId)) {
            this.selectedGenres.delete(genreId);
            card.classList.remove('selected');
        } else {
            this.selectedGenres.add(genreId);
            card.classList.add('selected');
        }

        this.updateSelectedGenresDisplay();
    }

    updateSelectedGenresDisplay() {
        const selectedGenresContainer = document.getElementById('selected-genres');
        const genreForumsList = document.getElementById('genre-forums-list');
        
        if (!selectedGenresContainer || !genreForumsList) return;

        if (this.selectedGenres.size > 0) {
            selectedGenresContainer.style.display = 'block';
            this.showGenreForums();
        } else {
            selectedGenresContainer.style.display = 'none';
        }
    }

    removeGenre(genreId) {
        this.selectedGenres.delete(genreId);
        const card = document.querySelector(`[data-genre="${genreId}"]`);
        if (card) card.classList.remove('selected');
        this.updateSelectedGenresDisplay();
    }

    showGenreForums() {
        if (this.selectedGenres.size === 0) {
            alert('Please select at least one genre first!');
            return;
        }

        const genreForums = this.generateGenreForums(Array.from(this.selectedGenres));
        this.displayGenreForums(genreForums);
    }

    generateGenreForums(genres) {
        const forumData = {
            rock: [
                { title: 'How Rock Music Helped Me Express Anger', author: 'RockTherapy', replies: 23, genre: 'Rock' },
                { title: 'Metal Music as Emotional Release', author: 'MetalHealing', replies: 15, genre: 'Rock' },
                { title: 'Classic Rock and Nostalgia Therapy', author: 'VintageVibes', replies: 18, genre: 'Rock' }
            ],
            pop: [
                { title: 'Pop Songs That Boost Self-Confidence', author: 'PositiveVibes', replies: 31, genre: 'Pop' },
                { title: 'Taylor Swift Lyrics and Mental Health', author: 'SwiftSupport', replies: 45, genre: 'Pop' },
                { title: 'Upbeat Pop for Depression Recovery', author: 'SunshineSeeker', replies: 27, genre: 'Pop' }
            ],
            jazz: [
                { title: 'Jazz for Anxiety Relief', author: 'SmoothSounds', replies: 12, genre: 'Jazz' },
                { title: 'The Calming Power of Miles Davis', author: 'JazzTherapist', replies: 8, genre: 'Jazz' },
                { title: 'Improvisation and Mental Flexibility', author: 'FreeFormLife', replies: 14, genre: 'Jazz' }
            ],
            classical: [
                { title: 'Classical Music for Focus and ADHD', author: 'ClassicalCure', replies: 19, genre: 'Classical' },
                { title: 'Chopin Nocturnes for Insomnia', author: 'SleepSounds', replies: 22, genre: 'Classical' },
                { title: 'Orchestra Music and Emotional Processing', author: 'SymphonyHealing', replies: 16, genre: 'Classical' }
            ],
            'hip-hop': [
                { title: 'Hip-Hop Lyrics That Saved My Life', author: 'RapTherapy', replies: 38, genre: 'Hip-Hop' },
                { title: 'Kendrick Lamar and Mental Health Awareness', author: 'ConsciousRap', replies: 41, genre: 'Hip-Hop' },
                { title: 'Finding Strength in Struggle Rap', author: 'StreetWisdom', replies: 29, genre: 'Hip-Hop' }
            ],
            electronic: [
                { title: 'Ambient Electronic for Meditation', author: 'DigitalZen', replies: 11, genre: 'Electronic' },
                { title: 'EDM and Endorphin Release', author: 'BeatTherapy', replies: 25, genre: 'Electronic' },
                { title: 'Lo-Fi Hip-Hop for Study and Calm', author: 'ChillBeats', replies: 33, genre: 'Electronic' }
            ]
        };

        let forums = [];
        genres.forEach(genre => {
            if (forumData[genre]) {
                forums.push(...forumData[genre]);
            }
        });

        return forums;
    }

    displayGenreForums(forums) {
        const container = document.getElementById('genre-forums-list');
        if (!container) return;

        container.innerHTML = `
            <div class="genre-forum-grid">
                ${forums.map((forum, index) => `
                    <div class="forum-preview-card" 
                         data-forum-title="${forum.title.replace(/"/g, '&quot;')}" 
                         data-forum-author="${forum.author}" 
                         data-forum-genre="${forum.genre}" 
                         data-forum-content="A discussion about ${forum.title.toLowerCase()}" 
                         data-forum-index="${index}"> 
                        <h4>${forum.title}</h4>
                        <div class="forum-preview-meta">
                            <span class="forum-preview-genre">${forum.genre}</span>
                            <span class="forum-preview-author">by ${forum.author}</span>
                        </div>
                        <div class="forum-preview-stats">
                            💬 ${forum.replies} replies
                        </div>
                    </div>
                `).join('')}
            </div>
            <p style="margin-top: 1rem; font-size: 0.9rem; color: #6c757d; text-align: center;">
                Click on any forum to join the discussion!
            </p>
        `;

        // Add click listeners to genre forum cards
        container.querySelectorAll('.forum-preview-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const title = card.dataset.forumTitle;
                const author = card.dataset.forumAuthor;
                const genre = card.dataset.forumGenre;
                const content = card.dataset.forumContent;
                
                console.log('Opening genre forum:', { title, author, genre, content });
                this.openForum(title, author, genre, content);
            });
        });
    }

    // Mood System
    renderMoods() {
        const moods = [
            { id: 'sad', name: 'Sad', description: 'Feeling down or melancholy' },
            { id: 'anxious', name: 'Anxious', description: 'Feeling worried or nervous' },
            { id: 'happy', name: 'Happy', description: 'Feeling joyful and positive' },
            { id: 'angry', name: 'Angry', description: 'Feeling frustrated or mad' },
            { id: 'lonely', name: 'Lonely', description: 'Feeling isolated or disconnected' },
            { id: 'excited', name: 'Excited', description: 'Feeling energetic and enthusiastic' },
            { id: 'confused', name: 'Confused', description: 'Feeling uncertain or lost' },
            { id: 'peaceful', name: 'Peaceful', description: 'Feeling calm and centered' },
            { id: 'stressed', name: 'Stressed', description: 'Feeling overwhelmed' },
            { id: 'hopeful', name: 'Hopeful', description: 'Feeling optimistic about the future' }
        ];

        const moodGrid = document.getElementById('mood-grid');
        if (!moodGrid) return;

        moodGrid.innerHTML = moods.map(mood => `
            <div class="mood-card" data-mood="${mood.id}">
                <h4>${mood.name}</h4>
            </div>
        `).join('');

        // Add click handlers for mood selection
        document.querySelectorAll('.mood-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectMood(card);
            });
        });
    }

    selectMood(card) {
        // Remove previous selection
        document.querySelectorAll('.mood-card').forEach(c => c.classList.remove('selected'));
        
        // Add selection to clicked card
        card.classList.add('selected');
        this.selectedMood = card.dataset.mood;

        // Show mood details section
        const moodDetails = document.getElementById('mood-details');
        if (moodDetails) {
            moodDetails.style.display = 'block';
        }
    }

    getMoodRecommendations() {
        if (!this.selectedMood) {
            alert('Please select your mood first!');
            return;
        }

        const moodDescription = document.getElementById('mood-description').value;
        this.userData.mood = this.selectedMood;
        this.userData.moodDescription = moodDescription;

        const recommendations = this.generateMoodRecommendations(this.selectedMood);
        this.displayRecommendations(recommendations);
    }

    generateMoodRecommendations(mood) {
        const moodRecommendations = {
            sad: [
                {
                    type: 'Feel the Feeling',
                    song: 'Mad World',
                    artist: 'Gary Jules',
                    tip: 'Sometimes it\'s important to sit with sad feelings. This song validates your emotions and reminds you that you\'re not alone in feeling this way.',
                    advice: 'Allow yourself to feel sad - it\'s a natural emotion. Consider journaling or talking to someone you trust.'
                },
                {
                    type: 'Gentle Uplift',
                    song: 'Three Little Birds',
                    artist: 'Bob Marley',
                    tip: 'This gentle, reassuring song can help shift your perspective without dismissing your feelings.',
                    advice: 'Try gentle self-care activities like taking a warm bath, drinking tea, or going for a short walk.'
                },
                {
                    type: 'Cathartic Release',
                    song: 'Hurt',
                    artist: 'Johnny Cash',
                    tip: 'Sometimes we need music that honors our pain while reminding us of our resilience.',
                    advice: 'If sadness persists for weeks, consider reaching out to a mental health professional.'
                }
            ],
            anxious: [
                {
                    type: 'Calming',
                    song: 'Weightless',
                    artist: 'Marconi Union',
                    tip: 'This song was scientifically designed to reduce anxiety by 65%. It can help slow your heart rate and calm your mind.',
                    advice: 'Practice deep breathing: inhale for 4 counts, hold for 7, exhale for 8. Repeat this cycle.'
                },
                {
                    type: 'Grounding',
                    song: 'Breathe',
                    artist: 'Pink Floyd',
                    tip: 'Focus on the rhythm and let it guide your breathing pattern.',
                    advice: 'Try the 5-4-3-2-1 technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.'
                },
                {
                    type: 'Empowerment',
                    song: 'Stronger',
                    artist: 'Kelly Clarkson',
                    tip: 'Remind yourself of your inner strength and past resilience.',
                    advice: 'Write down three things you\'ve overcome before. You\'re stronger than you think.'
                }
            ],
            happy: [
                {
                    type: 'Amplify Joy',
                    song: 'Good as Hell',
                    artist: 'Lizzo',
                    tip: 'Celebrate your good mood! This empowering anthem will boost your confidence.',
                    advice: 'Share your joy with others - call a friend, help someone, or simply smile at strangers.'
                },
                {
                    type: 'Grateful Reflection',
                    song: 'What a Wonderful World',
                    artist: 'Louis Armstrong',
                    tip: 'Use this moment to appreciate the beauty around you.',
                    advice: 'Write down three things you\'re grateful for today to anchor this positive feeling.'
                }
            ],
            lonely: [
                {
                    type: 'Connection',
                    song: 'You\'ve Got a Friend',
                    artist: 'Carole King',
                    tip: 'This song reminds you that connection is possible and that you matter to others.',
                    advice: 'Reach out to one person today - even a simple text can help you feel more connected.'
                },
                {
                    type: 'Self-Compassion',
                    song: 'Lean on Me',
                    artist: 'Bill Withers',
                    tip: 'Remember that everyone needs support sometimes, and it\'s okay to ask for help.',
                    advice: 'Consider joining a community group, online forum, or volunteering - helping others often helps us feel less alone.'
                }
            ]
        };

        return moodRecommendations[mood] || [
            {
                type: 'General Support',
                song: 'Here Comes the Sun',
                artist: 'The Beatles',
                tip: 'Music has the power to shift our emotional state. This classic reminds us that difficult times pass.',
                advice: 'Remember that feelings are temporary. Be gentle with yourself and consider what small action might help you feel better.'
            }
        ];
    }

    displayRecommendations(recommendations) {
        const recommendationsContainer = document.getElementById('recommendations');
        if (!recommendationsContainer) return;

        recommendationsContainer.innerHTML = `
            <h3>Your Personalized Recommendations</h3>
            <p style="margin-bottom: 1.5rem; color: #6c757d;">Based on how you're feeling right now, here are some songs that might help, along with mental health tips:</p>
            ${recommendations.map(rec => `
                <div class="recommendation-card">
                    <div class="recommendation-type">${rec.type}</div>
                    <div class="song-info">
                        <h4>"${rec.song}"</h4>
                        <p>by ${rec.artist}</p>
                        <p>${rec.tip}</p>
                    </div>
                    <div class="mental-health-tip">
                        <h5>💡 Mental Health Tip</h5>
                        <p>${rec.advice}</p>
                    </div>
                </div>
            `).join('')}
            <div style="margin-top: 1.5rem; padding: 1rem; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #28a745;">
                <h5 style="color: #28a745; margin-bottom: 0.5rem;">🌟 Remember</h5>
                <p style="margin: 0; font-size: 0.9rem;">If you're experiencing persistent mental health challenges, please consider reaching out to a mental health professional. You deserve support and care.</p>
            </div>
        `;

        recommendationsContainer.style.display = 'block';
    }

    // Forum System
    renderForums() {
        console.log('renderForums called');
        const forumContent = document.getElementById('forum-content');
        console.log('Forum content element:', forumContent);
        if (forumContent) {
            console.log('Forum content parent visibility:', window.getComputedStyle(forumContent.parentElement).display);
        }
        this.switchForumTab('recent');
    }

    switchForumTab(tabId) {
        console.log('Switching to forum tab:', tabId);
        
        const forumContent = document.getElementById('forum-content');
        if (!forumContent) {
            console.error('Forum content container not found');
            return;
        }
        
        console.log('Forum content container found:', forumContent);

        switch (tabId) {
            case 'recent':
                this.renderRecentDiscussions(forumContent);
                break;
            case 'genres':
                this.renderGenreForums(forumContent);
                break;
            case 'trending':
                this.renderTrendingTopics(forumContent);
                break;
            default:
                console.warn('Unknown tab:', tabId);
                this.renderRecentDiscussions(forumContent);
        }
        
        console.log('Forum content rendered');
    }

    renderRecentDiscussions(container) {
        const discussions = [
            {
                title: "How 'Mad World' helped me understand my depression",
                author: "MusicHealer23",
                time: "2 hours ago",
                genre: "Alternative",
                content: "I never really understood what I was feeling until I heard this song. The lyrics 'I find it hard to tell you, I find it hard to take' really resonated with how difficult it is to communicate when you're depressed...",
                replies: 12,
                likes: 34
            },
            {
                title: "The healing power of Lofi Hip-Hop during anxiety attacks",
                author: "CalmVibes",
                time: "4 hours ago",
                genre: "Hip-Hop",
                content: "When I'm having an anxiety attack, I put on lo-fi hip-hop and focus on the repetitive beats. It helps ground me and slows down my racing thoughts. Anyone else find rhythm helpful for anxiety?",
                replies: 8,
                likes: 23
            },
            {
                title: "Bob Marley's 'Three Little Birds' - A daily reminder",
                author: "SunshineSeeker",
                time: "1 day ago",
                genre: "Reggae",
                content: "Every morning when I wake up feeling overwhelmed, I play this song. 'Don't worry about a thing, 'cause every little thing gonna be alright' has become my daily mantra...",
                replies: 18,
                likes: 45
            }
        ];

        this.renderForumPosts(container, discussions);
    }

    renderGenreForums(container) {
        const genreData = {
            rock: {
                title: "Rock Music for Mental Health",
                description: "Discuss how rock music helps with emotional expression and release",
                posts: 156,
                members: 1240,
                forumPosts: [
                    { title: 'How Rock Music Helped Me Express Anger', author: 'RockTherapy', time: '3 hours ago', genre: 'Rock', content: 'Rock music gave me a safe outlet to channel my frustration and anger. The raw energy and powerful lyrics help me process emotions I struggle to verbalize...', replies: 23, likes: 45 },
                    { title: 'Metal Music as Emotional Release', author: 'MetalHealing', time: '1 day ago', genre: 'Rock', content: 'When everything feels too much, metal music becomes my therapy. The intensity matches my internal chaos and helps me find clarity...', replies: 15, likes: 32 },
                    { title: 'Classic Rock and Nostalgia Therapy', author: 'VintageVibes', time: '2 days ago', genre: 'Rock', content: 'Classic rock brings me back to simpler times and helps me cope with anxiety. Songs from the 70s and 80s have this healing quality...', replies: 18, likes: 38 }
                ]
            },
            classical: {
                title: "Classical Music & Meditation",
                description: "Share how classical music aids in mindfulness and focus",
                posts: 89,
                members: 890,
                forumPosts: [
                    { title: 'Classical Music for Focus and ADHD', author: 'ClassicalCure', time: '5 hours ago', genre: 'Classical', content: 'I have ADHD and classical music, especially baroque period pieces, helps me concentrate and stay productive without medication side effects...', replies: 19, likes: 41 },
                    { title: 'Chopin Nocturnes for Insomnia', author: 'SleepSounds', time: '12 hours ago', genre: 'Classical', content: 'Playing Chopin before bed has transformed my sleep routine. The gentle melodies calm my racing thoughts and prepare me for rest...', replies: 22, likes: 36 },
                    { title: 'Orchestra Music and Emotional Processing', author: 'SymphonyHealing', time: '1 day ago', genre: 'Classical', content: 'The complexity of orchestral pieces helps me process complex emotions. Each instrument represents a different feeling coming together...', replies: 16, likes: 29 }
                ]
            },
            'hip-hop': {
                title: "Hip-Hop Healing",
                description: "Explore storytelling and empowerment in hip-hop",
                posts: 203,
                members: 1580,
                forumPosts: [
                    { title: 'Hip-Hop Lyrics That Saved My Life', author: 'RapTherapy', time: '2 hours ago', genre: 'Hip-Hop', content: 'Hip-hop taught me to tell my story. Artists like J. Cole and Kendrick helped me understand I wasn\'t alone in my struggles...', replies: 38, likes: 67 },
                    { title: 'Kendrick Lamar and Mental Health Awareness', author: 'ConsciousRap', time: '8 hours ago', genre: 'Hip-Hop', content: 'Kendrick\'s openness about mental health in his music made it okay for me to talk about mine. His authenticity is healing...', replies: 41, likes: 72 },
                    { title: 'Finding Strength in Struggle Rap', author: 'StreetWisdom', time: '1 day ago', genre: 'Hip-Hop', content: 'Hearing rappers talk about overcoming adversity gives me strength to face my own battles. The raw honesty in hip-hop is therapeutic...', replies: 29, likes: 54 }
                ]
            },
            folk: {
                title: "Indie Folk Feelings",
                description: "Connect through intimate and emotional indie folk music",
                posts: 124,
                members: 950,
                forumPosts: [
                    { title: 'Acoustic Melodies for Depression', author: 'FolkHearts', time: '6 hours ago', genre: 'Folk', content: 'The simplicity of folk music helps when I\'m overwhelmed. Just a guitar and honest lyrics feel like a conversation with a friend...', replies: 17, likes: 33 },
                    { title: 'Indie Artists Who Understand Anxiety', author: 'IndieSoul', time: '14 hours ago', genre: 'Folk', content: 'Artists like Bon Iver and Phoebe Bridgers capture anxiety in ways that make me feel seen and understood. Their vulnerability is comforting...', replies: 24, likes: 48 },
                    { title: 'Folk Music and Self-Reflection', author: 'ReflectiveMinds', time: '2 days ago', genre: 'Folk', content: 'Folk music encourages introspection. The storytelling aspect helps me process my own life story and find meaning in difficult times...', replies: 19, likes: 37 }
                ]
            }
        };

        const genreList = Object.keys(genreData);
        
        container.innerHTML = `
            <div class="genre-forums">
                ${genreList.map(genreKey => {
                    const forum = genreData[genreKey];
                    return `
                        <div class="forum-post">
                            <div class="forum-post-header">
                                <div>
                                    <h3 class="forum-post-title">${forum.title}</h3>
                                    <p style="margin: 0; color: #6c757d;">${forum.description}</p>
                                </div>
                            </div>
                            <div class="forum-post-content">
                                <div style="display: flex; gap: 2rem; font-size: 0.9rem; color: #6c757d;">
                                    <span>📝 ${forum.posts} posts</span>
                                    <span>👥 ${forum.members} members</span>
                                </div>
                            </div>
                            <div class="forum-post-actions">
                                <a href="javascript:void(0)" class="view-genre-posts" data-genre="${genreKey}">View Latest Posts</a>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        // Add click handlers for "View Latest Posts" links
        container.querySelectorAll('.view-genre-posts').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const genre = link.dataset.genre;
                this.showGenreSpecificPosts(container, genreData[genre]);
            });
        });
    }
    
    showGenreSpecificPosts(container, genreInfo) {
        // Render the posts for this specific genre
        this.renderForumPosts(container, genreInfo.forumPosts);
        
        // Add a back button
        const backButton = document.createElement('div');
        backButton.style.cssText = 'margin-bottom: 1rem;';
        backButton.innerHTML = `
            <button class="btn-secondary" id="back-to-genres" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                ← Back to All Genres
            </button>
        `;
        container.insertBefore(backButton, container.firstChild);
        
        // Add click handler for back button
        document.getElementById('back-to-genres').addEventListener('click', () => {
            this.renderGenreForums(container);
        });
    }

    renderTrendingTopics(container) {
        const trending = [
            {
                title: "Mental Health Benefits of Music Therapy",
                author: "TherapyNotes",
                time: "6 hours ago",
                genre: "Discussion",
                content: "Research shows that music therapy can significantly improve symptoms of depression and anxiety. Let's discuss our personal experiences with how music has helped our mental health journeys...",
                replies: 45,
                likes: 89
            },
            {
                title: "Creating playlists for different emotions",
                author: "PlaylistCurator",
                time: "12 hours ago",
                genre: "Resources",
                content: "I've been creating mood-specific playlists and wanted to share my approach. For sadness, I start with songs that match the feeling, then gradually shift toward hope...",
                replies: 67,
                likes: 134
            }
        ];

        this.renderForumPosts(container, trending);
    }

    renderForumPosts(container, posts) {
        container.innerHTML = posts.map((post, index) => `
            <div class="forum-post" data-forum-index="${index}">
                <div class="forum-post-header">
                    <div>
                        <h3 class="forum-post-title clickable-title" 
                            data-forum-title="${post.title.replace(/"/g, '&quot;')}"
                            data-forum-author="${post.author}"
                            data-forum-genre="${post.genre}"
                            data-forum-content="${(post.content || 'Join the discussion about this topic and share your experiences with music and mental health.').replace(/"/g, '&quot;')}">${post.title}</h3>
                        <div class="forum-post-meta">
                            by ${post.author} • ${post.time}
                        </div>
                    </div>
                    <span class="forum-post-genre">${post.genre}</span>
                </div>
                <div class="forum-post-content">
                    ${post.content || 'Click the title to join this discussion and share your experiences.'}
                </div>
                <div class="forum-post-actions">
                    <a href="javascript:void(0)" class="forum-reply-link"
                       data-forum-title="${post.title.replace(/"/g, '&quot;')}"
                       data-forum-author="${post.author}"
                       data-forum-genre="${post.genre}"
                       data-forum-content="${(post.content || 'Join the discussion about this topic and share your experiences with music and mental health.').replace(/"/g, '&quot;')}">💬 ${post.replies} replies</a>
                    <a href="javascript:void(0)">❤️ ${post.likes} likes</a>
                    <a href="javascript:void(0)">Share</a>
                    <a href="javascript:void(0)">Save</a>
                </div>
            </div>
        `).join('');
        
        // Add event listeners after rendering
        const titles = container.querySelectorAll('.clickable-title');
        const replyLinks = container.querySelectorAll('.forum-reply-link');
        
        titles.forEach(title => {
            title.addEventListener('click', (e) => {
                e.preventDefault();
                const forumTitle = title.dataset.forumTitle;
                const forumAuthor = title.dataset.forumAuthor;
                const forumGenre = title.dataset.forumGenre;
                const forumContent = title.dataset.forumContent;
                
                console.log('Forum title clicked:', { forumTitle, forumAuthor, forumGenre, forumContent });
                this.openForum(forumTitle, forumAuthor, forumGenre, forumContent);
            });
        });
        
        replyLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const forumTitle = link.dataset.forumTitle;
                const forumAuthor = link.dataset.forumAuthor;
                const forumGenre = link.dataset.forumGenre;
                const forumContent = link.dataset.forumContent;
                
                console.log('Forum reply link clicked:', { forumTitle, forumAuthor, forumGenre, forumContent });
                this.openForum(forumTitle, forumAuthor, forumGenre, forumContent);
            });
        });
    }

    openForum(title, author, genre, content) {
        console.log('openForum called with:', { title, author, genre, content });
        
        // Store forum data for the detail page
        localStorage.setItem('currentForumTitle', title);
        localStorage.setItem('currentForumAuthor', author);
        localStorage.setItem('currentForumGenre', genre);
        localStorage.setItem('currentForumContent', content);
        localStorage.setItem('currentForumId', title.replace(/\s+/g, '-').toLowerCase());
        
        console.log('Navigating to forum detail page...');
        
        // Navigate to forum detail page
        const url = `pages/forum-detail.html?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&genre=${encodeURIComponent(genre)}&content=${encodeURIComponent(content)}`;
        console.log('URL:', url);
        
        window.location.href = url;
    }

    // Forum Creation and Discussion Features
    setupForumFeatures() {
        console.log('Setting up forum features...');
        
        // Simple create forum button handler
        const createBtn = document.getElementById('create-forum-btn');
        const formDiv = document.getElementById('forum-creation-form');
        
        if (createBtn && formDiv) {
            createBtn.onclick = function() {
                console.log('Create forum button clicked');
                if (formDiv.style.display === 'none' || formDiv.style.display === '') {
                    formDiv.style.display = 'block';
                    createBtn.textContent = 'Hide Form';
                } else {
                    formDiv.style.display = 'none';
                    createBtn.textContent = 'Create New Forum';
                }
            };
            console.log('Create forum button setup complete');
        } else {
            console.error('Create forum button or form not found');
        }
        
        // Simple submit button handler
        const submitBtn = document.getElementById('submit-forum');
        if (submitBtn) {
            submitBtn.onclick = () => {
                console.log('Submit button clicked');
                this.createNewForum();
            };
        }
        
        // Simple cancel button handler
        const cancelBtn = document.getElementById('cancel-forum');
        if (cancelBtn && formDiv && createBtn) {
            cancelBtn.onclick = function() {
                console.log('Cancel button clicked');
                formDiv.style.display = 'none';
                createBtn.textContent = 'Create New Forum';
            };
        }
        
        // Setup forum tabs with simple onclick handlers
        const tabs = document.querySelectorAll('.forum-tab');
        tabs.forEach(tab => {
            tab.onclick = (e) => {
                console.log('Tab clicked:', tab.dataset.tab);
                // Remove active from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active to clicked tab
                tab.classList.add('active');
                // Switch content
                this.switchForumTab(tab.dataset.tab);
            };
        });
        
        console.log('Forum features setup complete');
    }

    createNewForum() {
        const title = document.getElementById('forum-title').value;
        const genre = document.getElementById('forum-genre').value;
        const description = document.getElementById('forum-description').value;
        const author = document.getElementById('forum-author').value;

        if (!title || !genre || !description || !author) {
            alert('Please fill in all fields to create a forum.');
            return;
        }

        const newForum = {
            title: title,
            author: author,
            time: 'Just now',
            genre: genre.charAt(0).toUpperCase() + genre.slice(1),
            content: description,
            replies: 0,
            likes: 0,
            isUserCreated: true
        };

        this.addForumToList(newForum);
        this.clearForumForm();
        document.getElementById('forum-creation-form').classList.remove('active');
        document.getElementById('create-forum-btn').textContent = 'Create New Forum';
        
        alert('Your forum has been created! Thank you for contributing to the community.');
    }

    addForumToList(forum) {
        const forumContent = document.getElementById('forum-content');
        const forumHtml = `
            <div class="forum-post ${forum.isUserCreated ? 'user-post' : ''}">
                <div class="forum-post-header">
                    <div>
                        <h3 class="forum-post-title">${forum.title}
                            ${forum.isUserCreated ? '<span class="post-badge">Your Post</span>' : ''}
                        </h3>
                        <div class="forum-post-meta">
                            by ${forum.author} • ${forum.time}
                        </div>
                    </div>
                    <span class="forum-post-genre">${forum.genre}</span>
                </div>
                <div class="forum-post-content">
                    ${forum.content}
                </div>
                <div class="forum-post-actions">
                    <a href="javascript:void(0)" onclick="hearingHare.addDiscussion(this)">💬 Add to Discussion</a>
                    <a href="javascript:void(0)">❤️ ${forum.likes} likes</a>
                    <a href="javascript:void(0)">Share</a>
                    <a href="javascript:void(0)">Save</a>
                </div>
                <div class="add-discussion-form">
                    <div class="form-group">
                        <label>Add to this discussion:</label>
                        <textarea rows="3" placeholder="Share how this topic relates to your experience with music and mental health..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Your name:</label>
                        <input type="text" placeholder="How would you like to be known?">
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button class="discussion-btn" onclick="hearingHare.submitDiscussion(this)">Add Comment</button>
                        <button class="discussion-btn" onclick="hearingHare.cancelDiscussion(this)">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        forumContent.insertAdjacentHTML('afterbegin', forumHtml);
    }

    addDiscussion(element) {
        // Prevent any default behavior
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        const forumPost = element.closest('.forum-post');
        const discussionForm = forumPost.querySelector('.add-discussion-form');
        discussionForm.classList.toggle('active');
        
        element.textContent = discussionForm.classList.contains('active') ? 
            '💬 Hide Discussion Form' : '💬 Add to Discussion';
        
        return false; // Prevent any navigation
    }

    submitDiscussion(element) {
        // Prevent any default behavior
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        const form = element.closest('.add-discussion-form');
        const textarea = form.querySelector('textarea');
        const nameInput = form.querySelector('input');
        
        if (!textarea.value.trim() || !nameInput.value.trim()) {
            alert('Please fill in both your comment and name.');
            return false;
        }
        
        // Add the discussion comment (in a real app, this would be saved to a database)
        const forumPost = form.closest('.forum-post');
        const actionsDiv = forumPost.querySelector('.forum-post-actions');
        const replyCount = actionsDiv.querySelector('a');
        const currentReplies = parseInt(replyCount.textContent.match(/\d+/)?.[0] || '0');
        replyCount.textContent = `💬 ${currentReplies + 1} replies`;
        
        // Create a visual indicator that the comment was added
        const commentIndicator = document.createElement('div');
        commentIndicator.style.cssText = 'background: #F2F49D; padding: 0.5rem; border-radius: 4px; margin-top: 1rem; font-size: 0.9rem;';
        commentIndicator.innerHTML = `✅ <strong>${nameInput.value}</strong> added: "${textarea.value.substring(0, 50)}${textarea.value.length > 50 ? '...' : ''}" <em>(Comment added publicly)</em>`;
        
        form.insertAdjacentElement('beforebegin', commentIndicator);
        
        // Clear form and hide it
        textarea.value = '';
        nameInput.value = '';
        form.classList.remove('active');
        
        const addButton = forumPost.querySelector('.forum-post-actions a');
        addButton.textContent = '💬 Add to Discussion';
        
        alert('Your comment has been added to the discussion and is now public for everyone to see!');
        
        return false; // Prevent any navigation
    }

    cancelDiscussion(element) {
        // Prevent any default behavior
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        const form = element.closest('.add-discussion-form');
        const forumPost = form.closest('.forum-post');
        
        form.classList.remove('active');
        form.querySelector('textarea').value = '';
        form.querySelector('input').value = '';
        
        const addButton = forumPost.querySelector('.forum-post-actions a');
        addButton.textContent = '💬 Add to Discussion';
        
        return false; // Prevent any navigation
    }

    clearForumForm() {
        document.getElementById('forum-title').value = '';
        document.getElementById('forum-genre').value = '';
        document.getElementById('forum-description').value = '';
        document.getElementById('forum-author').value = '';
    }
}

// Utility Functions
function scrollToSection(sectionId) {
    if (window.hearingHare) {
        window.hearingHare.scrollToSection(sectionId);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Hearing Hare...');
    
    // Create the instance
    window.hearingHare = new HearingHare();
    
    console.log('HearingHare initialized successfully');
});

// Add CSS for artist suggestions
const style = document.createElement('style');
style.textContent = `
    .artist-suggestions {
        margin-top: 1.5rem;
        padding: 1rem;
        background-color: white;
        border-radius: 8px;
        border: 1px solid #e9ecef;
    }
    
    .artist-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .artist-tag {
        background-color: #112875;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: transform 0.2s ease;
    }
    
    .artist-tag:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(style);