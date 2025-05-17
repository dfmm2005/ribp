const header = document.querySelector('header');
let lastScroll = 0;
let ticking = false;

function updateHeaderStyle() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 30) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
    ticking = false;
}

function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const heroSection = document.querySelector('.hero');
    const heroLink = document.querySelector('.nav-links a[href="#hero"]');
    
    const scrollPosition = window.pageYOffset;
    
    if (scrollPosition < (heroSection?.offsetHeight || 0)) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (heroLink) heroLink.classList.add('active');
        return;
    }
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.add('active');
        }
    });
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateHeaderStyle();
            updateActiveSection();
        });
        ticking = true;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateActiveSection();
});

const backgroundBlur = document.querySelector('.background-blur');
let isMoving = false;

if (backgroundBlur) {
    window.addEventListener('mousemove', (e) => {
        if (!isMoving) {
            requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth) * 100;
                const y = (e.clientY / window.innerHeight) * 100;
                backgroundBlur.style.setProperty('--mouse-x', `${x}%`);
                backgroundBlur.style.setProperty('--mouse-y', `${y}%`);
                isMoving = false;
            });
            isMoving = true;
        }
    });
}

function animateBackground() {
    const blur = document.querySelector('.background-blur');
    if (blur) {
        const time = Date.now() * 0.001;
        
        const gradientX = 50 + Math.sin(time * 0.5) * 10;
        const gradientY = 50 + Math.cos(time * 0.5) * 10;
        
        blur.style.setProperty('--gradient-x', `${gradientX}%`);
        blur.style.setProperty('--gradient-y', `${gradientY}%`);
        
        requestAnimationFrame(animateBackground);
    }
}

animateBackground();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mousemove', e => {
        const rect = item.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / item.clientWidth) * 100;
        const y = ((e.clientY - rect.top) / item.clientHeight) * 100;
        
        item.style.setProperty('--mouse-x', `${x}%`);
        item.style.setProperty('--mouse-y', `${y}%`);
    });
});

const portfolioItems = document.querySelectorAll('.portfolio-item');

const portfolioObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        } else {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(50px)';
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px'
});

portfolioItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(50px)';
    item.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    portfolioObserver.observe(item);
});

const contactSection = document.querySelector('.contact');
let contactForm = document.querySelector('.contact-form');

if (contactForm && contactSection) {
    contactSection.addEventListener('mousemove', e => {
        const rect = contactSection.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / contactSection.clientWidth) * 100;
        const y = ((e.clientY - rect.top) / contactSection.clientHeight) * 100;
        
        contactSection.style.setProperty('--mouse-x', `${x}%`);
        contactSection.style.setProperty('--mouse-y', `${y}%`);
    });
}

const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            contactObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px'
});

if (contactForm) {
    contactForm.style.opacity = '0';
    contactForm.style.transform = 'translateY(30px)';
    contactForm.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    contactObserver.observe(contactForm);
}

// Валидация формы
const form = document.querySelector('.contact-form');
const inputs = form?.querySelectorAll('input, textarea');

if (inputs) {
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
            validateField(input);
        });

        input.addEventListener('input', () => {
            validateField(input);
        });

        if (input.value) {
            input.parentElement.classList.add('focused');
            validateField(input);
        }
    });
}

function validatePhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 11) {
        return /^[78]\d{10}$/.test(cleanPhone);
    }
    return false;
}


function showNotification(message, type = 'error') {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (scrollBtn) {
        scrollBtn.style.display = 'none';
        scrollBtn.classList.remove('visible');
    }

    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon ${type}"></div>
            <div class="notification-message">${message}</div>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
            if (scrollBtn && window.pageYOffset > window.innerHeight) {
                scrollBtn.style.display = 'flex';
                setTimeout(() => scrollBtn.classList.add('visible'), 10);
            }
        }, 300);
    }, 5000);

    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
            if (scrollBtn && window.pageYOffset > window.innerHeight) {
                scrollBtn.style.display = 'flex';
                setTimeout(() => scrollBtn.classList.add('visible'), 10);
            }
        }, 300);
    });
}

