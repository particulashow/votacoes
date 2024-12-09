// Inicializa os votos
const votes = { yes: 0, no: 0 };

// Função para obter o streamID do StreamNinja
async function fetchStreamID() {
    try {
        const response = await fetch('https://socialstream.ninja/api/getStreamID'); // Substituir pelo endpoint correto
        const data = await response.json();
        return data.streamID; // Ajustar de acordo com a resposta da API
    } catch (error) {
        console.error('Erro ao obter o streamID:', error);
        return null;
    }
}

// Função para ligar ao WebSocket e processar votos
async function startWebSocket() {
    const streamID = await fetchStreamID();

    if (!streamID) {
        console.error('Não foi possível obter o streamID.');
        return;
    }

    console.log('streamID obtido:', streamID);

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
}

// Inicia o processo
startWebSocket();
