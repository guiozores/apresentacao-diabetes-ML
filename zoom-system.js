/**
 * Sistema Universal de Zoom para Apresentações
 * Uso: Adicione data-zoom-enabled="true" em qualquer imagem
 *
 * Configurações disponíveis via data-attributes:
 * - data-zoom-enabled="true"           → Ativa o zoom
 * - data-zoom-factor="2.5"             → Fator de ampliação (padrão: 2.5)
 * - data-lens-shape="circle|rectangle" → Formato da lente (padrão: circle)
 * - data-lens-size="120"               → Tamanho da lente circular
 * - data-lens-width="150"              → Largura da lente retangular
 * - data-lens-height="100"             → Altura da lente retangular
 * - data-zoom-box-size="400"           → Tamanho da caixa de zoom quadrada
 * - data-zoom-box-width="500"          → Largura da caixa de zoom
 * - data-zoom-box-height="300"         → Altura da caixa de zoom
 * - data-auto-position="true"          → Reposicionamento automático (padrão: true)
 */

class UniversalZoom {
  constructor() {
    this.instances = new Map();
    this.init();
  }

  init() {
    console.log("🚀 Inicializando Sistema Universal de Zoom...");
    console.log("📄 Document.readyState:", document.readyState);

    // Aguarda DOM carregar
    if (document.readyState === "loading") {
      console.log("⏳ Aguardando DOM carregar...");
      document.addEventListener("DOMContentLoaded", () =>
        this.scanAndInitialize()
      );
    } else {
      console.log("✅ DOM já carregado, iniciando scan...");
      this.scanAndInitialize();
    }

    // Fallback - tenta novamente após 1 segundo
    setTimeout(() => {
      console.log("🔄 Tentativa fallback após 1s...");
      this.scanAndInitialize();
    }, 1000);
  }

  scanAndInitialize() {
    console.log("🔍 Escaneando por imagens com zoom...");

    // Busca todas as imagens com zoom habilitado
    const images = document.querySelectorAll('img[data-zoom-enabled="true"]');
    console.log(`� Encontradas ${images.length} imagens com zoom habilitado`);

    if (images.length === 0) {
      console.log(
        "❌ Nenhuma imagem encontrada! Verificando todas as imagens..."
      );
      const allImages = document.querySelectorAll("img");
      console.log(`📷 Total de imagens na página: ${allImages.length}`);
      allImages.forEach((img, index) => {
        console.log(
          `   ${index + 1}. src: ${img.src}, data-zoom-enabled: ${
            img.dataset.zoomEnabled
          }`
        );
      });
    }

    images.forEach((img, index) => {
      console.log(
        `🎯 Criando zoom para imagem ${index + 1}: ${img.src.split("/").pop()}`
      );
      this.createZoomInstance(img);
    });
  }

  createZoomInstance(img) {
    const id = this.generateId();
    const config = this.parseConfig(img);

    // Cria elementos do zoom
    const elements = this.createZoomElements(id, config);

    // Insere elementos no DOM
    this.insertElements(img, elements);

    // Cria instância do zoom
    const instance = new ZoomInstance(id, img, elements, config);
    this.instances.set(id, instance);

    console.log(`🔍 Zoom criado para imagem: ${img.src.split("/").pop()}`);
  }

  parseConfig(img) {
    const dataset = img.dataset;

    return {
      factor: parseFloat(dataset.zoomFactor) || 2.5,
      lensShape: dataset.lensShape || "circle",
      lensSize: parseInt(dataset.lensSize) || 120,
      lensWidth:
        parseInt(dataset.lensWidth) || parseInt(dataset.lensSize) || 120,
      lensHeight:
        parseInt(dataset.lensHeight) || parseInt(dataset.lensSize) || 120,
      boxSize: parseInt(dataset.zoomBoxSize) || 400,
      boxWidth:
        parseInt(dataset.zoomBoxWidth) || parseInt(dataset.zoomBoxSize) || 400,
      boxHeight:
        parseInt(dataset.zoomBoxHeight) || parseInt(dataset.zoomBoxSize) || 400,
      autoPosition: dataset.autoPosition !== "false",
    };
  }

