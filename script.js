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

    console.log(
        "CRIANDO SERVIÇO:",
        index,
        servico.nome
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

function carregarServicos() {

    console.log("CARREGANDO SERVIÇOS");

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

        const existe =
            servicos.some(
                servico =>
                    servico.nome === servicoSalvo.nome
            );

        if (!existe) {

            servicos.push(
                servicoSalvo
            );

        }

    });

}

/* ==========================================
   03.2 - ADICIONAR SERVIÇO PERSONALIZADO
========================================== */

function adicionarServicoPersonalizado(
    salvarPermanentemente = false
) {

    const nome =
        document.getElementById(
            "novoServicoNome"
        ).value.trim();

    const valor =
        Number(
            document.getElementById(
                "novoServicoValor"
            ).value
        );

    if (!nome) {

        alert(
            "Informe o nome do serviço."
        );

        return;

    }

    const novoServico = {

        nome,

        valor

    };

    if (salvarPermanentemente) {

        const servicosSalvos =
            JSON.parse(
                localStorage.getItem(
                    "servicosPersonalizados"
                )
            ) || [];

        const jaExiste =
            servicosSalvos.some(
                servico =>
                    servico.nome.toLowerCase() ===
                    nome.toLowerCase()
            );

        if (!jaExiste) {

            servicosSalvos.push(
                novoServico
            );

            localStorage.setItem(
                "servicosPersonalizados",
                JSON.stringify(
                    servicosSalvos
                )
            );

        }

    }

    const index =
        servicos.length;

    servicos.push(
        novoServico
    );

    criarServicoNaTela(
        novoServico,
        index
    );

    document.getElementById(
        `check${index}`
    ).checked = true;

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

    document.getElementById(
        "novoServicoNome"
    ).value = "";

    document.getElementById(
        "novoServicoValor"
    ).value = "";

    gerarPreview();

}

/* ==========================================
   03.5 - GERENCIAR SERVIÇOS
========================================== */

function toggleGerenciarServicos() {

    const container =
        document.getElementById(
            "gerenciarServicos"
        );

    const visivel =
        getComputedStyle(container)
            .display !== "none";

    if (visivel) {

        container.style.display =
            "none";

    } else {

        container.style.display =
            "block";

        renderizarGerenciadorServicos();

    }

}

/* ==========================================
    03.6 - RENDERIZAR GERENCIADOR DE SERVIÇOS
========================================== */


window.toggleGerenciarServicos =
    toggleGerenciarServicos;

function renderizarGerenciadorServicos() {

    const container =
        document.getElementById(
            "listaGerenciarServicos"
        );

    const servicosSalvos =
        JSON.parse(
            localStorage.getItem(
                "servicosPersonalizados"
            )
        ) || [];

    container.innerHTML = "";

    servicosSalvos.forEach(
        (servico, index) => {

            container.innerHTML += `

    <div class="item-gerenciar">

        <span>

            ${servico.nome}

        </span>

        <button
            class="btn-remover-servico"
            onclick="removerServico(${index})">

            🗑

        </button>

    </div>

`;

        });

}

function editarServico(index) {

    const servicosSalvos =
        JSON.parse(
            localStorage.getItem(
                "servicosPersonalizados"
            )
        ) || [];

    servicosSalvos[index].nome =
        document.getElementById(
            `nomeServico${index}`
        ).value;

    servicosSalvos[index].valor =
        Number(
            document.getElementById(
                `valorServico${index}`
            ).value
        );

    localStorage.setItem(
        "servicosPersonalizados",
        JSON.stringify(
            servicosSalvos
        )
    );

    alert(
        "Serviço atualizado."
    );

}

function removerServico(index) {

    if (
        !confirm(
            "Deseja excluir este serviço?"
        )
    ) return;

    const servicosSalvos =
        JSON.parse(
            localStorage.getItem(
                "servicosPersonalizados"
            )
        ) || [];

    servicosSalvos.splice(
        index,
        1
    );

    localStorage.setItem(
        "servicosPersonalizados",
        JSON.stringify(
            servicosSalvos
        )
    );

    renderizarGerenciadorServicos();

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

    console.clear();

    let total = 0;
    let html = "";

    servicos.forEach((servico, index) => {

        const checkbox =
            document.getElementById(`check${index}`);

        const campoValor =
            document.getElementById(`valor${index}`);

        console.log(
            index,
            servico.nome,
            checkbox,
            campoValor
        );

        if (!checkbox || !campoValor) {

            console.error(
                "Elemento não encontrado:",
                index
            );

            return;
        }

        const marcado =
            checkbox.checked;

        const valor =
            Number(campoValor.value);

        console.log({
            index,
            nome: servico.nome,
            marcado,
            valor
        });

        if (marcado) {

            console.log(
                "ADICIONANDO:",
                servico.nome
            );

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

            console.log(
                "HTML ATUAL:",
                html
            );
        }

    });

    console.log("HTML FINAL:");
    console.log(html);

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
                        `check${index}`
                    ).dispatchEvent(
                        new Event("change")
                    );

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