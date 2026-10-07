/**
 * Mini Sistema - Gerenciamento de Aparelhos Samsung
 * Frontend Vanilla JavaScript
 */

// ==========================================================================
// 1. CONFIGURAÇÃO DA API
// ==========================================================================
// Centralização da URL da API conforme especificado no item 12
const API_URL = window.location.origin.includes('http') ? window.location.origin : "https://s-silk-psi.vercel.app";

// Imagem padrão caso a URL do aparelho seja inválida ou falhe ao carregar
const PLACEHOLDER_IMG = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20280%22%20width%3D%22200%22%20height%3D%22280%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22bg%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%231e293b%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%230f172a%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient%20id%3D%22screen%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%230284c7%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20x%3D%2230%22%20y%3D%2210%22%20width%3D%22140%22%20height%3D%22260%22%20rx%3D%2222%22%20fill%3D%22url(%23bg)%22%20stroke%3D%22%23475569%22%20stroke-width%3D%223%22%2F%3E%3Crect%20x%3D%2238%22%20y%3D%2220%22%20width%3D%22124%22%20height%3D%22240%22%20rx%3D%2216%22%20fill%3D%22url(%23screen)%22%2F%3E%3Ccircle%20cx%3D%22100%22%20cy%3D%2232%22%20r%3D%224%22%20fill%3D%22%230f172a%22%2F%3E%3Ctext%20x%3D%22100%22%20y%3D%22135%22%20fill%3D%22%23ffffff%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2213%22%20font-weight%3D%22800%22%20letter-spacing%3D%222%22%20text-anchor%3D%22middle%22%3ESAMSUNG%3C%2Ftext%3E%3Ctext%20x%3D%22100%22%20y%3D%22155%22%20fill%3D%22%23bae6fd%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2210%22%20font-weight%3D%22600%22%20letter-spacing%3D%221%22%20text-anchor%3D%22middle%22%3EGALAXY%3C%2Ftext%3E%3Crect%20x%3D%2280%22%20y%3D%22248%22%20width%3D%2240%22%20height%3D%223%22%20rx%3D%221.5%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.7%22%2F%3E%3C%2Fsvg%3E";

// ==========================================================================
// 2. ESTADO DA APLICAÇÃO
// ==========================================================================
let aparelhos = [];
let aparelhoParaExcluir = null;

// ==========================================================================
// 3. ELEMENTOS DO DOM
// ==========================================================================
const gridContainer = document.getElementById("grid-container");
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const errorMessageText = document.getElementById("error-message-text");
const emptyState = document.getElementById("empty-state");
const contadorAparelhos = document.getElementById("contador-aparelhos");
const inputBusca = document.getElementById("input-busca");
const btnTentarNovamente = document.getElementById("btn-tentar-novamente");
const btnNovoAparelho = document.getElementById("btn-novo-aparelho");
const btnEmptyCadastrar = document.getElementById("btn-empty-cadastrar");

// Modal de Formulário
const modalForm = document.getElementById("modal-form");
const modalTitle = document.getElementById("modal-title");
const btnFecharModal = document.getElementById("btn-fechar-modal");
const btnCancelarModal = document.getElementById("btn-cancelar-modal");
const formAparelho = document.getElementById("form-aparelho");
const formId = document.getElementById("form-id");
const formMarca = document.getElementById("form-marca");
const formModelo = document.getElementById("form-modelo");
const formPreco = document.getElementById("form-preco");
const formFoto = document.getElementById("form-foto");
const imgPreview = document.getElementById("img-preview");
const previewPlaceholder = document.getElementById("preview-placeholder");

// Modal de Exclusão
const modalDelete = document.getElementById("modal-delete");
const btnFecharDelete = document.getElementById("btn-fechar-delete");
const btnCancelarDelete = document.getElementById("btn-cancelar-delete");
const btnConfirmarDelete = document.getElementById("btn-confirmar-delete");
const deleteAparelhoNome = document.getElementById("delete-aparelho-nome");

