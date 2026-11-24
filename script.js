document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ТЕМЫ
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            if (body.classList.contains('light-theme')) {
                themeToggleBtn.innerHTML = '🌙 Тёмная тема';
            } else {
                themeToggleBtn.innerHTML = '☀️ Светлая тема';
            }
        });
    }

    // ==========================================
    // 2. ДИНАМИЧЕСКИЕ АНИМАЦИИ ПРИ КАЖДОМ СКРОЛЛЕ
    // ==========================================
    
    // Базовые настройки для плавного выплывания элементов
    const animationOptions = {
        duration: 800,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        fill: 'forwards'
    };

    // Функция появления (выплывает снизу вверх и проявляется)
    const animateIn = (element, delay = 0) => {
        element.animate([
            { opacity: 0, transform: 'translateY(40px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { ...animationOptions, delay });
    };

    // Функция исчезновения (плавно опускается вниз и прячется, готовая к новому скроллу)
    const animateOut = (element) => {
        element.animate([
            { opacity: element.style.opacity || 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(40px)' }
        ], { ...animationOptions, duration: 400 }); // Прячем чуть быстрее, чтобы не затягивать процесс
    };

    // Анимация главного экрана при самой первой загрузке сайта
    const heroText = document.querySelector('.hero-text-block');
    if (heroText) {
        animateIn(heroText);
    }

    // Создаём наблюдатель, который будет работать БЕСКОНЕЧНО при каждом скролле
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const target = entry.target;
            
            if (entry.isIntersecting) {
                // ЕСЛИ БЛОК ПОЯВИЛСЯ НА ЭКРАНЕ: запускаем анимацию появления
                if (target.classList.contains('cards-grid') || 
                    target.classList.contains('numbered-list-grid') || 
                    target.classList.contains('sections-visual-grid')) {
                    
                    // Эффект волны для карточек внутри сеток
                    const children = target.children;
                    Array.from(children).forEach((child, index) => {
                        animateIn(child, index * 100);
                    });
                } else {
                    animateIn(target);
                }
            } else {
                // ЕСЛИ БЛОК УШЁЛ ЗА ПРЕДЕЛЫ ЭКРАНА: плавно прячем его обратно вниз
                if (target.classList.contains('cards-grid') || 
                    target.classList.contains('numbered-list-grid') || 
                    target.classList.contains('sections-visual-grid')) {
                    
                    const children = target.children;
                    Array.from(children).forEach((child) => animateOut(child));
                } else {
                    animateOut(target);
                }
            }
        });
    }, {
        threshold: 0.05,        // Срабатывает, как только показались первые 5% блока
        rootMargin: '0px 0px -20px 0px' 
    });

    // Находим все разделы контента для бесконечного отслеживания
    const elementsToWatch = document.querySelectorAll(
        '.section-grid-2, .section-header-clean, .cards-grid, .numbered-list-grid, .sections-visual-grid, .timeline-item, .contacts-wrapper'
    );
    
    // Подключаем слежку ко всем элементам
    elementsToWatch.forEach((el) => {
        el.style.opacity = '0'; // Изначально скрываем
        scrollObserver.observe(el);
    });
});

        // ==========================================
    // 3. РАБОЧЕЕ УПРАВЛЕНИЕ МОДАЛЬНЫМИ ОКНАМИ
    // ==========================================
    
    // Находим абсолютно ВСЕ кнопки регистрации на сайте по классу .btn-more
    const openModalButtons = document.querySelectorAll('.btn-more');
    const registerModal = document.getElementById('register-modal');
    const thanksModal = document.getElementById('thanks-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const closeThanksBtn = document.getElementById('close-thanks');
    const registerForm = document.getElementById('register-form');

    // Циклом вешаем событие клика на КАЖДУЮ кнопку, которая есть на странице
    if (openModalButtons.length > 0 && registerModal) {
        openModalButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Отменяем прыжки по ссылкам
                registerModal.classList.add('active'); // Плавно открываем окно
            });
        });
    }

    // Закрытие окна регистрации по крестику
    if (closeModalBtn && registerModal) {
        closeModalBtn.addEventListener('click', () => {
            registerModal.classList.remove('active');
        });
    }

    // Отправка формы регистрации
    if (registerForm && registerModal && thanksModal) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Предотвращаем перезагрузку страницы
            
            // 1. Прячем окно с полями ввода
            registerModal.classList.remove('active');
            
            // 2. Автоматически и плавно перематываем сайт на самый верх к ноутбуку
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // 3. Через 350мс (когда сайт долетит наверх) показываем окно благодарности
            setTimeout(() => {
                thanksModal.classList.add('active');
                registerForm.reset(); // Очищаем форму для следующих записей
            }, 350);
        });
    }

    // Закрытие окна благодарности
    if (closeThanksBtn && thanksModal) {
        closeThanksBtn.addEventListener('click', () => {
            thanksModal.classList.remove('active');
        });
    }

    // Закрытие окон при клике на темную область вокруг них
    window.addEventListener('click', (e) => {
        if (e.target === registerModal) registerModal.classList.remove('active');
        if (e.target === thanksModal) thanksModal.classList.remove('active');
    }); // Самая последняя закрывающая скобка DOMContentLoaded

        // 4. УМНАЯ ШАПКА (меняет цвет строго после мейна)
    const navbar = document.querySelector('.top-navbar');
    const heroBlock = document.querySelector('.hero');

    const updateNavbarTheme = () => {
        if (!navbar) return;
        // Если мы на странице без мейна (например, на новостях), шапка сразу может быть светлой
        if (!heroBlock) {
            navbar.setAttribute('data-scroll', 'scrolled');
            return;
        }
        
        // Проверяем, ушёл ли низ мейн-блока выше нижней границы шапки (90px)
        const heroBottom = heroBlock.getBoundingClientRect().bottom;
        if (heroBottom <= 90) {
            navbar.setAttribute('data-scroll', 'scrolled');
        } else {
            navbar.removeAttribute('data-scroll');
        }
    };

    window.addEventListener('scroll', updateNavbarTheme);
    updateNavbarTheme(); // Проверяем сразу при загрузке страницы

