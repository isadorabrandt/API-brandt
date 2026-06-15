const servicos = [
    {
        nome: "Estética de Manutenção",
        valor: 180
    },
    {
        nome: "Higienização Interna",
        valor: 250
    },
    {
        nome: "Polimento Comercial",
        valor: 400
    },
    {
        nome: "Polimento Técnico",
        valor: 700
    },
    {
        nome: "Película Automotiva",
        valor: 350
    }
];

const servicosContainer =
    document.getElementById("servicos-container");
let numeroOrcamento =
    localStorage.getItem("ultimoOrcamento") || 1;
/* =========================
   CRIA SERVIÇOS
========================= */

servicos.forEach((servico, index) => {

    servicosContainer.innerHTML += `
    
        <div class="servico-item">

            <input
                type="checkbox"
                id="check${index}"
            >

            <span>
                ${servico.nome}
            </span>

            <input
                type="number"
                id="valor${index}"
                value="${servico.valor}"
                min="0"
            >

        </div>

    `;
});

localStorage.setItem(
    "ultimoOrcamento",
    Number(numeroOrcamento) + 1
);

/* =========================
   DATA AUTOMÁTICA
========================= */

function atualizarData() {

    const hoje = new Date();

    const dataFormatada =
        hoje.toLocaleDateString('pt-BR');

    document.getElementById(
        "previewData"
    ).textContent = dataFormatada;
}

/* =========================
   GERA PREVIEW
========================= */

function gerarPreview() {

    const cliente =
        document.getElementById("cliente").value;

    const veiculo =
        document.getElementById("veiculo").value;

    const observacoes =
        document.getElementById("observacoes").value;

    document.getElementById(
        "previewCliente"
    ).textContent = cliente || "---";

    document.getElementById(
        "previewVeiculo"
    ).textContent = veiculo || "---";

    document.getElementById(
        "previewObservacoes"
    ).textContent =
        observacoes || "Nenhuma observação.";

    let total = 0;

    let html = "";

    servicos.forEach((servico, index) => {

        const marcado =
            document.getElementById(
                `check${index}`
            ).checked;

        const valor =
            Number(
                document.getElementById(
                    `valor${index}`
                ).value
            );

        if (marcado) {

            total += valor;

            html += `
            
                <div class="servico-card">

                    <span class="nome">
                        ${servico.nome}
                    </span>

                    <span class="valor">
                        R$ ${valor.toFixed(2)}
                    </span>

                </div>

            `;
        }

    });

    document.getElementById(
        "listaServicos"
    ).innerHTML = html;

    document.getElementById(
        "valorTotal"
    ).textContent =
        `R$ ${total.toFixed(2)}`;
}

/* =========================
   EVENTOS AUTOMÁTICOS
========================= */

document.getElementById(
    "cliente"
).addEventListener(
    "input",
    gerarPreview
);

document.getElementById(
    "veiculo"
).addEventListener(
    "input",
    gerarPreview
);

document.getElementById(
    "observacoes"
).addEventListener(
    "input",
    gerarPreview
);

/* =========================
   OBSERVA CHECKBOXES
========================= */

function registrarEventosServicos() {

    servicos.forEach((_, index) => {

        document.getElementById(
            `check${index}`
        ).addEventListener(
            "change",
            gerarPreview
        );

        document.getElementById(
            `valor${index}`
        ).addEventListener(
            "input",
            gerarPreview
        );

    });

}

registrarEventosServicos();

/* =========================
   SALVAR HISTÓRICO
========================= */

function salvarHistorico(orcamento) {

    console.log("SALVOU");

    const historico =
        obterHistorico();

    historico.unshift(orcamento);

    localStorage.setItem(
        "historicoOrcamentos",
        JSON.stringify(historico)
    );

    renderizarHistorico();

}

/* =========================
   BAIXAR PNG
========================= */

function baixarPNG() {

    const historico =
        obterHistorico();

    const numero =
        historico.length + 1;

    const clienteNome =
        document.getElementById("cliente").value || "Sem Nome";

    const veiculoNome =
        document.getElementById("veiculo").value || "-";

    const totalTexto =
        document.getElementById("valorTotal").textContent;

    const total =
        Number(
            totalTexto
                .replace("R$", "")
                .replace(",", ".")
                .trim()
        ) || 0;

    salvarHistorico({

        numero,

        cliente: clienteNome,

        veiculo: veiculoNome,

        total,

        data: new Date().toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })

    });

    const elemento =
        document.getElementById("orcamento");

    html2canvas(elemento, {

        scale: 3,

        backgroundColor: "#000000",

        useCORS: true

    }).then(canvas => {

        const link =
            document.createElement("a");

        const cliente =
            clienteNome
                .trim()
                .replace(/\s+/g, "-")
                .toLowerCase();

        link.download =
            cliente
                ? `orcamento-${cliente}.png`
                : "orcamento-brandt.png";

        link.href =
            canvas.toDataURL("image/png");

        link.click();

    });

}



/* =========================
   HISTÓRICO
========================= */

function obterHistorico() {

    return JSON.parse(
        localStorage.getItem("historicoOrcamentos")
    ) || [];

}

function salvarHistorico(orcamento) {

    const historico =
        obterHistorico();

    historico.unshift(orcamento);

    localStorage.setItem(
        "historicoOrcamentos",
        JSON.stringify(historico)
    );

    renderizarHistorico();

}

/* =========================
   RENDERIZA HISTÓRICO
========================= */

function renderizarHistorico() {

    const historico =
        obterHistorico();

    const container =
        document.getElementById("historico");

    if (!container) return;

    container.innerHTML = "";

    historico.forEach(item => {
        container.innerHTML += `

    <div class="item-historico">

        <strong>
            #${String(item.numero)
                .padStart(4, "0")}
            - ${item.cliente}
        </strong>

        <small>
            ${item.veiculo}
        </small>

        <br>

        <small>
            ${item.data}
        </small>

        <br>

        <small>
            R$ ${item.total.toFixed(2)}
        </small>

    </div>

`;
        `;

    });

}
/* =========================
   INICIALIZA
========================= */

window.addEventListener("DOMContentLoaded", () => {

    atualizarData();

    gerarPreview();

    renderizarHistorico();

});