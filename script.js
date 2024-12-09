// Configuração do streamID e votos
const streamID = "748c0ff7"; // Substituir pelo streamID real
const votes = { yes: 0, no: 0 };

// Conecta ao WebSocket do StreamNinja
const socket = new WebSocket(`wss://socialstream.ninja/socket?streamID=${streamID}`);

// Atualiza os votos e o gráfico
function updateUI() {
    const totalVotes = votes.yes + votes.no;

    // Calcula as percentagens
    const yesPercentage = totalVotes > 0 ? (votes.yes / totalVotes) * 100 : 0;
    const noPercentage = totalVotes > 0 ? (votes.no / totalVotes) * 100 : 0;

    // Atualiza os gráficos
    document.getElementById('yes-inner').style.height = `${yesPercentage}%`;
    document.getElementById('no-inner').style.height = `${noPercentage}%`;

    // Atualiza os números
    document.getElementById('yes-count').textContent = votes.yes;
    document.getElementById('no-count').textContent = votes.no;
}

// Processa mensagens recebidas do WebSocket
socket.onmessage = (event) => {
    try {
        const message = JSON.parse(event.data);

        // Verifica o streamID e processa o texto
        if (message.streamID === streamID) {
            const text = message.text?.trim().toLowerCase();

            // Incrementa os votos com base no texto
            if (text === 'sim') votes.yes++;
            if (text === 'não') votes.no++;

            updateUI();
        }
    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
    }
};

// Log de conexão
socket.onopen = () => console.log('Ligação ao WebSocket estabelecida!');
socket.onerror = (error) => console.error('Erro no WebSocket:', error);