  createZoomElements(id, config) {
    // Container wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "zoom-wrapper";
    wrapper.id = `zoom-wrapper-${id}`;

    // Lente
    const lens = document.createElement("div");
    lens.className = "zoom-lens";
    lens.id = `zoom-lens-${id}`;

    // Caixa de resultado
    const result = document.createElement("div");
    result.className = "zoom-result";
    result.id = `zoom-result-${id}`;

    // Aplica estilos baseados na configuração
    this.applyStyles(lens, result, config);

    return { wrapper, lens, result };
  }

  applyStyles(lens, result, config) {
    // Aplica estilos diretamente com setProperty para máxima prioridade
    const lensStyles = [
      ["position", "absolute", "important"],
      ["border", "3px solid #007acc", "important"],
      ["background", "rgba(0, 122, 204, 0.2)", "important"],
      ["display", "none", "important"],
      ["pointer-events", "none", "important"],
      ["z-index", "9999", "important"],
      ["box-shadow", "0 0 15px rgba(0, 122, 204, 0.5)", "important"],
      ["width", config.lensWidth + "px", "important"],
      ["height", config.lensHeight + "px", "important"],
      ["animation", "none", "important"],
      ["backdrop-filter", "none", "important"],
      ["transform", "none", "important"],
      ["transition", "none", "important"],
    ];

    // Formato da lente
    if (config.lensShape === "circle") {
      lensStyles.push(["border-radius", "50%", "important"]);
    } else {
      lensStyles.push(["border-radius", "8px", "important"]);
    }

    const resultStyles = [
      ["position", "fixed", "important"],
      ["top", "20px", "important"],
      ["right", "20px", "important"],
      ["width", config.boxWidth + "px", "important"],
      ["height", config.boxHeight + "px", "important"],
      ["border", "3px solid #007acc", "important"],
      ["border-radius", "12px", "important"],
      ["display", "none", "important"],
      ["background-color", "white", "important"],
      ["background-repeat", "no-repeat", "important"],
      ["z-index", "9998", "important"],
      ["box-shadow", "0 10px 30px rgba(0, 0, 0, 0.3)", "important"],
      ["pointer-events", "none", "important"],
      ["animation", "none", "important"],
      ["transform", "none", "important"],
    ];

    // Aplica estilos usando setProperty para garantir prioridade
    lensStyles.forEach(([prop, value, priority]) => {
      lens.style.setProperty(prop, value, priority);
    });

    resultStyles.forEach(([prop, value, priority]) => {
      result.style.setProperty(prop, value, priority);
    });
  }

  insertElements(img, elements) {
    console.log("📦 Inserindo elementos no DOM...");
    console.log("🖼️ Imagem:", img);
    console.log("📁 Parent:", img.parentElement);

    const parent = img.parentElement;

    // Envolve a imagem no wrapper se necessário
    if (!parent.classList.contains("zoom-wrapper")) {
      console.log("🔧 Criando wrapper para a imagem...");
      parent.insertBefore(elements.wrapper, img);
      elements.wrapper.appendChild(img);
    } else {
      console.log("✅ Wrapper já existe");
      elements.wrapper = parent;
    }

    // Adiciona lente e resultado
    console.log("🔍 Adicionando lente ao wrapper...");
    elements.wrapper.appendChild(elements.lens);

    console.log("📱 Adicionando caixa de resultado ao body...");
    document.body.appendChild(elements.result);

    console.log("✅ Elementos inseridos com sucesso");
    console.log("📋 IDs criados:", {
      wrapper: elements.wrapper.id,
      lens: elements.lens.id,
      result: elements.result.id,
    });
  }

  generateId() {
    return "zoom_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }
}

class ZoomInstance {
  constructor(id, img, elements, config) {
    this.id = id;
    this.img = img;
    this.wrapper = elements.wrapper;
    this.lens = elements.lens;
    this.result = elements.result;
    this.config = config;
    this.isActive = false;

    this.setupEventListeners();
    this.setupInitialStyles();
  }

  setupInitialStyles() {
    // Garante que o wrapper seja relativo com setProperty
    this.wrapper.style.setProperty("position", "relative", "important");
    this.wrapper.style.setProperty("display", "inline-block", "important");
    this.wrapper.style.setProperty("overflow", "visible", "important");

    // Cursor da imagem
    this.img.style.setProperty("cursor", "pointer", "important");

    console.log(`✅ Zoom configurado para: ${this.img.src.split("/").pop()}`);
  }

