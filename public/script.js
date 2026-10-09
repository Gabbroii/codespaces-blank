document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // DISCIPLINAS ATUAIS
    // ==========================================
    const currentSubjects = [
        { nome: "Gerência de Projetos", semestre: 8 },
        { nome: "Sistema de Apoio à Decisão", semestre: 8 },
        { nome: "Tecnologias de Internet", semestre: 8 },
        { nome: "Ciências Sociais e Políticas", semestre: 8 }
    ];

const subjectsListUl = document.getElementById('subjects-list'); // ou getElementById('lista') dependendo do ID que você colocou no HTML

    if (subjectsListUl) {
        // Limpa a lista caso já tenha algo
        subjectsListUl.innerHTML = '';

        // Cria dinamicamente um <li> para cada disciplina da lista
        currentSubjects.forEach(subject => {
            const li = document.createElement('li');
            
            // AQUI MUDOU: agora usamos subject.nome e subject.semestre
            li.textContent = `${subject.nome} (${subject.semestre}º semestre)`;
            
            subjectsListUl.appendChild(li);
        });
    }
    // 1. Funcionalidade do Modo Escuro
    const btnModo = document.getElementById('btn-modo');
    const body = document.body;

    // Verifica se o usuário já tinha o modo escuro salvo no navegador
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark');
        if (btnModo) btnModo.textContent = 'Modo Claro';
    }

    if (btnModo) {
        btnModo.addEventListener('click', () => {
            body.classList.toggle('dark');
            
            if (body.classList.contains('dark')) {
                localStorage.setItem('darkMode', 'enabled');
                btnModo.textContent = 'Modo Claro';
            } else {
                localStorage.setItem('darkMode', 'disabled');
                btnModo.textContent = 'Modo Escuro';
            }
        });
    }

    // 2. Funcionalidade para fechar o Banner/Modal de Boas-Vindas
    // Procurando pelo botão "Entendi" (pode ser #close-welcome ou dentro do modal)
    const btnEntendi = document.querySelector('button') || document.getElementById('close-welcome');
    const welcomeContainer = document.querySelector('[role="alert"]') || document.querySelector('.modal-overlay') || document.querySelector('.welcome-banner');

    if (btnEntendi && welcomeContainer) {
        btnEntendi.addEventListener('click', () => {
            // Se for um modal/overlay, esconde ele inteiro. Se for só o elemento, oculta-o.
            const overlay = welcomeContainer.closest('.modal-overlay') || welcomeContainer;
            overlay.classList.add('hidden');
        });
    }

    // 3. Interatividade Opcional para o Botão de Contato e Likes
    const contactBtn = document.getElementById('contact-btn');
    const likesSpan = document.querySelector('.likes');

    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            alert('Por favor, entre em contato com @Mariana através das redes sociais!');
        });
    }
});