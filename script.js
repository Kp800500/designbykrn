/* ==========================================================================
   DESIGN BY KRN - INTERACTIVE LOGIC & INTERACTION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ----------------------------------------------------
    // 1. Custom Cursor Trailer Physics
    // ----------------------------------------------------
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    const speed = 0.15; // Smooth interpolation speed factor (spring physics)
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isMoving) {
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
            isMoving = true;
        }
    });

    function animateCursor() {
        // Interpolate outline cursor position for spring-delay effect
        const dx = mouseX - outlineX;
        const dy = mouseY - outlineY;
        
        outlineX += dx * speed;
        outlineY += dy * speed;
        
        cursorDot.style.transform = `translate(-50%, -50%) translate3d(${mouseX}px, ${mouseY}px, 0)`;
        cursorOutline.style.transform = `translate(-50%, -50%) translate3d(${outlineX}px, ${outlineY}px, 0)`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor Hover Interactions
    const hoverElements = document.querySelectorAll('a, button, .btn, .portfolio-item, .filter-btn, select, input, textarea');
    hoverElements.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(6, 182, 212, 0.1)';
            cursorOutline.style.borderColor = 'var(--color-secondary)';
        });
        elem.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '32px';
            cursorOutline.style.height = '32px';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.borderColor = 'var(--color-primary)';
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
        isMoving = false;
    });

    // ----------------------------------------------------
    // 2. Floating Navbar Scroll Effect & Active Sections
    // ----------------------------------------------------
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Scrolled header background transition
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link tracking on scroll
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 150) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------
    // 3. Mobile Navigation Menu Toggle
    // ----------------------------------------------------
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            const icon = menuToggle.querySelector('i');
            if (mobileNav.classList.contains('open')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });

        // Close mobile nav on links clicked
        const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-nav .btn');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                menuToggle.querySelector('i').setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    // ----------------------------------------------------
    // 4. Scroll Reveal Animations (Intersection Observer)
    // ----------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(elem => revealObserver.observe(elem));

    // ----------------------------------------------------
    // 5. Portfolio Grid Filter Engine
    // ----------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Set active class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Hide with animations
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                    // Add subtle scale animation trigger
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.92)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 350);
                }
            });
        });
    });

    // ----------------------------------------------------
    // 6. Interactive Modal Lightbox with Mock Video Player
    // ----------------------------------------------------
    const projectData = {
        1: {
            title: "Ethereal Peaks - Travel Reel",
            category: "Video Editing",
            desc: "A majestic wanderlust travel reel composed of high-altitude drone captures and atmospheric transitions. Focuses heavily on creative visual flow editing, natural color grading matching, and cinematic sound effect design.",
            client: "Peak Productions Ltd",
            tools: "Adobe Premiere Pro, After Effects, DaVinci Resolve",
            thumb: "assets/video-thumb-1.png",
            mediaType: "video",
            duration: 45 // seconds
        },
        2: {
            title: "Neon Pulse - Gaming Montage",
            category: "Video Editing",
            desc: "A high-octane gaming clip montage synced perfectly with heavy electronic bass beats. Employs advanced motion tracking overlays, simulated glitch filters, slow-motion beat framing, and digital asset transitions.",
            client: "Chronos Esports League",
            tools: "Premiere Pro, After Effects, Audition",
            thumb: "assets/video-thumb-2.png",
            mediaType: "video",
            duration: 30
        },
        3: {
            title: "Vertex Tech - Brand Launch Promo",
            category: "Video Editing",
            desc: "Clean commercial teaser showcasing next-generation tech products. Focuses on premium luxury reflections, precise minimal cutting layout, corporate voiceover leveling, and custom kinetic typography animations.",
            client: "Vertex Systems Corp",
            tools: "Premiere Pro, After Effects, Illustrator",
            thumb: "assets/video-thumb-3.png",
            mediaType: "video",
            duration: 60
        },
        4: {
            title: "Aether Luxury Brand Kit",
            category: "Graphic Design",
            desc: "High-end corporate identity guidelines and stationery presentation. Built using clean geometric grids, subtle dark textures, gold vector elements, and premium custom packaging mockups.",
            client: "Aether Luxury Premium",
            tools: "Adobe Illustrator, Photoshop, InDesign",
            thumb: "assets/design-img-1.png",
            mediaType: "image"
        },
        5: {
            title: "Retro Outrun Poster Series",
            category: "Graphic Design",
            desc: "Vintage synthwave-inspired key art illustration showcasing a cyberpunk futuristic city environment. Focuses on sharp custom neon outlines, gradient maps, and custom retro typography treatments.",
            client: "Synthwave Beats Records",
            tools: "Adobe Photoshop, Illustrator",
            thumb: "assets/design-img-2.png",
            mediaType: "image"
        },
        6: {
            title: "AeroSync Mobile Dashboard UI",
            category: "Graphic Design",
            desc: "Elite high-fidelity mobile application user interface layout. Implements state-of-the-art dark mode design principles, vibrant purple line graph panels, customizable stats cards, and modern dashboard navigation grids.",
            client: "AeroSync Mobile App Inc",
            tools: "Figma, Adobe Illustrator",
            thumb: "assets/design-img-3.png",
            mediaType: "image"
        }
    };

    const lightbox = document.getElementById('lightboxModal');
    const lightboxClose = document.getElementById('lightboxCloseBtn');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const mediaWrapper = document.getElementById('lightboxMediaWrapper');
    
    const detailsCategory = document.getElementById('lightboxCategory');
    const detailsTitle = document.getElementById('lightboxTitle');
    const detailsDesc = document.getElementById('lightboxDesc');
    const detailsClient = document.getElementById('lightboxClient');
    const detailsTools = document.getElementById('lightboxTools');

    let videoTimer = null;
    let videoIsPlaying = false;
    let videoElapsedTime = 0;

    // Open Lightbox Event Handler
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.getAttribute('data-project-id');
            const data = projectData[projectId];
            
            if (!data) return;

            // Reset media container
            mediaWrapper.innerHTML = '';
            
            // Build media element
            if (data.mediaType === 'video') {
                // Generate simulated interactive video player
                mediaWrapper.innerHTML = `
                    <div class="mock-player" id="mockPlayer" style="background-image: url('${data.thumb}');">
                        <div class="player-overlay" id="playerOverlay">
                            <button class="player-big-play" id="playerPlayBtn">
                                <i data-lucide="play" id="playIconBig"></i>
                            </button>
                        </div>
                        <div class="player-controls">
                            <div class="player-timeline-wrapper" id="playerTimeline">
                                <div class="player-timeline-progress" id="playerProgress" style="width: 0%;"></div>
                            </div>
                            <div class="player-buttons-row">
                                <div class="player-left-group">
                                    <button class="player-btn-icon" id="playerControlsPlayBtn">
                                        <i data-lucide="play" id="playIconSmall"></i>
                                    </button>
                                    <span class="player-time" id="playerTime">0:00 / 0:${data.duration < 10 ? '0' + data.duration : data.duration}</span>
                                </div>
                                <div class="player-right-group">
                                    <button class="player-btn-icon"><i data-lucide="volume-2"></i></button>
                                    <button class="player-btn-icon"><i data-lucide="maximize"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                lucide.createIcons();
                initVideoControls(data.duration);
            } else {
                // Generate high-res image layout
                mediaWrapper.innerHTML = `<img src="${data.thumb}" alt="${data.title}">`;
            }

            // Populate metadata description
            detailsCategory.textContent = data.category;
            detailsTitle.textContent = data.title;
            detailsDesc.textContent = data.desc;
            detailsClient.textContent = data.client;
            detailsTools.textContent = data.tools;

            // Add lightbox classes
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden'; // Lock main scroll
        });
    });

    // Simulated Video Controls Logic
    function initVideoControls(duration) {
        const playerOverlay = document.getElementById('playerOverlay');
        const bigPlayBtn = document.getElementById('playerPlayBtn');
        const smallPlayBtn = document.getElementById('playerControlsPlayBtn');
        const playIconBig = document.getElementById('playIconBig');
        const playIconSmall = document.getElementById('playIconSmall');
        const progressIndicator = document.getElementById('playerProgress');
        const timeDisplay = document.getElementById('playerTime');
        const timeline = document.getElementById('playerTimeline');

        videoIsPlaying = false;
        videoElapsedTime = 0;

        function toggleVideoPlay() {
            if (videoIsPlaying) {
                // Pause simulation
                videoIsPlaying = false;
                clearInterval(videoTimer);
                playerOverlay.classList.remove('playing');
                playIconBig.setAttribute('data-lucide', 'play');
                playIconSmall.setAttribute('data-lucide', 'play');
            } else {
                // Play simulation
                videoIsPlaying = true;
                playerOverlay.classList.add('playing');
                playIconBig.setAttribute('data-lucide', 'pause');
                playIconSmall.setAttribute('data-lucide', 'pause');

                videoTimer = setInterval(() => {
                    videoElapsedTime += 1;
                    if (videoElapsedTime > duration) {
                        videoElapsedTime = 0; // Loop simulation
                    }
                    
                    const progressPercent = (videoElapsedTime / duration) * 100;
                    progressIndicator.style.width = `${progressPercent}%`;
                    
                    const elapsedMin = Math.floor(videoElapsedTime / 60);
                    const elapsedSec = videoElapsedTime % 60;
                    const formatSec = elapsedSec < 10 ? '0' + elapsedSec : elapsedSec;
                    const totalSec = duration % 60;
                    
                    timeDisplay.textContent = `${elapsedMin}:${formatSec} / 0:${totalSec < 10 ? '0' + totalSec : totalSec}`;
                }, 1000);
            }
            lucide.createIcons();
        }

        bigPlayBtn.addEventListener('click', toggleVideoPlay);
        smallPlayBtn.addEventListener('click', toggleVideoPlay);

        // Timeline clicks trigger progress adjustments
        timeline.addEventListener('click', (e) => {
            const rect = timeline.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const timelineWidth = rect.width;
            const newPercentage = clickX / timelineWidth;
            
            videoElapsedTime = Math.floor(newPercentage * duration);
            progressIndicator.style.width = `${newPercentage * 100}%`;
            
            const elapsedMin = Math.floor(videoElapsedTime / 60);
            const elapsedSec = videoElapsedTime % 60;
            const formatSec = elapsedSec < 10 ? '0' + elapsedSec : elapsedSec;
            const totalSec = duration % 60;
            timeDisplay.textContent = `${elapsedMin}:${formatSec} / 0:${totalSec < 10 ? '0' + totalSec : totalSec}`;
        });
    }

    // Close Lightbox function
    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = ''; // Unlock scroll
        
        // Stop simulated players
        clearInterval(videoTimer);
        videoIsPlaying = false;
        videoElapsedTime = 0;
        mediaWrapper.innerHTML = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // ----------------------------------------------------
    // 7. Lead Generation Form Submission Handler
    // ----------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('formSubmitBtn');
    const statusMsg = document.getElementById('formMessageStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Set sending status state
            submitBtn.disabled = true;
            const submitSpan = submitBtn.querySelector('span');
            const submitIcon = submitBtn.querySelector('i');
            
            submitSpan.textContent = 'Submitting Proposal...';
            submitIcon.setAttribute('data-lucide', 'loader-2');
            submitIcon.classList.add('spin-loader'); // CSS can rotate this
            lucide.createIcons();

            // Simulate server network latency
            setTimeout(() => {
                contactForm.reset();
                submitBtn.disabled = false;
                submitSpan.textContent = 'Send Proposal';
                submitIcon.setAttribute('data-lucide', 'send');
                submitIcon.classList.remove('spin-loader');
                lucide.createIcons();

                statusMsg.textContent = '🟢 Vision Brief Received! KRN will follow up in 24 hours.';
                statusMsg.className = 'form-message success';
                
                // Clear state message after delay
                setTimeout(() => {
                    statusMsg.textContent = '';
                }, 6000);
            }, 1800);
        });
    }
});