  setupEventListeners() {
    // Clique para ativar/desativar
    this.img.addEventListener("click", (e) => this.toggleZoom(e));

    // Movimento do mouse
    this.wrapper.addEventListener("mousemove", (e) => this.handleMouseMove(e));

    // Mouse sai da área
    this.wrapper.addEventListener("mouseleave", () => this.hideZoom());

    // Clique fora para desativar
    document.addEventListener("click", (e) => this.handleOutsideClick(e));

    // Redimensionamento
    window.addEventListener("resize", () => this.handleResize());
  }

  toggleZoom(e) {
    console.log("🖱️ Clique detectado na imagem!");
    e.preventDefault();
    e.stopPropagation();

    this.isActive = !this.isActive;
    console.log(`🎯 Zoom ${this.isActive ? "ATIVADO" : "DESATIVADO"}`);

    if (this.isActive) {
      this.activateZoom();
    } else {
      this.deactivateZoom();
    }
  }

  activateZoom() {
    this.img.style.setProperty("cursor", "crosshair", "important");
    this.img.classList.add("zoom-active");

    // Configura background da imagem
    this.result.style.setProperty(
      "background-image",
      `url('${this.img.src}')`,
      "important"
    );
    this.updateBackgroundSize();

    // Reset posição
    this.result.style.setProperty("left", "auto", "important");
    this.result.style.setProperty("right", "20px", "important");

    console.log(`🎯 Zoom ativado para: ${this.img.src.split("/").pop()}`);
  }

  deactivateZoom() {
    this.img.style.setProperty("cursor", "pointer", "important");
    this.img.classList.remove("zoom-active");
    this.lens.style.setProperty("display", "none", "important");
    this.result.style.setProperty("display", "none", "important");

    // Reset posição
    this.result.style.setProperty("left", "auto", "important");
    this.result.style.setProperty("right", "20px", "important");
  }

  handleMouseMove(e) {
    if (!this.isActive) {
      console.log("🔒 Zoom não está ativo, ignorando movimento do mouse");
      return;
    }

    console.log("🖱️ Mouse movendo com zoom ativo...");
    e.preventDefault();

    const imgRect = this.img.getBoundingClientRect();
    const mouseX = e.clientX - imgRect.left;
    const mouseY = e.clientY - imgRect.top;

    console.log(
      `📍 Mouse na imagem: (${mouseX.toFixed(1)}, ${mouseY.toFixed(1)})`
    );

    // Verifica se está dentro da imagem
    if (
      mouseX < 0 ||
      mouseX > imgRect.width ||
      mouseY < 0 ||
      mouseY > imgRect.height
    ) {
      console.log("🚫 Mouse fora da imagem, escondendo zoom");
      this.hideZoom();
      return;
    }

    // Posiciona lente
    this.positionLens(mouseX, mouseY);

    // Auto-reposicionamento da caixa
    if (this.config.autoPosition) {
      this.autoPositionResult(mouseX, imgRect.width);
    }

    // Atualiza zoom
    this.updateZoom(mouseX, mouseY, imgRect);

    // Mostra elementos
    console.log("👁️ Mostrando lente e caixa de zoom...");
    this.lens.style.setProperty("display", "block", "important");
    this.result.style.setProperty("display", "block", "important");
  }

  positionLens(mouseX, mouseY) {
    const lensX = mouseX - this.config.lensWidth / 2;
    const lensY = mouseY - this.config.lensHeight / 2;

    this.lens.style.setProperty("left", lensX + "px", "important");
    this.lens.style.setProperty("top", lensY + "px", "important");
  }

  autoPositionResult(mouseX, imgWidth) {
    if (mouseX > imgWidth / 2) {
      // Mouse na direita -> caixa vai para esquerda
      this.result.style.setProperty("right", "auto", "important");
      this.result.style.setProperty("left", "20px", "important");
    } else {
      // Mouse na esquerda -> caixa fica na direita
      this.result.style.setProperty("left", "auto", "important");
      this.result.style.setProperty("right", "20px", "important");
    }
  }

