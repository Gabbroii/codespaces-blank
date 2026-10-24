document.addEventListener('DOMContentLoaded', () => {

    // VARIÁVEIS GLOBAIS DE INTERFACE (Organizamos tudo aqui no topo)
    const lista = document.getElementById('subjects-list');
    const status = document.getElementById('status-message');
    const divErro = document.getElementById('mensagem-erro'); // Corrigido de class para id
    const editForms = document.getElementById('edit-forms');
    const inputNome = document.getElementById('nome-disciplina');
    const inputSemestre = document.getElementById('semestre-disciplina');
    const inputId = document.getElementById('id-disciplina');
    const submitBtn = document.getElementById('submit-btn');

    // 1. CARREGAR DISCIPLINAS DA API
    async function carregarDisciplinas() {
        status.innerHTML = 'A carregar dados...';
        
        try {
            let resposta = await fetch('/api/disciplinas');
            
            if (!resposta.ok) { // '!resposta.ok' é o mesmo que 'resposta.ok == false', fica mais limpo
                throw new Error('Erro ao ligar ao servidor.');
            }
            
            let disciplinas = await resposta.json();
            
            lista.innerHTML = ''; 
            
            // Usando 'for...of' (mais moderno e legível que o for com 'i')
            for (let d of disciplinas) {
                let li = document.createElement('li');
                li.className = 'subject-item';
                
                li.innerHTML = `
                    <div>
                        <span class="subject-name">${d.nome} </span>
                        <span class="subject-semester">[Sem. ${d.semestre}]</span>
                    </div>
                    <button class="btn-editar">[ Editar ]</button>
                `;

                // Adiciona o evento ao botão "Editar" desta linha
                let btnEditar = li.querySelector('.btn-editar');
                btnEditar.addEventListener('click', () => {
                    // Preenche os campos
                    inputNome.value = d.nome;
                    inputSemestre.value = d.semestre;
                    inputId.value = d.id; 
                    
                    // Muda o texto do botão (Corrigido erro de concatenação +=)
                    submitBtn.textContent = '[ EDITANDO... ]';
                });
                
                lista.appendChild(li);
            }
            
            status.innerHTML = ''; // Limpa a mensagem "A carregar"
            
        } catch (erro) {
            status.innerHTML = '[ERRO] Não foi possível carregar as disciplinas.';
            status.style.color = 'var(--accent-color)';
        }
    }

    // Chamada inicial
    carregarDisciplinas();


    // 2. MODO ESCURO
    const btnModo = document.getElementById('btn-modo');
    const body = document.body;

    // Inicialização do Modo Escuro
    if (localStorage.getItem('modo-escuro') === 'sim') {
        body.classList.add('dark');
        btnModo.textContent = '[ MODO CLARO ]';
    }

    btnModo.addEventListener('click', () => {
        body.classList.toggle('dark');
        
        if (body.classList.contains('dark')) {
            localStorage.setItem('modo-escuro', 'sim');
            btnModo.textContent = '[ MODO CLARO ]';
        } else {
            localStorage.setItem('modo-escuro', 'nao');
            btnModo.textContent = '[ MODO ESCURO ]';
        }
    });


    // 3. FECHAR AVISO DE BOAS-VINDAS
    const btnEntendi = document.getElementById('close-welcome');
    const modal = document.getElementById('modal');

    btnEntendi.addEventListener('click', () => {
        modal.classList.add('hidden');
    });


    // 4. BOTÃO DE CONTATO
    const contactBtn = document.getElementById('contact-btn');
    contactBtn.addEventListener('click', () => {
        alert('A INICIAR PROTOCOLO DE CONTACTO...');
    });


    // 5. LÓGICA DE FORMS (CRIAR/EDITAR)
    editForms.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede a página de recarregar

        // Pegar valores
        let nome = inputNome.value.toUpperCase();
        let semestre = inputSemestre.value;

        // Decidir Ação
        let isEditing = inputId.value !== '';
        let metodo = isEditing ? 'PUT' : 'POST';
        let url = isEditing ? '/api/disciplinas/' + inputId.value : '/api/disciplinas';
            
        try {
            let resposta = await fetch(url, {
                method: metodo, 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, semestre }) // {nome, semestre} é atalho para {nome: nome, semestre: semestre}
            });

            if (!resposta.ok) {
                let erroDaApi = await resposta.text(); 
                divErro.innerHTML = '[ERRO] ' + erroDaApi;
            } else {
                divErro.innerHTML = ''; // Limpa aviso de erro
                
                // Limpar campos de texto alterando a propriedade '.value' dos elementos HTML (corrigido)
                inputNome.value = '';
                inputSemestre.value = '';
                inputId.value = ''; 
                submitBtn.textContent = '[ GUARDAR ]'; // Volta o botão ao normal

                carregarDisciplinas(); // Atualiza a lista na tela
            }

        } catch (erro) {
            console.error('Falha de ligação:', erro);
            divErro.innerHTML = '[ERRO] Falha ao comunicar com o servidor.';
        }
    });

});