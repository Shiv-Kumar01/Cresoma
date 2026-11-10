import { useEffect } from 'react';

function useDomEffects() {

    useEffect(() => {
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

        const handleScrollClick = (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        };

        navLinks.forEach(link => {
            link.addEventListener('click', handleScrollClick);
        });

        return () => {
            navLinks.forEach(link => {
                link.removeEventListener('click', handleScrollClick);
            });
        };
    }, []);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        const featureCards = document.querySelectorAll('.feature-card');

        featureCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });

        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const initialLoadTimer = setTimeout(() => {

            const titleLines = document.querySelectorAll('.title-line');
            const intervals = [];

            titleLines.forEach((line, index) => {
                const text = line.textContent.trim();

                if (text.length === 0) return;

                line.textContent = '';

                const delay = index * 1000;

                const typingTimeoutId = setTimeout(() => {
                    let i = 0;
                    const typeInterval = setInterval(() => {
                        if (i < text.length) {
                            line.textContent += text[i];
                            i++;
                        } else {
                            clearInterval(typeInterval);
                        }
                    }, 100);

                    intervals.push(typeInterval);
                }, delay);

                intervals.push(typingTimeoutId);
            });

            return () => {
                intervals.forEach(id => {
                    clearInterval(id);
                    clearTimeout(id);
                });
            };

        }, 50);

        return () => clearTimeout(initialLoadTimer);
    }, []);

    useEffect(() => {
        const bird = document.querySelector('.bird');
        const scoreElement = document.querySelector('.score');

        if (!bird || !scoreElement) return;

        let score = 0;
        let birdY = 50;
        let velocity = 0;
        let gravity = 0.5;
        let isGameRunning = false;
        let animationFrameId;

        function updateBird() {
            if (!isGameRunning) return;

            velocity += gravity;
            birdY += velocity;

            if (birdY > 90) {
                birdY = 90;
                velocity = 0;
            }
            if (birdY < 10) {
                birdY = 10;
                velocity = 0;
            }

            bird.style.top = birdY + '%';

            score += 0.1;
            scoreElement.textContent = Math.floor(score);

            animationFrameId = requestAnimationFrame(updateBird);
        }

        const startFlap = () => {
            if (!isGameRunning) {
                isGameRunning = true;
                updateBird();
            }
            velocity = -8;
        };

        document.addEventListener('click', startFlap);

        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                startFlap();
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener('click', startFlap);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const floatingElements = document.querySelectorAll('.element');

        const handleScroll = () => {
            const scrolled = window.pageYOffset;

            floatingElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
            });
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;`;

        document.body.appendChild(canvas);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 50;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.life = 1;
                this.decay = Math.random() * 0.02 + 0.01;
            }

            update() {
                this.x += this.vx; this.y += this.vy; this.life -= this.decay;
                if (this.life <= 0) { this.life = 1; this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; }
            }

            draw() {
                ctx.save(); ctx.globalAlpha = this.life; ctx.fillStyle = '#6366f1';
                ctx.beginPath(); ctx.arc(this.x, this.y, 2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
            }
        }

        for (let i = 0; i < particleCount; i++) { particles.push(new Particle()); }

        let rafId;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            rafId = requestAnimationFrame(animate);
        }

        animate();
        const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', handleResize);
            if (document.body.contains(canvas)) { document.body.removeChild(canvas); }
        };
    }, []);

    return null;
}

export default useDomEffects;