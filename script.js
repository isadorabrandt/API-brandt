/* ==========================================
   01 - CONFIGURAÇÕES GERAIS
========================================== */

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

let orcamentoEmEdicao = null;

/* ==========================================
   02 - ELEMENTOS
========================================== */

const servicosContainer =
    document.getElementById(
        "servicos-container"
    );


/* ==========================================
   03 - CRIAÇÃO DOS SERVIÇOS
========================================== */

function criarServicoNaTela(servico, index) {

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

}

function carregarServicos() {

    servicosContainer.innerHTML = "";

    servicos.forEach((servico, index) => {

        criarServicoNaTela(
            servico,
            index
        );

    });

}

/* ==========================================
   03.1 - SERVIÇOS SALVOS
========================================== */

function carregarServicosSalvos() {

    const servicosSalvos =
        JSON.parse(
            localStorage.getItem(
                "servicosPersonalizados"
            )
        ) || [];

    servicosSalvos.forEach(servicoSalvo => {

        const jaExiste =
            servicos.some(servico =>
                servico.nome ===
                servicoSalvo.nome
            );

        if (!jaExiste) {

            servicos.push(
                servicoSalvo
            );

        }

    });

}


/* ==========================================
   04 - DATA
========================================== */

function atualizarData() {

    const hoje = new Date();

    document.getElementById(
        "previewData"
    ).textContent =
        hoje.toLocaleDateString("pt-BR");

}

/* ==========================================
   05 - PREVIEW
========================================== */

function gerarPreview() {

    setTimeout(() => {

        gerarPreview();

    }, 100);

    const cliente =
        document.getElementById("cliente").value;

    const veiculo =
        document.getElementById("veiculo").value;

    const observacoes =
        document.getElementById("observacoes").value;

    document.getElementById(
        "previewCliente"
    ).textContent =
        cliente || "---";

    document.getElementById(
        "previewVeiculo"
    ).textContent =
        veiculo || "---";

    document.getElementById(
        "previewObservacoes"
    ).textContent =
        observacoes || "Nenhuma observação.";

    let total = 0;

    let html = "";

    servicos.forEach((servico, index) => {

        const servicosSalvos =
            JSON.parse(
                localStorage.getItem(
                    "servicosPersonalizados"
                )
            ) || [];

        servicosSalvos.forEach(
            servico => {

                const index =
                    servicos.length;

                servicos.push(
                    servico
                );

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

            }
        );

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

/* ==========================================
   06 - EVENTOS
========================================== */

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

/* ==========================================
   07 - HISTÓRICO
========================================== */

function obterHistorico() {

    return JSON.parse(
        localStorage.getItem(
            "historicoOrcamentos"
        )
    ) || [];

}

function salvarHistorico(orcamento) {

    const historico =
        obterHistorico();

    historico.unshift(
        orcamento
    );

    localStorage.setItem(
        "historicoOrcamentos",
        JSON.stringify(historico)
    );

    renderizarHistorico();

}

/* ==========================================
   08 - RENDERIZAR HISTÓRICO
========================================== */

function renderizarHistorico() {

    const historico =
        obterHistorico();

    const container =
        document.getElementById(
            "historico"
        );

    if (!container) return;

    container.innerHTML = "";

    historico.forEach(item => {

        container.innerHTML += `

        <div class="item-historico">

            <strong>
                #${String(item.numero).padStart(4, "0")}
                - ${item.cliente}
            </strong>

            <br>

            <small>
                🚗 ${item.veiculo}
            </small>

            <br>

            <small>
                📅 Criado:
                ${item.dataCriacao}
            </small>

            <br>

            <small>
                ✏️ Atualizado:
                ${item.dataModificacao}
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

/* ==========================================
   09 - GERENCIAMENTO
========================================== */

function excluirOrcamento(numero) {

    if (
        !confirm(
            `Excluir orçamento #${String(numero).padStart(4, "0")} ?`
        )
    ) return;

    let historico =
        obterHistorico();

    historico =
        historico.filter(item =>
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

/* ==========================================
   11 - EXPORTAÇÃO PNG
========================================== */

function baixarPNG() {

    const historico =
        obterHistorico();

    const agora =
        new Date();

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

    const observacoes =
        document.getElementById("observacoes").value;

    const total =
        Number(
            document
                .getElementById("valorTotal")
                .textContent
                .replace("R$", "")
                .replace(",", ".")
                .trim()
        ) || 0;

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

    const novoOrcamento = {

        numero,

        cliente: clienteNome,

        veiculo: veiculoNome,

        observacoes,

        servicos: servicosSelecionados,

        total,

        dataCriacao,

        dataModificacao: dataHora

    };

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

    const elemento =
        document.getElementById(
            "orcamento"
        );

    html2canvas(elemento, {

        scale: 3,

        backgroundColor: "#000",

        useCORS: true

    }).then(canvas => {

        const link =
            document.createElement("a");

        link.download =
            `orcamento-${clienteNome}.png`;

        link.href =
            canvas.toDataURL(
                "image/png"
            );

        link.click();

    });

}

/* ==========================================
   12 - INICIALIZAÇÃO
========================================== */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarServicosSalvos();

        carregarServicos();

        registrarEventosServicos();

        atualizarData();

        gerarPreview();

        renderizarHistorico();

    }
);