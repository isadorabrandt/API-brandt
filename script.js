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


    let orcamentoEmEdicao = null;

    document.getElementById(
        "modoEdicao"
    ).textContent = "";


    const historico =
        obterHistorico();

    const agora = new Date();

    const dataHora =
        agora.toLocaleDateString("pt-BR") +
        " às " +
        agora.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });

    let numero;

    let dataCriacao;

    if (orcamentoEmEdicao) {

        numero =
            orcamentoEmEdicao.numero;

        dataCriacao =
            orcamentoEmEdicao.dataCriacao;

    } else {

        numero =
            historico.length + 1;

        dataCriacao =
            dataHora;

    }

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

    const observacoes =
        document.getElementById("observacoes").value;

    const servicosSelecionados = [];

    servicos.forEach((servico, index) => {

        if (
            document.getElementById(
                `check${index}`
            ).checked
        ) {

            servicosSelecionados.push({

                nome: servico.nome,

                valor: Number(
                    document.getElementById(
                        `valor${index}`
                    ).value
                )

            });

        }

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

if (orcamentoEmEdicao) {

    const indice =
        historico.findIndex(item =>
            item.numero === numero
        );

    historico[indice] =
        novoOrcamento;

    localStorage.setItem(
        "historicoOrcamentos",
        JSON.stringify(historico)
    );

    renderizarHistorico();

    orcamentoEmEdicao = null;

} else {

    salvarHistorico(
        novoOrcamento
    );

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
                  📅 Criado:
                    ${item.dataCriacao || "-"}

                <br>

                <small>
                    ✏️ Atualizado:
                        ${item.dataModificacao || "-"}
                </small>

                <br>

                <small>
                    R$ ${item.total.toFixed(2)}
                </small>

                <div class="acoes-historico">

    <button
        class="btn-reabrir"
        onclick="reabrirOrcamento(${item.numero})">

        📂 Reabrir

    </button>

    <button
        class="btn-excluir"
        onclick="excluirOrcamento(${item.numero})">

        🗑 Excluir

    </button>

</div>




 </div>

        `;

    });

}

/* =========================
   EXCLUIR ORÇAMENTOS   
========================= */

function excluirOrcamento(numero) {

    const confirmar = confirm(
        `Deseja excluir o orçamento #${String(numero).padStart(4, "0")} ?`
    );

    if (!confirmar) return;

    let historico = obterHistorico();

    historico = historico.filter(item =>
        item.numero !== numero
    );

    localStorage.setItem(
        "historicoOrcamentos",
        JSON.stringify(historico)
    );

    renderizarHistorico();

}


/* =========================
   REABRIR ORÇAMENTOS   
========================= */

function reabrirOrcamento(numero) {

    const historico =
        obterHistorico();

    const orcamento =
        historico.find(item =>
            item.numero === numero
        );

    if (!orcamento) return;

    orcamentoEmEdicao =
        orcamento;

    document.getElementById(
        "modoEdicao"
    ).textContent =
        `Editando orçamento #${String(numero).padStart(4, "0")}`;

    document.getElementById("cliente").value =
        orcamento.cliente || "";

    document.getElementById("veiculo").value =
        orcamento.veiculo || "";

    document.getElementById("observacoes").value =
        orcamento.observacoes || "";

    servicos.forEach((servico, index) => {

        document.getElementById(
            `check${index}`
        ).checked = false;

    });

    if (orcamento.servicos) {

        orcamento.servicos.forEach(servicoSalvo => {

            servicos.forEach((servico, index) => {

                if (
                    servico.nome ===
                    servicoSalvo.nome
                ) {

                    document.getElementById(
                        `check${index}`
                    ).checked = true;

                    document.getElementById(
                        `valor${index}`
                    ).value =
                        servicoSalvo.valor;

                }

            });

        });

    }

    gerarPreview();

}