// Menu Hamburguer - Para mobile
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em um link
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Efeito de scroll suave para navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mudar aparência da navbar ao fazer scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Animação de entrada dos elementos ao fazer scroll (opcional)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplica animação aos cards
const cards = document.querySelectorAll('.skill-card, .project-card, .contact-card');
cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Gerar círculos azuis aleatórios na seção Hero
function createHeroCircles() {
    const heroCirclesContainer = document.querySelector('.hero-circles');
    const numberOfCircles = 15; // Número de círculos

    for (let i = 0; i < numberOfCircles; i++) {
        const circle = document.createElement('div');
        circle.className = 'hero-circle';
        
        // Tamanho aleatório entre 20px e 150px
        const size = Math.random() * 130 + 20;
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        
        // Posição aleatória
        circle.style.left = `${Math.random() * 100}%`;
        circle.style.top = `${Math.random() * 100}%`;
        
        // Delay de animação aleatório
        circle.style.animationDelay = `${Math.random() * 6}s`;
        
        // Duração de animação aleatória
        const duration = Math.random() * 4 + 6; // Entre 6s e 10s
        circle.style.animationDuration = `${duration}s`;
        
        heroCirclesContainer.appendChild(circle);
    }
}

// Criar círculos quando a página carregar
document.addEventListener('DOMContentLoaded', createHeroCircles);

// ===== CARROSSEL 3D DE PROJETOS =====
class Carousel3D {
    constructor() {
        this.currentIndex = 0;
        this.cards = document.querySelectorAll('.project-card-3d');
        this.totalCards = this.cards.length;
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.querySelectorAll('.indicator');
        
        this.init();
    }
    
    init() {
        // Event listeners para botões
        this.prevBtn.addEventListener('click', () => this.goToPrevious());
        this.nextBtn.addEventListener('click', () => this.goToNext());
        
        // Event listeners para indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Event listeners para cards laterais
        this.cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (index !== this.currentIndex) {
                    this.goToSlide(index);
                }
            });
        });
        
        // Suporte a teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.goToPrevious();
            } else if (e.key === 'ArrowRight') {
                this.goToNext();
            }
        });
        
        // Suporte a swipe em dispositivos móveis
        this.setupSwipe();
        
        // Handle window resize for better responsive behavior
        window.addEventListener('resize', () => {
            // Debounce resize events
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.updateCarousel();
            }, 150);
        });
        
        // Inicializar posições
        this.updateCarousel();
    }
    
    goToNext() {
        this.currentIndex = (this.currentIndex + 1) % this.totalCards;
        this.updateCarousel();
    }
    
    goToPrevious() {
        this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
    
    updateCarousel() {
        // Remover todas as classes de posição
        this.cards.forEach(card => {
            card.classList.remove('active', 'left', 'right', 'hidden');
        });
        
        // Atualizar indicadores (if they exist)
        if (this.indicators && this.indicators.length > 0) {
            this.indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentIndex);
            });
        }
        
        // Definir posições dos cards
        this.cards.forEach((card, index) => {
            const position = this.getCardPosition(index);
            card.classList.add(position);
            
            // Ensure card is visible and properly styled
            card.style.display = 'flex';
            card.setAttribute('data-position', position);
        });
        
        // Force layout recalculation for mobile devices
        if (window.innerWidth <= 768) {
            this.track.offsetHeight; // Trigger reflow
        }
    }
    
    getCardPosition(index) {
        const diff = index - this.currentIndex;
        
        if (diff === 0) {
            return 'active'; // Card central
        } else if (diff === 1 || (diff === -(this.totalCards - 1))) {
            return 'right'; // Card à direita
        } else if (diff === -1 || (diff === this.totalCards - 1)) {
            return 'left'; // Card à esquerda
        } else {
            return 'hidden'; // Cards ocultos
        }
    }
    
    setupSwipe() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        let startTime = 0;
        const threshold = 30; // Reduced threshold for more responsive swipe
        const timeThreshold = 500; // Maximum time for swipe gesture
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const diffX = startX - endX;
            const diffY = Math.abs(startY - endY);
            const timeDiff = endTime - startTime;
            
            // Check if it's a valid horizontal swipe
            if (Math.abs(diffX) > threshold && 
                Math.abs(diffX) > diffY && // More horizontal than vertical
                timeDiff < timeThreshold) {
                
                if (diffX > 0) {
                    this.goToNext(); // Swipe para esquerda = próximo
                } else {
                    this.goToPrevious(); // Swipe para direita = anterior
                }
            }
        }, { passive: true });
        
        // Prevent horizontal scroll during swipe but allow vertical scroll
        this.track.addEventListener('touchmove', (e) => {
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);
            
            // Only prevent default if horizontal movement is greater than vertical
            if (diffX > diffY && diffX > 10) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}

// Inicializar carrossel quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new Carousel3D();
    animateSkillBars();
});

// ===== ANIMAÇÃO DAS BARRAS DE HABILIDADES =====
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                // Delay pequeno para criar efeito sequencial
                setTimeout(() => {
                    progressBar.style.width = width + '%';
                }, 200);
                
                skillObserver.unobserve(progressBar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}