document.getElementById('phone')?.addEventListener('input', function(e) {
    let phone = e.target.value.replace(/\D/g, '');
    
    if (phone.length > 11) {
        phone = phone.slice(0, 11);
    }
    
    if (phone.length >= 1) {
        if (phone.length === 11 && phone[0] === '8') {
            phone = '7' + phone.slice(1);
        }
        
        let formatted = '';
        if (phone.length > 0) formatted = '+' + phone[0];
        if (phone.length > 1) formatted += ' (' + phone.slice(1, 4);
        if (phone.length > 4) formatted += ') ' + phone.slice(4, 7);
        if (phone.length > 7) formatted += '-' + phone.slice(7, 9);
        if (phone.length > 9) formatted += '-' + phone.slice(9, 11);
        
        e.target.value = formatted;
    }
});

function validateField(input) {
    const formGroup = input.parentElement;
    let isValid = true;
    
    switch(input.id) {
        case 'name':
            isValid = validateName(input.value);
            break;
        case 'email':
            isValid = validateEmail(input.value);
            break;
        case 'phone':
            isValid = validatePhone(input.value);
            break;
        case 'message':
            isValid = validateMessage(input.value);
            break;
    }
    
    if (!input.value.trim()) {
        formGroup.classList.remove('valid', 'invalid');
    } else {
        formGroup.classList.toggle('invalid', !isValid);
        formGroup.classList.toggle('valid', isValid);
    }
    
    return isValid;
}

const messageTextarea = document.getElementById('message');
if (messageTextarea) {
    messageTextarea.maxLength = 500;
    
    const autoResize = (el) => {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    };
    
    messageTextarea.addEventListener('input', (e) => {
        autoResize(e.target);

        let counter = document.querySelector('.character-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.style.position = 'absolute';
            counter.style.bottom = '-1.5rem';
            counter.style.right = '0';
            counter.style.fontSize = '0.8rem';
            counter.style.color = 'rgba(255, 255, 255, 0.5)';
            messageTextarea.parentElement.appendChild(counter);
        }
        
        const remaining = messageTextarea.maxLength - messageTextarea.value.length;
        counter.textContent = `${remaining} символов осталось`;
        
        if (remaining <= 50) {
            counter.style.color = 'rgba(255, 200, 0, 0.8)';
        } else {
            counter.style.color = 'rgba(255, 255, 255, 0.5)';
        }
    });
    
    autoResize(messageTextarea);
}

const learnMoreBtn = document.querySelector('.about-content .btn');
if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
        const servicesSection = document.querySelector('#services');
        if (servicesSection) {
            servicesSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            servicesSection.style.transition = 'all 0.5s ease';
            servicesSection.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            
            setTimeout(() => {
                servicesSection.style.backgroundColor = '';
            }, 1000);
        }
    });
}

const consultationBtn = document.querySelector('.hero-content .btn');
if (consultationBtn) {
    consultationBtn.addEventListener('click', () => {
        const contactSection = document.querySelector('#contact');
        const contactForm = document.querySelector('.contact-form');
        
        if (contactSection && contactForm) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            setTimeout(() => {
                contactForm.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                contactForm.style.transform = 'scale(1.02)';
                contactForm.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                contactForm.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                
                setTimeout(() => {
                    contactForm.style.transform = '';
                    contactForm.style.boxShadow = '';
                    contactForm.style.borderColor = '';
                }, 1000);
            }, 500);
            
            const firstInput = contactForm.querySelector('input');
            if (firstInput) {
                setTimeout(() => {
                    firstInput.focus();
                }, 1000);
            }
        }
    });
}

const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    logo.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    if (!scrollToTopBtn) return;
    
    scrollToTopBtn.style.display = 'none';
    
    function toggleScrollToTopButton() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollPosition > window.innerHeight) {
            scrollToTopBtn.style.display = 'flex';
            setTimeout(() => {
                scrollToTopBtn.classList.add('visible');
            }, 10);
        } else {
            scrollToTopBtn.classList.remove('visible');
            setTimeout(() => {
                if (!scrollToTopBtn.classList.contains('visible')) {
                    scrollToTopBtn.style.display = 'none';
                }
            }, 300);
        }
    }
    
    window.addEventListener('scroll', toggleScrollToTopButton);
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    toggleScrollToTopButton();
});

