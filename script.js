document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio
    
    //Pega os valores
    var nome = document.getElementById('nome').value.trim();
    var acesso = document.getElementById('acesso').value.trim();
    var senha = document.getElementById('senha').value;
    var mensagem = document.getElementById('mensagem');
    
    //Limpa mensagem anterior
    mensagem.textContent = '';
    mensagem.style.color = '';
    console.log(nome,acesso,senha,mensagem);
    
    
    //VALIDA CAMPOS VAZIOS
    if (nome === '' || acesso === '' || senha === '') {
        mensagem.textContent = 'Por favor, preencha todos os campos.';
        mensagem.style.color = '';
        mensagem.style.fontWeight = 'bold';
        return; // PARA AQUI
    }
    
    //VALIDA SENHA (8+ caracteres)
    if (senha.length < 8) {
        mensagem.textContent = 'A senha deve ter pelo menos 8 caracteres.';
        mensagem.style.color = '';
        mensagem.style.fontWeight = 'bold';
        return; // PARA AQUI
    }
    
    //SE CHEGOU AQUI, TUDO OK
    mensagem.textContent = 'Dados validados com sucesso!';
    mensagem.style.color = '';
    mensagem.style.fontWeight = 'bold';
    
    //NIVEL DE ACESSO
    if (acesso.toLowerCase() !== 'admin') {
        mensagem.innerHTML += '<br>Apenas visualização de dados';
    }
    else{
        mensagem.innerHTML += '<br>Acesso liberado!';
    }
});