// Configuração inicial
const socket = new WebSocket("wss://io.socialstream.ninja");
const votes = { yes: 0, no: 0 };

// Atualiza os votos e as barras
function updateUI() {
    const totalVotes = votes.yes + votes.no;

    // Calcula as percentagens
    const yesPercentage = totalVotes > 0 ? (votes.yes / totalVotes) * 100 : 0;
    const noPercentage = totalVotes > 0 ? (votes.no / totalVotes) * 100 : 0;

    // Atualiza os gráficos
    document.getElementById('yes-bar').style.height = `${yesPercentage}%`;
    document.getElementById('no-bar').style.height = `${noPercentage}%`;

    // Atualiza os números
    document.getElementById('yes-count').textContent = votes.yes;
    document.getElementById('no-count').textContent = votes.no;
}

// Quando a conexão é aberta
socket.onopen = () => {
    console.log("Ligado ao WebSocket!");
};

// Quando uma mensagem é recebida
socket.onmessage = (event) => {
    try {
        const message = JSON.parse(event.data);
        const text = message.text?.trim().toLowerCase();

        if (text === "sim") {
            votes.yes++;
        } else if (text === "não") {
            votes.no++;
        }

        updateUI();
    } catch (error) {
        console.error("Erro ao processar mensagem:", error);
    }
};

// Quando ocorre um erro
socket.onerror = (error) => {
    console.error("Erro no WebSocket:", error);
};

// Quando a conexão é encerrada
socket.onclose = (event) => {
    console.log(`Conexão encerrada. Código: ${event.code}, Motivo: ${event.reason}`);
};