const portfolioData = {
    'project1': {
        title: 'Рекламная кампания для сети АЗС',
        category: 'Билборды',
        description: 'Комплексное оформление сети АЗС с использованием современных световых решений. Проект включал в себя разработку уникального дизайна, производство и монтаж световых конструкций, а также настройку системы управления освещением.',
        image: '',
        date: 'Январь 2024',
        client: 'Сеть АЗС "Энергия"',
        type: 'Наружная реклама'
    },
    'project2': {
        title: 'Интерактивные дисплеи',
        category: 'Цифровые экраны',
        description: 'Система цифровых экранов с динамическим контентом для крупного торгового центра. Реализована возможность удаленного управления контентом и интеграция с системой аналитики посетителей.',
        image: '',
        date: 'Декабрь 2023',
        client: 'ТРЦ "Мегаполис"',
        type: 'Цифровые технологии'
    },
    'project3': {
        title: 'Фирменный стиль',
        category: 'Дизайн',
        description: 'Разработка уникального визуального оформления для сети ресторанов, включая создание световых вывесок, меню-боксов и навигационных элементов.',
        image: '',
        date: 'Ноябрь 2023',
        client: 'Сеть ресторанов "Вкусно"',
        type: 'Брендинг'
    },
    'project4': {
        title: 'Световые короба',
        category: 'Монтаж',
        description: 'Установка и настройка световых конструкций для фасада бизнес-центра. Использованы энергоэффективные LED-технологии и современные материалы.',
        image: '',
        date: 'Октябрь 2023',
        client: 'БЦ "Горизонт"',
        type: 'Монтажные работы'
    },
    'project5': {
        title: 'Торговый центр',
        category: 'Комплексные решения',
        description: 'Полное оформление фасада и входной группы торгового центра, включая световые панели, динамическую подсветку и рекламные конструкции.',
        image: '',
        date: 'Сентябрь 2023',
        client: 'ТЦ "Планета"',
        type: 'Комплексный проект'
    },
    'project6': {
        title: 'Умная реклама',
        category: 'Инновации',
        description: 'Интеграция IoT-технологий в наружную рекламу для интерактивного взаимодействия с аудиторией. Система анализирует активность и автоматически адаптирует контент под целевую аудиторию.',
        image: '',
        date: 'Август 2023',
        client: 'Инновационный центр "Технополис"',
        type: 'IoT-решения'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.querySelector('.portfolio-modal');
    const modalClose = document.querySelector('.portfolio-modal-close');
    const portfolioLinks = document.querySelectorAll('.portfolio-link');
    
    function openModal(projectId) {
        const project = portfolioData[projectId];
        if (!project) return;
        
        modal.querySelector('.portfolio-modal-image img').src = project.image;
        modal.querySelector('.portfolio-modal-category').textContent = project.category;
        modal.querySelector('.portfolio-modal-title').textContent = project.title;
        modal.querySelector('.portfolio-modal-description').textContent = project.description;
        
        const detailValues = modal.querySelectorAll('.portfolio-modal-detail-value');
        detailValues[0].textContent = project.date;
        detailValues[1].textContent = project.client;
        detailValues[2].textContent = project.type;
        
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 10);
    }
    
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 400);
    }

    portfolioLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(`project${index + 1}`);
        });
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});

const headingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const blur = entry.target.getAttribute('data-blur') || '0';
            entry.target.style.setProperty('--heading-blur', `${blur}px`);
        } else {
            entry.target.classList.remove('visible');
            entry.target.style.setProperty('--heading-blur', '0px');
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px'
});

document.querySelectorAll('section h2').forEach(heading => {
    heading.setAttribute('data-text', heading.textContent);
    headingObserver.observe(heading);
});

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const section = entry.target;
        const elements = section.querySelectorAll('.animate-on-scroll');
        
        elements.forEach((element, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            } else {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
            }
        });
    });
}, {
    threshold: 0.1,
    rootMargin: '0px'
});

