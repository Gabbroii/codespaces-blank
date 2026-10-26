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
    const inputCep = document.getElementById('input-cep');
    const btnBuscarCep = document.getElementById('btn-buscar-cep');
    const divResultadoCep = document.getElementById('resultado-endereco');

btnBuscarCep.addEventListener('click', async () => {
    
    // Pegamos o texto que o utilizador escreveu
    let cepDigitado = inputCep.value;
    
    // Montamos a URL juntando o endereço do ViaCEP com o CEP digitado
    let urlViaCep = `https://viacep.com.br/ws/${cepDigitado}/json/`;

    divResultadoCep.innerHTML = 'A buscar...';

    try {
        let resposta = await fetch(urlViaCep);
            
            if (!resposta.ok) { 
                throw new Error('Erro de comunicação com a API.');
            }
        let dadosCep = await resposta.json();

        if (dadosCep.erro) {
    throw new Error('O CEP não existe.');
}

        console.log("Chegou do ViaCEP:", dadosCep);

        divResultadoCep.innerHTML = `
            > RUA: ${dadosCep.logradouro} <br>
            > BAIRRO: ${dadosCep.bairro} <br>
            > CIDADE: ${dadosCep.localidade} - ${dadosCep.uf}
        `;
        
    } catch (erro) {
        divResultadoCep.innerHTML = '[ERRO] Falha ao buscar o CEP.';
    }
});

    // 1. CARREGAR DISCIPLINAS DA API
    async function carregarDisciplinas() {
        status.innerHTML = 'A carregar dados...';
        
        try {
            let resposta = await fetch('/api/disciplinas/');
            
            if (!resposta.ok) { 
                throw new Error('Erro ao ligar ao servidor.');
            }
            
            let disciplinas = await resposta.json();
            
            lista.innerHTML = ''; 
            
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
                    
                    // Muda o texto do botão
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

    async function carregarPerfil() {
    try {
        let resposta = await fetch('/api/perfil');
        let perfilDaApi = await resposta.json();
        

        document.getElementById('bio-nome').textContent = perfilDaApi.nome;
        document.getElementById('bio-curso').textContent = perfilDaApi.curso;
        

        if (perfilDaApi.endereco) {
            document.getElementById('bio-endereco').textContent = perfilDaApi.endereco;
        } else {
            document.getElementById('bio-endereco').textContent = "---";
        }
    } catch (erro) {
        console.error('Erro ao carregar o perfil:', erro);
    }
}

const btnSalvarPerfil = document.getElementById('btn-salvar-perfil');

btnSalvarPerfil.addEventListener('click', async () => {

    let textoEndereco = divResultadoCep.innerText;


    try {
        let resposta = await fetch('/api/perfil', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: "Gustavo Italo de Oliveira", // O nome exigido na validação
                curso: "Ciência da Computação",    // O curso exigido na validação
                endereco: textoEndereco            // O novo endereço
            })
        });

        if (resposta.ok) {
            carregarPerfil(); 
            divResultadoCep.innerHTML = 'Endereço salvo com sucesso!';
        }
    } catch (erro) {
        console.error('Erro ao salvar:', erro);
    }
});


    carregarPerfil();
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