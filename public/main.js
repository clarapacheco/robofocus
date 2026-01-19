// RoboFocus - Main JavaScript Application

// ==================== STATE MANAGEMENT ====================
const appState = {
    isAuthenticated: false,
    currentPage: 'dashboard',
    user: {
        name: 'Alex',
        email: 'usuario@instituicao.com.br',
        accessKey: ''
    },
    points: {
        total: 1250,
        completedToday: 3,
        totalToday: 6
    },
    tasks: [
        { id: '1', title: 'Escovar os dentes', time: '07:00', completed: true, category: 'morning' },
        { id: '2', title: 'Café da manhã', time: '07:30', completed: true, category: 'morning' },
        { id: '3', title: 'Fazer lição de casa', time: '14:00', completed: false, category: 'afternoon' },
        { id: '4', title: 'Ler um livro', time: '15:30', completed: true, category: 'afternoon' },
        { id: '5', title: 'Jantar em família', time: '19:00', completed: false, category: 'evening' },
        { id: '6', title: 'Preparar para dormir', time: '21:00', completed: false, category: 'evening' }
    ],
    focus: {
        duration: 25 * 60, // 25 minutes in seconds
        timeRemaining: 25 * 60,
        isActive: false,
        interval: null,
        sessionsToday: 0
    },
    checkin: {
        selectedMood: null,
        note: ''
    },
    chatMessages: [],
    achievements: [
        { id: '1', name: 'Primeira Tarefa', icon: '🎯', unlocked: true },
        { id: '2', name: 'Foco Total', icon: '🧠', unlocked: true },
        { id: '3', name: 'Semana Completa', icon: '📅', unlocked: false },
        { id: '4', name: 'Mestre do Foco', icon: '👑', unlocked: false },
        { id: '5', name: 'Estrela Brilhante', icon: '⭐', unlocked: true },
        { id: '6', name: 'Super Rotina', icon: '💪', unlocked: false }
    ]
};

// ==================== HELPER FUNCTIONS ====================
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getCurrentTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function updateProgress() {
    const completedTasks = appState.tasks.filter(t => t.completed).length;
    appState.points.completedToday = completedTasks;
    const percentage = (completedTasks / appState.tasks.length) * 100;
    
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    const completedDisplay = document.getElementById('completed-today');
    const totalDisplay = document.getElementById('total-today');
    const routineProgress = document.getElementById('routine-progress');
    
    if (completedDisplay) completedDisplay.textContent = completedTasks;
    if (totalDisplay) totalDisplay.textContent = appState.tasks.length;
    if (routineProgress) routineProgress.textContent = `${completedTasks} de ${appState.tasks.length} tarefas completas`;
}

// ==================== NAVIGATION ====================
function navigateTo(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        appState.currentPage = pageName;
    }
    
    // Update navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
    
    // Hide bottom nav on focus page
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) {
        if (pageName === 'focus') {
            bottomNav.style.display = 'none';
        } else {
            bottomNav.style.display = 'flex';
        }
    }
    
    // Load page-specific content
    if (pageName === 'routine') {
        renderRoutine();
    } else if (pageName === 'rewards') {
        renderRewards();
    } else if (pageName === 'dashboard') {
        renderDashboard();
    }
}

// ==================== LOGIN ====================
function initLogin() {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const loginBtn = document.getElementById('login-btn');
    const accessKeyInput = document.getElementById('access-key');
    
    // Auto-uppercase access key
    accessKeyInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
        loginError.classList.add('hidden');
    });
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userName = document.getElementById('user-name').value.trim();
        const accessKey = document.getElementById('access-key').value.trim();
        
        // Validate
        if (!userName) {
            showLoginError('Por favor, insira seu nome');
            return;
        }
        
        if (!accessKey) {
            showLoginError('Por favor, insira sua chave de acesso');
            return;
        }
        
        // Validate access key
        const validKeys = ['ROBO2026', 'FOCUS123', 'INSTITUICAO01'];
        if (!validKeys.includes(accessKey)) {
            showLoginError('Chave de acesso inválida. Verifique com sua instituição.');
            return;
        }
        
        // Success
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span>Verificando...</span>';
        
        setTimeout(() => {
            appState.isAuthenticated = true;
            appState.user.name = userName;
            appState.user.accessKey = accessKey;
            
            document.getElementById('user-name-display').textContent = userName;
            document.getElementById('profile-name').textContent = userName;
            
            navigateTo('dashboard');
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<span>Entrar</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
        }, 800);
    });
}