  updateZoom(mouseX, mouseY, imgRect) {
    const relativeX = mouseX / imgRect.width;
    const relativeY = mouseY / imgRect.height;

    const bgWidth = imgRect.width * this.config.factor;
    const bgHeight = imgRect.height * this.config.factor;

    const bgX = relativeX * bgWidth - this.config.boxWidth / 2;
    const bgY = relativeY * bgHeight - this.config.boxHeight / 2;

    this.result.style.setProperty(
      "background-position",
      `-${bgX}px -${bgY}px`,
      "important"
    );
  }

  updateBackgroundSize() {
    const imgRect = this.img.getBoundingClientRect();
    this.result.style.setProperty(
      "background-size",
      `${imgRect.width * this.config.factor}px ${
        imgRect.height * this.config.factor
      }px`,
      "important"
    );
  }

  hideZoom() {
    if (this.isActive) {
      this.lens.style.setProperty("display", "none", "important");
      this.result.style.setProperty("display", "none", "important");
    }
  }

  handleOutsideClick(e) {
    if (
      this.isActive &&
      !this.wrapper.contains(e.target) &&
      !this.result.contains(e.target)
    ) {
      this.deactivateZoom();
    }
  }

  handleResize() {
    if (this.isActive) {
      setTimeout(() => this.updateBackgroundSize(), 100);
    }
  }
}

// CSS dinâmico (injeta automaticamente)
const injectCSS = () => {
  if (document.getElementById("universal-zoom-styles")) return;

  const style = document.createElement("style");
  style.id = "universal-zoom-styles";
  style.textContent = `
    /* Sistema Universal de Zoom - Prioridade Máxima */
    .zoom-wrapper {
      position: relative !important;
      display: inline-block !important;
      overflow: visible !important;
    }
    
    /* Override específico para lentes criadas pelo sistema universal */
    div[id^="zoom-lens-"].zoom-lens {
      transition: none !important;
      animation: none !important;
      backdrop-filter: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
    
    /* Override específico para caixas de resultado criadas pelo sistema universal */
    div[id^="zoom-result-"].zoom-result {
      transition: opacity 0.2s ease !important;
      animation: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
    
    /* Estado ativo da imagem */
    img.zoom-active {
      border: 2px solid #007acc !important;
      outline: none !important;
    }
    
    /* Garante overflow visível para zoom */
    body.zoom-enabled {
      overflow: visible !important;
    }
    
    /* Garante que containers não cortem a lente - mais específico */
    .presentation-container,
    .presentation-container .slide-content,
    .presentation-container .main-content,
    .presentation-container .image-section,
    .presentation-container .image-container,
    .presentation-container .image-wrapper,
    .zoom-wrapper {
      overflow: visible !important;
    }
    
    /* Remove qualquer conflito de z-index */
    div[id^="zoom-lens-"] {
      z-index: 99999 !important;
    }
    
    div[id^="zoom-result-"] {
      z-index: 99998 !important;
    }
  `;

  document.head.appendChild(style);
  document.body.classList.add("zoom-enabled");

  console.log("🎨 CSS do sistema universal de zoom injetado");
};

// Inicialização automática
injectCSS();
const universalZoom = new UniversalZoom();

// Função de teste manual (disponível no console)
window.testZoom = () => {
  console.log("🧪 TESTE MANUAL DO ZOOM");

  // Tenta encontrar qualquer imagem
  const allImages = document.querySelectorAll("img");
  console.log(`📷 Total de imagens encontradas: ${allImages.length}`);

  if (allImages.length > 0) {
    const img = allImages[0]; // Pega a primeira imagem
    console.log(`🎯 Aplicando zoom forçado na primeira imagem: ${img.src}`);

    // Força os atributos
    img.setAttribute("data-zoom-enabled", "true");
    img.setAttribute("data-zoom-factor", "2.5");
    img.setAttribute("data-lens-shape", "circle");
    img.setAttribute("data-lens-size", "120");

    // Cria instância manualmente
    universalZoom.createZoomInstance(img);

    console.log("✅ Zoom aplicado! Clique na imagem para ativar.");
  } else {
    console.log("❌ Nenhuma imagem encontrada na página");
  }
};

// Exporta para uso manual se necessário
window.UniversalZoom = UniversalZoom;
