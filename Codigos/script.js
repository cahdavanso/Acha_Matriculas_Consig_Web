document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleção de Elementos
    const boxFront = document.getElementById('uploadFront');
    const boxAverbados = document.getElementById('uploadAverbados');
    
    // Pegamos os inputs reais que estão escondidos
    const inputFront = boxFront.querySelector('input[type="file"]');
    const inputAverbados = boxAverbados.querySelector('input[type="file"]');
    
    const selectFolderButton = document.getElementById('selectFolder');
    const returnPathInput = document.getElementById('returnPath');
    const processDataButton = document.getElementById('processData');

    // 2. Lógica de Clique nas Caixas (Trigger)
    // Quando clicar na Div, ele "clica" no input invisível
    boxFront.addEventListener('click', () => inputFront.click());
    boxAverbados.addEventListener('click', () => inputAverbados.click());

    // 3. Feedback Visual ao Selecionar Arquivo
    // Muda o texto "DRAG AND DROP" pelo nome do arquivo selecionado
    inputFront.addEventListener('change', () => {
        if (inputFront.files.length > 0) {
            const fileName = inputFront.files[0].name;
            boxFront.querySelector('span').innerText = "Arquivo Selecionado:";
            boxFront.querySelector('p').innerText = fileName;
            boxFront.style.borderColor = "#00bcd4"; // Cor de destaque
            boxFront.style.boxShadow = "0 0 15px rgba(0, 188, 212, 0.4)";
        }
    });

    inputAverbados.addEventListener('change', () => {
        if (inputAverbados.files.length > 0) {
            const fileName = inputAverbados.files[0].name;
            boxAverbados.querySelector('span').innerText = "Arquivo Selecionado:";
            boxAverbados.querySelector('p').innerText = fileName;
            boxAverbados.style.borderColor = "#00bcd4";
            boxAverbados.style.boxShadow = "0 0 15px rgba(0, 188, 212, 0.4)";
        }
    });

    // 4. Seleção de Pasta (Simulada para Front-end)
    selectFolderButton.addEventListener('click', () => {
        // Como navegadores não acessam pastas locais por segurança, 
        // aqui simulamos um caminho. No Python (Flask), você pode definir isso no backend.
        const caminhoSimulado = "C:\\Matriculas_Corretas\\Retorno_Arquivos";
        returnPathInput.value = caminhoSimulado;
    });


// No seu script.js atualizado:

document.getElementById('selectFolder').addEventListener('click', async () => {
    // Aqui fazemos uma chamada ao seu futuro backend Python (Flask)
    // que terá o poder de abrir o explorador de arquivos do Windows
    try {
        const response = await fetch('/escolher-pasta');
        const data = await response.json();
        if (data.path) {
            document.getElementById('returnPath').value = data.path;
        }
    } catch (error) {
        // Enquanto você não rodar o Python, vamos deixar você digitar:
        alert("Para abrir o explorador automático, o script Python precisa estar rodando. Por enquanto, você pode digitar o caminho no campo ao lado.");
        document.getElementById('returnPath').readOnly = false;
        document.getElementById('returnPath').focus();
    }
});



    // 5. Botão Processar (Integração com Python)
    processDataButton.addEventListener('click', () => {
        const file1 = inputFront.files[0];
        const file2 = inputAverbados.files[0];
        const path = returnPathInput.value;

        if (!file1 || !file2 || !path) {
            alert("⚠️ Por favor, selecione os dois arquivos e o caminho de retorno!");
            return;
        }

        // Aqui você enviaria os dados para o seu script Python
        console.log("Iniciando processamento...");
        alert(`🚀 Sucesso!\nProcessando: ${file1.name} e ${file2.name}`);
        
        /* Exemplo de como você enviará para o Python (Flask):
        let formData = new FormData();
        formData.append('front', file1);
        formData.append('averbados', file2);
        formData.append('caminho', path);

        fetch('/processar', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => alert(data.mensagem));
        */
    });

    // 6. Drag and Drop (Opcional - Melhoria visual)
    [boxFront, boxAverbados].forEach(box => {
        box.addEventListener('dragover', (e) => {
            e.preventDefault();
            box.style.background = "rgba(0, 188, 212, 0.1)";
        });
        box.addEventListener('dragleave', () => {
            box.style.background = "rgba(255, 255, 255, 0.05)";
        });
        box.addEventListener('drop', (e) => {
            e.preventDefault();
            box.style.background = "rgba(255, 255, 255, 0.05)";
            const files = e.dataTransfer.files;
            if (box === boxFront) { inputFront.files = files; inputFront.dispatchEvent(new Event('change')); }
            if (box === boxAverbados) { inputAverbados.files = files; inputAverbados.dispatchEvent(new Event('change')); }
        });
    });
});

const form = document.getElementById('uploadForm');

form.onsubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('front_file', document.querySelector('#uploadFront input').files[0]);
    formData.append('averbados_file', document.querySelector('#uploadAverbados input').files[0]);
    formData.append('output_path', document.getElementById('returnPath').value);

    const response = await fetch('/processar', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    alert(result.mensagem || result.erro);
};