// ==========================================================================
// 4. FUNÇÕES DE FORMATAÇÃO E UTILITÁRIOS
// ==========================================================================

/**
 * Formata um valor numérico para o padrão de moeda brasileira (BRL)
 * Exemplo: 3999.90 -> "R$ 3.999,90"
 */
function formatarPreco(valor) {
  const numero = Number(valor);
  if (isNaN(numero)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numero);
}

/**
 * Exibe notificação toast na tela
 */
function mostrarToast(mensagem, tipo = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${tipo}`;
  toast.textContent = mensagem;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

/**
 * Controla a exibição dos estados da tela (loading, erro, lista vazia, grade)
 */
function exibirEstado(estado, mensagemErro = "") {
  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  emptyState.classList.add("hidden");
  gridContainer.classList.add("hidden");

  if (estado === "loading") {
    loadingState.classList.remove("hidden");
  } else if (estado === "error") {
    errorState.classList.remove("hidden");
    if (mensagemErro) {
      errorMessageText.textContent = mensagemErro;
    } else {
      errorMessageText.textContent = "Não foi possível carregar os aparelhos. Tente novamente mais tarde.";
    }
  } else if (estado === "empty") {
    emptyState.classList.remove("hidden");
    contadorAparelhos.textContent = "0 aparelhos cadastrados";
  } else if (estado === "grid") {
    gridContainer.classList.remove("hidden");
  }
}

// ==========================================================================
// 5. CONSUMO DA API REST (FETCH)
// ==========================================================================

/**
 * Carrega todos os aparelhos Samsung da API (GET /api/aparelhos)
 */
async function carregarAparelhos() {
  exibirEstado("loading");

  try {
    const resposta = await fetch(`${API_URL}/api/aparelhos`);

    if (!resposta.ok) {
      throw new Error(`Erro na resposta do servidor: status ${resposta.status}`);
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados)) {
      throw new Error("Formato inesperado recebido da API.");
    }

    aparelhos = dados;
    renderizarAparelhos(aparelhos);
  } catch (error) {
    console.error("Falha ao carregar aparelhos:", error);
    exibirEstado(
      "error",
      "Não foi possível carregar os aparelhos. Verifique se o servidor backend está rodando em " + API_URL
    );
  }
}

/**
 * Busca um aparelho específico por ID (GET /api/aparelhos/:id)
 */
async function buscarAparelhoPorId(id) {
  try {
    const resposta = await fetch(`${API_URL}/api/aparelhos/${id}`);
    if (!resposta.ok) {
      const errData = await resposta.json().catch(() => ({}));
      throw new Error(errData.mensagem || "Erro ao buscar aparelho.");
    }
    return await resposta.json();
  } catch (error) {
    console.error("Erro ao buscar aparelho por ID:", error);
    mostrarToast(error.message, "error");
    return null;
  }
}

/**
 * Cria ou atualiza um aparelho (POST /api/aparelhos ou PUT /api/aparelhos/:id)
 */
async function salvarAparelho(evento) {
  evento.preventDefault();

  limparErrosFormulario();

  const id = formId.value.trim();
  const modelo = formModelo.value.trim();
  const preco = parseFloat(formPreco.value);
  const foto = formFoto.value.trim();

  let valido = true;

  if (!modelo) {
    document.getElementById("error-modelo").textContent = "O modelo é obrigatório.";
    valido = false;
  }

  if (isNaN(preco) || preco <= 0) {
    document.getElementById("error-preco").textContent = "Informe um preço válido maior que zero.";
    valido = false;
  }

  if (!foto || !/^https?:\/\/.+/i.test(foto)) {
    document.getElementById("error-foto").textContent = "Informe uma URL válida (http:// ou https://).";
    valido = false;
  }

  if (!valido) return;

  const payload = {
    marca: "Samsung",
    modelo,
    preco,
    foto,
  };

  const btnSalvar = document.getElementById("btn-salvar-modal");
  btnSalvar.disabled = true;
  btnSalvar.textContent = "Salvando...";

  try {
    const url = id ? `${API_URL}/api/aparelhos/${id}` : `${API_URL}/api/aparelhos`;
    const metodo = id ? "PUT" : "POST";

    const resposta = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const resultado = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      throw new Error(resultado.mensagem || "Ocorreu um erro ao salvar o aparelho.");
    }

    fecharModalForm();
    mostrarToast(id ? "Aparelho atualizado com sucesso!" : "Aparelho cadastrado com sucesso!", "success");
    await carregarAparelhos();
  } catch (error) {
    console.error("Erro ao salvar:", error);
    mostrarToast(error.message, "error");
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.textContent = "Salvar Aparelho";
  }
}

/**
 * Remove um aparelho da API (DELETE /api/aparelhos/:id)
 */
async function confirmarExclusaoAparelho() {
  if (!aparelhoParaExcluir) return;

  btnConfirmarDelete.disabled = true;
  btnConfirmarDelete.textContent = "Excluindo...";

  try {
    const resposta = await fetch(`${API_URL}/api/aparelhos/${aparelhoParaExcluir.id || aparelhoParaExcluir._id}`, {
      method: "DELETE",
    });

    const resultado = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      throw new Error(resultado.mensagem || "Erro ao excluir o aparelho.");
    }

    fecharModalDelete();
    mostrarToast("Aparelho excluído com sucesso!", "success");
    await carregarAparelhos();
  } catch (error) {
    console.error("Erro ao excluir:", error);
    mostrarToast(error.message, "error");
  } finally {
    btnConfirmarDelete.disabled = false;
    btnConfirmarDelete.textContent = "Excluir";
  }
}

// ==========================================================================
// 6. RENDERIZAÇÃO DA INTERFACE
// ==========================================================================

/**
 * Renderiza a lista de cards na tela conforme especificação
 */
function renderizarAparelhos(lista) {
  if (!lista || lista.length === 0) {
    exibirEstado("empty");
    return;
  }

  exibirEstado("grid");
  contadorAparelhos.textContent = `${lista.length} aparelho${lista.length === 1 ? "" : "s"} cadastrado${lista.length === 1 ? "" : "s"}`;

  gridContainer.innerHTML = "";

  lista.forEach((aparelho) => {
    const card = document.createElement("article");
    card.className = "card-aparelho";
    const aparelhoId = aparelho.id || aparelho._id;

    card.innerHTML = `
      <div class="card-image-wrapper">
        <img 
          src="${escapeHtml(aparelho.foto)}" 
          alt="${escapeHtml(aparelho.modelo)}" 
          class="card-image" 
          loading="lazy"
          referrerpolicy="no-referrer"
          onerror="this.onerror=null; this.src='${PLACEHOLDER_IMG}';"
        >
      </div>
      <div class="card-body">
        <span class="card-brand">${escapeHtml(aparelho.marca || "Samsung")}</span>
        <h3 class="card-model">${escapeHtml(aparelho.modelo)}</h3>
        <p class="card-price">${formatarPreco(aparelho.preco)}</p>
        <div class="card-footer">
          <button class="btn-icon btn-editar" title="Editar aparelho" aria-label="Editar ${escapeHtml(aparelho.modelo)}">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="btn-icon btn-icon-danger btn-excluir" title="Excluir aparelho" aria-label="Excluir ${escapeHtml(aparelho.modelo)}">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    const btnEditar = card.querySelector(".btn-editar");
    btnEditar.addEventListener("click", () => abrirModalEdicao(aparelhoId));

    const btnExcluir = card.querySelector(".btn-excluir");
    btnExcluir.addEventListener("click", () => abrirModalExclusao(aparelho));

    gridContainer.appendChild(card);
  });
}

