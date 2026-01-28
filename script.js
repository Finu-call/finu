document.addEventListener('DOMContentLoaded', () => {
    // --- Scroll Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .blur-in').forEach(el => {
        observer.observe(el);
    });

    // --- Navbar Scroll Effect ---
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- Hero Canvas Animation (Constellation Effect) ---
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    const particleCount = 60; // Number of nodes
    const connectionDistance = 150; // Max distance to draw line
    const mouseDistance = 200; // Mouse interaction range

    // Mouse styling
    let mouse = { x: null, y: null };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    // Handle Resize
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize(); // Initial call

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5; // Smaller, star-like
            // Cinematic Drift: Much slower speed
            this.speedX = Math.random() * 0.2 - 0.1;
            this.speedY = Math.random() * 0.2 - 0.1;
            this.opacity = Math.random() * 0.5 + 0.2; // Variable opacity
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction - gentle push
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    this.x -= dx * 0.02; // Very subtle repulsion
                    this.y -= dy * 0.02;
                }
            }

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = `rgba(0, 242, 255, ${this.opacity})`; // Cyan tint
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize Particles
    function initParticles() {
        particles = [];
        for (let i = 0; i < 150; i++) { // More particles for dense atmosphere
            particles.push(new Particle());
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Constellation Effect - thinner lines
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 242, 255, ${0.1 - distance / 1000})`; // Very faint lines
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    // --- Cinematic Parallax & Scroll Reveal ---
    // Update observer for earlier, smoother trigger
    // (Moved to top of file as it was already there)

    // Parallax Effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        // Hero Content Parallax (Moves slower than scroll)
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
            heroContent.style.opacity = 1 - (scrolled / 700);
        }

        // Background Parallax (Subtle shift of gradient positions could go here if implemented in JS, 
        // but simple element translation is smoother)
    });

    // --- 3D Tilt Effect ---
    const tiltCards = document.querySelectorAll('.project-card, .skill-card, .stat-card, .contact-item');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // --- Typing Animation ---
    const typeTarget = document.querySelector('.typewriter-text');
    if (typeTarget) {
        const phrases = ["Engineer", "Innovator", "Creator"];
        let phraseIndex = 0;
        let letterIndex = 0;
        let isDeleting = false;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typeTarget.textContent = currentPhrase.substring(0, letterIndex - 1);
                letterIndex--;
            } else {
                typeTarget.textContent = currentPhrase.substring(0, letterIndex + 1);
                letterIndex++;
            }

            let typeSpeed = isDeleting ? 100 : 200;

            if (!isDeleting && letterIndex === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && letterIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        // Start typing
        type();
    }

    // --- Magnetic Button Effect ---
    const magnetBtn = document.querySelector('.btn');
    if (magnetBtn) {
        magnetBtn.addEventListener('mousemove', (e) => {
            const rect = magnetBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Magnetic pull strength
            const strength = 0.4; // 1 = follows cursor exactly

            // Removing transition for instant follow
            magnetBtn.style.transition = 'transform 0.1s ease-out';
            magnetBtn.style.transform = `translate(${x * strength}px, ${y * strength}px) scale(1.05)`;
        });

        magnetBtn.addEventListener('mouseleave', () => {
            // Elastic snapback
            magnetBtn.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'; // smooth spring
            magnetBtn.style.transform = 'translate(0px, 0px) scale(1)';
        });
    }

    // --- Writing Animation for About Text ---
    const aboutTextContainer = document.querySelector('.about-text');

    // Function to wrap characters in spans
    function prepareTypingAnimation(element) {
        if (!element) return;

        // Helper to process nodes recursively
        function processNode(node) {
            if (node.nodeType === 3) { // Text node
                const text = node.nodeValue;
                const fragment = document.createDocumentFragment();

                for (let char of text) {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.className = 'char-hidden'; // Start hidden
                    fragment.appendChild(span);
                }
                node.parentNode.replaceChild(fragment, node);
            } else if (node.nodeType === 1) { // Element node
                Array.from(node.childNodes).forEach(processNode);
            }
        }

        // Process paragraphs within the container
        const paragraphs = element.querySelectorAll('p');
        paragraphs.forEach(p => {
            Array.from(p.childNodes).forEach(processNode);
        });
    }

    // Trigger animation
    function triggerWritingAnimation(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chars = entry.target.querySelectorAll('.char-hidden');
                let delay = 0;

                chars.forEach((char, index) => {
                    setTimeout(() => {
                        char.style.opacity = '1';
                    }, delay);
                    delay += 15; // Speed of typing
                });

                observer.unobserve(entry.target);
            }
        });
    }

    if (aboutTextContainer) {
        prepareTypingAnimation(aboutTextContainer);

        const writingObserver = new IntersectionObserver(triggerWritingAnimation, {
            threshold: 0.2
        });

        writingObserver.observe(aboutTextContainer);
    }

    // --- Contact Form Logic Removed ---
});
