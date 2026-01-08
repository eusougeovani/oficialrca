/* ==========================================
   REAL CLUBE ATLÉTICO - JAVASCRIPT GLOBAL
   ========================================== */

// === MENU HAMBURGER ===
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// === BOTÃO VOLTAR AO TOPO ===
const backToTop = document.querySelector('.back-to-top');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
    });
}

// === SMOOTH SCROLL ===
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

// === SISTEMA DE FILTROS (NOTÍCIAS) ===
const filtros = document.querySelectorAll('.filtro-btn');

if (filtros.length > 0) {
    filtros.forEach(filtro => {
        filtro.addEventListener('click', () => {
            // Remove active de todos
            filtros.forEach(f => f.classList.remove('active'));
            // Adiciona active no clicado
            filtro.classList.add('active');
            
            // Aqui você pode adicionar lógica de filtro real
            const categoria = filtro.textContent.toLowerCase().trim();
            console.log('Filtro selecionado:', categoria);
        });
    });
}

// === ANIMAÇÃO DE ENTRADA ===
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

// Elementos para animar
const animateElements = document.querySelectorAll(`
    .jogo-card,
    .noticia-card,
    .diretor-card,
    .jogador-card,
    .titulo-card,
    .tecnico-card,
    .timeline-item,
    .stat-card,
    .artilheiro-card,
    .record-card
`);

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// === HEADER SCROLL EFFECT ===
let lastScroll = 0;
const header = document.querySelector('header');

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        } else {
            header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
        }
        
        lastScroll = currentScroll;
    });
}

// === CONTADOR ANIMADO (ESTATÍSTICAS) ===
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animar contadores quando visíveis
const statNumbers = document.querySelectorAll('.stat-number, .stat-num');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const target = parseInt(entry.target.textContent);
            if (!isNaN(target)) {
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target, target);
            }
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statObserver.observe(stat));

// === PRELOAD DE IMAGENS ===
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// === TOOLTIP SIMPLES ===
function createTooltip() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', (e) => {
            const tooltipText = e.target.dataset.tooltip;
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = tooltipText;
            tooltip.style.cssText = `
                position: absolute;
                background: var(--secondary);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-size: 0.85rem;
                z-index: 10000;
                pointer-events: none;
                white-space: nowrap;
            `;
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            e.target.tooltipElement = tooltip;
        });
        
        trigger.addEventListener('mouseleave', (e) => {
            if (e.target.tooltipElement) {
                e.target.tooltipElement.remove();
                delete e.target.tooltipElement;
            }
        });
    });
}

createTooltip();

// === LOADING SCREEN (OPCIONAL) ===
window.addEventListener('load', () => {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }, 500);
    }
});

// === MODAL GENÉRICO ===
function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(11, 28, 60, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 2rem;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
        padding: 3rem;
        border-radius: 20px;
        max-width: 600px;
        width: 100%;
        border: 2px solid var(--secondary);
        position: relative;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: var(--secondary);
        border: none;
        color: white;
        font-size: 2rem;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        line-height: 1;
    `;
    
    closeBtn.onclick = () => {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.9)';
        setTimeout(() => modal.remove(), 300);
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeBtn.click();
        }
    };
    
    modalContent.innerHTML = content;
    modalContent.prepend(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    return modal;
}

// Tornar createModal global
window.createModal = createModal;

// === SISTEMA DE NOTIFICAÇÕES ===
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 160px;
        right: 2rem;
        background: var(--secondary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.background = '#28a745';
    } else if (type === 'error') {
        notification.style.background = '#dc3545';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

window.showNotification = showNotification;

// === FORMULÁRIO DE SÓCIO (SE EXISTIR) ===
const btnSocio = document.querySelector('.btn-socio');
if (btnSocio) {
    btnSocio.addEventListener('click', () => {
        const formHTML = `
            <h2 style="color: var(--secondary); margin-bottom: 1.5rem; text-align: center;">
                Seja Sócio Realeza
            </h2>
            <form id="formSocio" style="color: var(--light);">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Nome Completo</label>
                    <input type="text" required style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Email</label>
                    <input type="email" required style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Telefone</label>
                    <input type="tel" required style="width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white;">
                </div>
                <button type="submit" style="width: 100%; padding: 1rem; background: var(--secondary); border: none; border-radius: 8px; color: white; font-weight: 700; cursor: pointer; font-size: 1rem;">
                    Enviar Solicitação
                </button>
            </form>
        `;
        
        const modal = createModal(formHTML);
        
        setTimeout(() => {
            const form = document.getElementById('formSocio');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    showNotification('Solicitação enviada com sucesso!', 'success');
                    modal.querySelector('button[style*="position: absolute"]').click();
                });
            }
        }, 100);
    });
}

// === BUSCA RÁPIDA (OPCIONAL) ===
function initQuickSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const searchableItems = document.querySelectorAll('[data-searchable]');
        
        searchableItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

initQuickSearch();

// === MODO ESCURO/CLARO (FUTURO) ===
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

initThemeToggle();

// === PERFORMANCE: DEBOUNCE ===
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// === LAZY LOADING DE VÍDEOS ===
const videos = document.querySelectorAll('video[data-src]');
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const video = entry.target;
            video.src = video.dataset.src;
            video.load();
            videoObserver.unobserve(video);
        }
    });
});

videos.forEach(video => videoObserver.observe(video));

// === LOG DE INICIALIZAÇÃO ===
console.log('%c Real Clube Atlético ', 'background: #0b1c3c; color: #ed8c0c; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Sistema carregado com sucesso! ', 'background: #ed8c0c; color: white; font-size: 14px; padding: 5px;');