document.querySelectorAll('.service-card, .contact-info > *, .contact-form, .about-content > *').forEach(element => {
    element.classList.add('animate-on-scroll');
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
});

document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

function handleHeroGlow() {
    const hero = document.querySelector('.hero');
    let isAnimating = false;
    let glowTimeout;
    let lastAnimationTime = 0;
    const ANIMATION_COOLDOWN = 5000; 
    let lastScrollPosition = window.pageYOffset;
    const SCROLL_THRESHOLD = window.innerHeight; 

    function canAnimate() {
        const currentTime = Date.now();
        return currentTime - lastAnimationTime > ANIMATION_COOLDOWN;
    }

    function triggerGlow(mouseX = 50, mouseY = 0) {
        if (!isAnimating && canAnimate()) {
            isAnimating = true;
            lastAnimationTime = Date.now();
            clearTimeout(glowTimeout);

            hero.style.setProperty('--glow-x', `${mouseX}%`);
            hero.style.setProperty('--glow-y', `${mouseY}%`);

            hero.classList.add('glow');
            
            glowTimeout = setTimeout(() => {
                hero.classList.remove('glow');
                isAnimating = false;
            }, 3000);
        }
    }

    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;
        
        if (currentScrollY < lastScrollPosition && 
            Math.abs(currentScrollY - lastScrollPosition) > SCROLL_THRESHOLD && 
            currentScrollY < window.innerHeight) {
            const mouseX = 50;
            const mouseY = (currentScrollY / window.innerHeight) * 100;
            triggerGlow(mouseX, mouseY);
        }
        
        lastScrollPosition = currentScrollY;
    });

    if (window.location.hash === '' || window.location.hash === '#hero') {
        setTimeout(() => {
            triggerGlow(50, 30);
        }, 500);
    }

    const logoLink = document.querySelector('.logo');
    const homeLink = document.querySelector('a[href="#hero"]');

    [logoLink, homeLink].forEach(link => {
        if (link) {
            link.addEventListener('click', (e) => {
                if (e.currentTarget === logoLink || e.currentTarget.getAttribute('href') === '#hero') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                  
                    if (canAnimate()) {
                        setTimeout(() => {
                            triggerGlow(50, 30);
                        }, 500);
                    }
                }
            });
        }
    });
}


handleHeroGlow();


function validateName(name) {
    return /^[А-ЯЁа-яёA-Za-z\s]{2,50}$/.test(name);
}

function validateEmail(email) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
}

function validateMessage(message) {
    return message.length >= 10 && message.length <= 1000;
}


let activeNotifications = [];


function validateForm(formData) {
    const errors = [];
    const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s-]{2,50}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) errorMessage.remove();
    });

    if (!nameRegex.test(formData.get('name'))) {
        errors.push({
            field: 'name',
            message: 'Пожалуйста, введите корректное имя (от 2 до 50 символов, только буквы)'
        });
    }

    if (!emailRegex.test(formData.get('email'))) {
        errors.push({
            field: 'email',
            message: 'Пожалуйста, введите корректный email адрес'
        });
    }

    const phone = formData.get('phone').replace(/\D/g, '');
    if (phone.length !== 11 || !['7', '8'].includes(phone[0])) {
        errors.push({
            field: 'phone',
            message: 'Пожалуйста, введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX'
        });
    }

    if (formData.get('message').length < 10) {
        errors.push({
            field: 'message',
            message: 'Сообщение должно содержать не менее 10 символов'
        });
    }

    if (errors.length > 0) {
        errors.forEach(error => {
            const field = document.querySelector(`[name="${error.field}"]`);
            const formGroup = field.closest('.form-group');
            formGroup.classList.add('error');
            
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = error.message;
            formGroup.appendChild(errorMessage);
        });

        showNotification('Пожалуйста, исправьте ошибки в форме');
        return false;
    }

    return true;
}

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    if (!validateForm(formData)) {
        return;
    }

    try {
        const response = await fetch('process_form.php', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
            form.reset();
        } else {
            showNotification(result.message || 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });

        overlay.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }

    function toggleMenu() {
        const isOpen = navLinks.classList.contains('active');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        mobileMenuBtn.classList.add('active');
        navLinks.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});