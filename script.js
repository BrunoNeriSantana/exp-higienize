// ============= MENU MOBILE =============
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
}

// ============= SMOOTH SCROLL =============
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

// ============= FORM SUBMISSION =============
function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const nome = form.querySelector('#nome').value;
    const email = form.querySelector('#email').value;
    const telefone = form.querySelector('#telefone').value;
    const tipo = form.querySelector('#tipo').value;
    const mensagem = form.querySelector('#mensagem').value;
    
    // Log das informações
    console.log({
        nome,
        email,
        telefone,
        tipo,
        mensagem,
        data: new Date().toLocaleString('pt-BR')
    });
    
    // Feedback visual
    const button = form.querySelector('button[type="submit"]');
    const buttonText = button.textContent;
    const originalBg = button.style.background;
    
    button.innerHTML = '<span>✓ Mensagem enviada com sucesso!</span>';
    button.style.background = 'linear-gradient(135deg, #27AE60 0%, #229954 100%)';
    
    setTimeout(() => {
        button.innerHTML = buttonText;
        button.style.background = originalBg;
        form.reset();
    }, 2500);
    
    // IMPORTANTE: Aqui você deve integrar com seu backend
    // Exemplo com fetch API:
    /*
    fetch('/api/contato', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome,
            email,
            telefone,
            tipo,
            mensagem
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Sucesso:', data);
        button.innerHTML = '<span>✓ Mensagem enviada!</span>';
        button.style.background = 'linear-gradient(135deg, #27AE60 0%, #229954 100%)';
        
        setTimeout(() => {
            button.innerHTML = buttonText;
            button.style.background = originalBg;
            form.reset();
        }, 2500);
    })
    .catch(error => console.error('Erro:', error));
    */
}

// ============= INTERSECTION OBSERVER PARA ANIMAÇÕES =============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos com classe de animação
document.querySelectorAll('.servico-card, .diferencial-item, .portfolio-item, .testemunho-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============= EFEITO DE NAVEGAÇÃO ATIVA =============
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.borderBottom = '2px solid transparent';
        if (link.getAttribute('href').slice(1) === current) {
            link.style.borderBottom = '2px solid white';
        }
    });
});

// ============= ANIMAÇÃO DO LOGO =============
document.querySelector('.logo').addEventListener('click', (e) => {
    if (e.target.tagName !== 'A') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ============= VALIDAÇÃO E MÁSCARA DE TELEFONE =============
const telefoneInput = document.querySelector('#telefone');
if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 2) {
                value = '(' + value;
            } else if (value.length <= 7) {
                value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
            } else {
                value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7, 11);
            }
        }
        e.target.value = value;
    });
}

// ============= EFEITO DE HOVER NOS CARDS =============
document.querySelectorAll('.portfolio-image.before-after').forEach(element => {
    element.addEventListener('click', () => {
        const after = element.querySelector('.after');
        if (after.style.clipPath === 'polygon(0 0, 100% 0, 100% 100%, 0 100%)') {
            after.style.clipPath = 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)';
            after.style.opacity = '0.7';
        } else {
            after.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
            after.style.opacity = '1';
        }
    });
});

// ============= REDES SOCIAIS =============
document.querySelectorAll('.social-btn').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Configure os links das redes sociais em breve!');
    });
});

// ============= LOADING ANIMATION =============
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// ============= DEBOUNCE PARA RESIZE =============
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reajustar layout se necessário
    }, 250);
});

// ============= SCROLL BEHAVIOR POLYFILL =============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        
        if (target && href !== '#') {
            e.preventDefault();
            const headerHeight = 60; // altura do header
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