function showLoginError(message) {
    const errorEl = document.getElementById('login-error');
    const errorText = errorEl.querySelector('p');
    errorText.textContent = message;
    errorEl.classList.remove('hidden');
}

// ==================== DASHBOARD ====================
function renderDashboard() {
    updateProgress();
    
    const pointsDisplay = document.getElementById('dashboard-points');
    if (pointsDisplay) {
        pointsDisplay.textContent = `${appState.points.total} pts`;
    }
}

// ==================== ROUTINE PLANNER ====================
function renderRoutine() {
    const routineSections = document.getElementById('routine-sections');
    if (!routineSections) return;
    
    const categories = {
        morning: { title: 'Manhã', tasks: [] },
        afternoon: { title: 'Tarde', tasks: [] },
        evening: { title: 'Noite', tasks: [] }
    };
    
    // Group tasks by category
    appState.tasks.forEach(task => {
        categories[task.category].tasks.push(task);
    });
    
    // Render sections
    let html = '';
    Object.entries(categories).forEach(([key, section]) => {
        if (section.tasks.length === 0) return;
        
        html += `
            <div class="card">
                <h3>${section.title}</h3>
                <div class="task-list">
        `;
        
        section.tasks.forEach(task => {
            html += `
                <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask('${task.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <div class="task-details">
                        <div class="task-title">${task.title}</div>
                        <div class="task-time">${task.time}</div>
                    </div>
                    <div class="task-category ${task.category}">${section.title}</div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    routineSections.innerHTML = html;
    updateProgress();
}

function toggleTask(taskId) {
    const task = appState.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    task.completed = !task.completed;
    
    if (task.completed) {
        appState.points.total += 10;
    } else {
        appState.points.total -= 10;
    }
    
    renderRoutine();
    updateProgress();
}

// ==================== FOCUS MODE ====================
function initFocusMode() {
    const playBtn = document.getElementById('focus-play');
    const pauseBtn = document.getElementById('focus-pause');
    const resetBtn = document.getElementById('focus-reset');
    const closeBtn = document.getElementById('focus-close');
    const timerDisplay = document.getElementById('timer-display');
    const focusLogo = document.getElementById('focus-logo');
    
    playBtn.addEventListener('click', startFocus);
    pauseBtn.addEventListener('click', pauseFocus);
    resetBtn.addEventListener('click', resetFocus);
    closeBtn.addEventListener('click', () => navigateTo('dashboard'));
    
    updateTimerDisplay();
}

function startFocus() {
    appState.focus.isActive = true;
    document.getElementById('focus-play').classList.add('hidden');
    document.getElementById('focus-pause').classList.remove('hidden');
    document.getElementById('focus-logo').classList.add('active');
    
    appState.focus.interval = setInterval(() => {
        if (appState.focus.timeRemaining > 0) {
            appState.focus.timeRemaining--;
            updateTimerDisplay();
        } else {
            // Timer complete
            completeFocusSession();
        }
    }, 1000);
}

function pauseFocus() {
    appState.focus.isActive = false;
    document.getElementById('focus-play').classList.remove('hidden');
    document.getElementById('focus-pause').classList.add('hidden');
    document.getElementById('focus-logo').classList.remove('active');
    
    if (appState.focus.interval) {
        clearInterval(appState.focus.interval);
    }
}

function resetFocus() {
    pauseFocus();
    appState.focus.timeRemaining = appState.focus.duration;
    updateTimerDisplay();
}

function completeFocusSession() {
    pauseFocus();
    appState.focus.sessionsToday++;
    appState.points.total += 50;
    
    const sessionsDisplay = document.getElementById('focus-sessions');
    if (sessionsDisplay) {
        sessionsDisplay.textContent = appState.focus.sessionsToday;
    }
    
    alert('🎉 Parabéns! Você completou uma sessão de foco! +50 pontos');
    resetFocus();
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
        timerDisplay.textContent = formatTime(appState.focus.timeRemaining);
    }
    
    const sessionsDisplay = document.getElementById('focus-sessions');
    if (sessionsDisplay) {
        sessionsDisplay.textContent = appState.focus.sessionsToday;
    }
}

// ==================== EMOTIONAL CHECK-IN ====================
function initCheckin() {
    const moodBtns = document.querySelectorAll('.mood-btn');
    const submitBtn = document.getElementById('checkin-submit');
    const doneBtn = document.getElementById('checkin-done');
    
    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            moodBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            appState.checkin.selectedMood = btn.dataset.mood;
        });
    });
    
    submitBtn.addEventListener('click', () => {
        if (!appState.checkin.selectedMood) {
            alert('Por favor, selecione como você está se sentindo');
            return;
        }
        
        appState.checkin.note = document.getElementById('checkin-note').value;
        appState.points.total += 10;
        
        // Show success
        document.getElementById('checkin-content').classList.add('hidden');
        document.getElementById('checkin-success').classList.remove('hidden');
    });
    
    doneBtn.addEventListener('click', () => {
        // Reset
        document.getElementById('checkin-content').classList.remove('hidden');
        document.getElementById('checkin-success').classList.add('hidden');
        document.getElementById('checkin-note').value = '';
        appState.checkin.selectedMood = null;
        moodBtns.forEach(b => b.classList.remove('selected'));
        
        navigateTo('dashboard');
    });
}

// ==================== AI CHAT ====================
function initChat() {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addChatMessage(message, 'user');
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const response = getBotResponse(message);
            addChatMessage(response, 'bot');
        }, 1000);
    });
}

function addChatMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}-message`;
    
    messageEl.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
        </div>
        <span class="message-time">${getCurrentTime()}</span>
    `;
    
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    appState.chatMessages.push({ text, sender, time: new Date() });
}

function getBotResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('ajuda') || msg.includes('help')) {
        return 'Estou aqui para ajudar! Você pode me perguntar sobre suas tarefas, dicas de foco, ou apenas conversar. Como posso ajudá-lo?';
    } else if (msg.includes('tarefa') || msg.includes('rotina')) {
        return `Você tem ${appState.points.completedToday} tarefas completas hoje! Quer ver sua rotina completa?`;
    } else if (msg.includes('foco')) {
        return 'O modo foco é ótimo para ajudar você a se concentrar! Que tal fazer uma sessão de 25 minutos agora?';
    } else if (msg.includes('ponto')) {
        return `Você tem ${appState.points.total} pontos! Continue assim e desbloqueie mais conquistas!`;
    } else if (msg.includes('obrigad')) {
        return 'De nada! Estou sempre aqui para ajudar você 😊';
    } else if (msg.includes('oi') || msg.includes('olá') || msg.includes('ola')) {
        return `Olá, ${appState.user.name}! Como posso ajudá-lo hoje?`;
    } else {
        return 'Interessante! Conte-me mais sobre isso. Estou aqui para ouvir e ajudar.';
    }
}

// ==================== REWARDS ====================
function renderRewards() {
    const totalPointsEl = document.getElementById('total-points');
    if (totalPointsEl) {
        totalPointsEl.textContent = appState.points.total;
    }
    
    const achievementsGrid = document.getElementById('achievements-grid');
    if (!achievementsGrid) return;
    
    let html = '';
    appState.achievements.forEach(achievement => {
        html += `
            <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">
                    <span style="font-size: 24px">${achievement.icon}</span>
                </div>
                <div class="achievement-name">${achievement.name}</div>
            </div>
        `;
    });
    
    achievementsGrid.innerHTML = html;
}

// ==================== PROFILE ====================
function initProfile() {
    const logoutBtn = document.getElementById('logout-btn');
    
    logoutBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja sair?')) {
            logout();
        }
    });
}

function logout() {
    appState.isAuthenticated = false;
    appState.currentPage = 'login';
    
    // Reset form
    document.getElementById('user-name').value = '';
    document.getElementById('access-key').value = '';
    
    navigateTo('login');
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize login
    initLogin();
    
    // Initialize other features
    initFocusMode();
    initCheckin();
    initChat();
    initProfile();
    
    // Navigation listeners
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navigateTo(item.dataset.page);
        });
    });
    
    // Quick action buttons
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navigateTo(btn.dataset.navigate);
        });
    });
    
    // Start on login page
    navigateTo('login');
});