/**
 * Escapa strings contra XSS ao renderizar HTML
 */
function escapeHtml(texto) {
  if (!texto) return "";
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// ==========================================================================
// 7. MANIPULAÇÃO DE MODAIS E FORMULÁRIOS
// ==========================================================================

function abrirModalCadastro() {
  modalTitle.textContent = "Cadastrar Aparelho Samsung";
  formId.value = "";
  formAparelho.reset();
  formMarca.value = "Samsung";
  limparErrosFormulario();
  atualizarPreviewImagem("");
  modalForm.classList.remove("hidden");
  formModelo.focus();
}

async function abrirModalEdicao(id) {
  const aparelho = await buscarAparelhoPorId(id);
  if (!aparelho) return;

  modalTitle.textContent = "Editar Aparelho Samsung";
  formId.value = aparelho.id || aparelho._id;
  formMarca.value = aparelho.marca || "Samsung";
  formModelo.value = aparelho.modelo || "";
  formPreco.value = aparelho.preco || "";
  formFoto.value = aparelho.foto || "";

  limparErrosFormulario();
  atualizarPreviewImagem(aparelho.foto);
  modalForm.classList.remove("hidden");
  formModelo.focus();
}

function fecharModalForm() {
  modalForm.classList.add("hidden");
  formAparelho.reset();
  limparErrosFormulario();
}

function abrirModalExclusao(aparelho) {
  aparelhoParaExcluir = aparelho;
  deleteAparelhoNome.textContent = aparelho.modelo;
  modalDelete.classList.remove("hidden");
}

function fecharModalDelete() {
  modalDelete.classList.add("hidden");
  aparelhoParaExcluir = null;
}

function limparErrosFormulario() {
  document.getElementById("error-modelo").textContent = "";
  document.getElementById("error-preco").textContent = "";
  document.getElementById("error-foto").textContent = "";
}

function atualizarPreviewImagem(url) {
  if (url && /^https?:\/\/.+/i.test(url)) {
    imgPreview.src = url;
    imgPreview.classList.remove("hidden");
    previewPlaceholder.classList.add("hidden");

    imgPreview.onerror = () => {
      imgPreview.src = PLACEHOLDER_IMG;
    };
  } else {
    imgPreview.classList.add("hidden");
    previewPlaceholder.classList.remove("hidden");
  }
}

// ==========================================================================
// 8. EVENT LISTENERS E INICIALIZAÇÃO
// ==========================================================================

formFoto.addEventListener("input", (e) => {
  atualizarPreviewImagem(e.target.value.trim());
});

inputBusca.addEventListener("input", (e) => {
  const termo = e.target.value.toLowerCase().trim();
  const filtrados = aparelhos.filter((item) =>
    item.modelo.toLowerCase().includes(termo)
  );
  renderizarAparelhos(filtrados);
});

document.querySelectorAll(".btn-preset").forEach((btn) => {
  btn.addEventListener("click", () => {
    formModelo.value = btn.getAttribute("data-modelo");
    formPreco.value = btn.getAttribute("data-preco");
    formFoto.value = btn.getAttribute("data-foto");
    atualizarPreviewImagem(formFoto.value);
  });
});

btnNovoAparelho.addEventListener("click", abrirModalCadastro);
btnEmptyCadastrar.addEventListener("click", abrirModalCadastro);
btnFecharModal.addEventListener("click", fecharModalForm);
btnCancelarModal.addEventListener("click", fecharModalForm);

btnFecharDelete.addEventListener("click", fecharModalDelete);
btnCancelarDelete.addEventListener("click", fecharModalDelete);
btnConfirmarDelete.addEventListener("click", confirmarExclusaoAparelho);

window.addEventListener("click", (e) => {
  if (e.target === modalForm) fecharModalForm();
  if (e.target === modalDelete) fecharModalDelete();
});

formAparelho.addEventListener("submit", salvarAparelho);
btnTentarNovamente.addEventListener("click", carregarAparelhos);

document.addEventListener("DOMContentLoaded", () => {
  carregarAparelhos();
});
