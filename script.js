/* ═══════════════════════════════════════════ */
/* GERENCIAL GROUP - INTERACTIVE SCRIPT       */
/* ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // ─── HEADER SCROLL ───
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ─── MOBILE MENU ───
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    menuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
    });
    document.querySelectorAll('.mobile-nav__link').forEach(link => {
        link.addEventListener('click', () => mobileNav.classList.remove('active'));
    });

    // ─── SCROLL REVEAL ───
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));

    // ─── HERO STAT COUNTERS ───
    const heroStats = document.querySelectorAll('.stat__number[data-count]');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                animateCount(el, 0, target, 2000);
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    heroStats.forEach(s => statsObserver.observe(s));

    // ─── METRIC COUNTERS & BARS ───
    const metricCounters = document.querySelectorAll('.counter[data-target]');
    const metricBars = document.querySelectorAll('.metric-bar-fill');
    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.classList.contains('counter')) {
                    const target = parseInt(el.dataset.target);
                    animateCount(el, 0, target, 2000);
                }
                if (el.classList.contains('metric-bar-fill')) {
                    el.classList.add('animated');
                }
                metricsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    metricCounters.forEach(c => metricsObserver.observe(c));
    metricBars.forEach(b => metricsObserver.observe(b));

    function animateCount(el, start, end, duration) {
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(start + (end - start) * eased);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // ─── PHASE CARDS (INTERACTIVE) ───
    document.querySelectorAll('.phase-card').forEach(card => {
        card.addEventListener('click', () => {
            const wasActive = card.classList.contains('active');
            document.querySelectorAll('.phase-card').forEach(c => c.classList.remove('active'));
            if (!wasActive) card.classList.add('active');
        });
    });

    // ─── SMOOTH SCROLL ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ═══════════════════════════════════════════
    // AI CHAT BOT
    // ═══════════════════════════════════════════
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatBody = document.getElementById('chat-body');
    const chatOptions = document.getElementById('chat-options');

    let chatStep = 0;
    let chatAnswers = {};
    let chatOpened = false;

    const chatFlow = [
        {
            question: '¡Hola! 👋 Soy el asistente de Gerencial Group. Te ayudaré a encontrar el plan perfecto para ti. ¿A qué te dedicas dentro del sector salud?',
            options: [
                { text: '🦷 Odontología', value: 'odontologia' },
                { text: '🩺 Medicina general', value: 'medicina' },
                { text: '💆 Dermatología / Estética', value: 'dermatologia' },
                { text: '🏥 Otra especialidad', value: 'otra' }
            ],
            key: 'especialidad'
        },
        {
            question: 'Excelente. ¿Actualmente publicas contenido en redes sociales?',
            options: [
                { text: '✅ Sí, regularmente', value: 'si' },
                { text: '⚠️ A veces', value: 'aveces' },
                { text: '❌ No', value: 'no' }
            ],
            key: 'publica'
        },
        {
            question: '¿Recibes mensajes de pacientes interesados por tus redes?',
            options: [
                { text: '✅ Sí', value: 'si' },
                { text: '⚠️ A veces', value: 'aveces' },
                { text: '❌ No', value: 'no' }
            ],
            key: 'mensajes'
        },
        {
            question: '¿Tienes una estrategia definida o improvisas el contenido?',
            options: [
                { text: '📋 Tengo estrategia', value: 'estrategia' },
                { text: '🎲 Improviso', value: 'improvisa' }
            ],
            key: 'estrategia'
        },
        {
            question: '¿Qué es lo que más te interesa lograr?',
            options: [
                { text: '📱 Solo quiero presencia profesional', value: 'presencia' },
                { text: '📈 Quiero crecer y atraer pacientes', value: 'crecer' },
                { text: '🚀 Quiero un sistema completo de captación', value: 'sistema' }
            ],
            key: 'objetivo'
        }
    ];

    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        const badge = chatToggle.querySelector('.chat-toggle__badge');
        if (badge) badge.style.display = 'none';
        if (!chatOpened) {
            chatOpened = true;
            setTimeout(() => startChat(), 500);
        }
    });
    chatClose.addEventListener('click', () => chatWindow.classList.remove('active'));

    function startChat() {
        chatStep = 0;
        chatAnswers = {};
        chatBody.innerHTML = '';
        chatOptions.innerHTML = '';
        showBotMessage(chatFlow[0].question, () => showOptions(chatFlow[0].options, chatFlow[0].key));
    }

    function showBotMessage(text, callback) {
        // Show typing indicator
        const typing = document.createElement('div');
        typing.className = 'chat-msg chat-msg--bot chat-msg--typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        chatBody.appendChild(typing);
        chatBody.scrollTop = chatBody.scrollHeight;

        setTimeout(() => {
            typing.remove();
            const msg = document.createElement('div');
            msg.className = 'chat-msg chat-msg--bot';
            msg.textContent = text;
            chatBody.appendChild(msg);
            chatBody.scrollTop = chatBody.scrollHeight;
            if (callback) setTimeout(callback, 300);
        }, 1200);
    }

    function showUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'chat-msg chat-msg--user';
        msg.textContent = text;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showOptions(options, key) {
        chatOptions.innerHTML = '';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'chat-option';
            btn.textContent = opt.text;
            btn.addEventListener('click', () => {
                chatAnswers[key] = opt.value;
                showUserMessage(opt.text);
                chatOptions.innerHTML = '';
                chatStep++;
                if (chatStep < chatFlow.length) {
                    const next = chatFlow[chatStep];
                    showBotMessage(next.question, () => showOptions(next.options, next.key));
                } else {
                    generateRecommendation();
                }
            });
            chatOptions.appendChild(btn);
        });
    }

    function generateRecommendation() {
        const a = chatAnswers;
        let plan, problem, result;

        if (a.objetivo === 'sistema' || (a.estrategia === 'improvisa' && a.mensajes === 'no')) {
            plan = 'Plan 3 – Autoridad & Pacientes';
            problem = 'no tienes un sistema estructurado para convertir seguidores en pacientes';
            result = 'crear un embudo completo que genere citas de forma automática';
        } else if (a.objetivo === 'crecer' || a.estrategia === 'improvisa' || a.mensajes === 'aveces') {
            plan = 'Plan 2 – Crecimiento Médico';
            problem = 'tu contenido no está generando los resultados que necesitas';
            result = 'atraer pacientes con una estrategia clara y enfocada en resultados';
        } else {
            plan = 'Plan 1 – Presencia Básica';
            problem = 'necesitas mantener una presencia profesional y consistente';
            result = 'tener un perfil organizado y contenido de calidad constante';
        }

        const recommendation = `Según tus respuestas, necesitas el ${plan} porque actualmente ${problem} y este plan te ayudará a ${result}. ¿Te gustaría conocer más detalles?`;

        showBotMessage(recommendation, () => {
            chatOptions.innerHTML = '';
            const ctaBtn = document.createElement('button');
            ctaBtn.className = 'chat-option';
            ctaBtn.textContent = '👉 Ver el plan recomendado';
            ctaBtn.style.background = 'linear-gradient(135deg, #0B5ED7, #7B2CBF)';
            ctaBtn.style.color = '#fff';
            ctaBtn.style.border = 'none';
            ctaBtn.style.fontWeight = '700';
            ctaBtn.addEventListener('click', () => {
                document.getElementById('planes').scrollIntoView({ behavior: 'smooth', block: 'start' });
                chatWindow.classList.remove('active');
            });
            chatOptions.appendChild(ctaBtn);

            const waBtn = document.createElement('button');
            waBtn.className = 'chat-option';
            waBtn.textContent = '💬 Hablar con un asesor';
            waBtn.addEventListener('click', () => {
                window.open('https://wa.me/573128417585?text=Hola%2C%20quiero%20agendar%20una%20asesor%C3%ADa%20para%20crecer%20mis%20redes', '_blank');
            });
            chatOptions.appendChild(waBtn);

            const restartBtn = document.createElement('button');
            restartBtn.className = 'chat-option';
            restartBtn.textContent = '🔄 Volver a empezar';
            restartBtn.addEventListener('click', startChat);
            chatOptions.appendChild(restartBtn);
        });
    }
});
