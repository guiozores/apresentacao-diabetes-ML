/**
 * Sistema de Zoom SIMPLES E DIRETO -      lensElement.style.cssText = `
        position: absolute !important;
        width: ${config.lensWidth}px !important;
        height: ${config.lensHeight}px !important;
        border: 3px solid #007acc !important;
        border-radius: ${config.lensShape === 'circle' ? '50%' : '8px'} !important;
        background: rgba(0, 122, 204, 0.2) !important;
        display: none !important;
        pointer-events: none !important;
        z-index: 99997 !important;
        box-shadow: 0 0 15px rgba(0, 122, 204, 0.8) !important;
      `;nar 100%
 */

console.log("🚀 CARREGANDO ZOOM SIMPLES...");

// Função principal que cria o zoom
function createSimpleZoom() {
  console.log("🔍 Procurando imagens com zoom...");

  const images = document.querySelectorAll('img[data-zoom-enabled="true"]');
  console.log(`📊 Encontradas ${images.length} imagens`);

  images.forEach((img, index) => {
    console.log(
      `🎯 Configurando zoom ${index + 1} para: ${img.src.split("/").pop()}`
    );

    // Remove qualquer event listener anterior
    img.onclick = null;

    // Variáveis do zoom
    let isZoomActive = false;
    let lensElement = null;
    let resultElement = null;

    // Configuração (pega do HTML via data-attributes)
    const config = {
      factor: parseFloat(img.dataset.zoomFactor) || 2.5,
      lensWidth:
        parseInt(img.dataset.lensWidth) ||
        parseInt(img.dataset.lensSize) ||
        120,
      lensHeight:
        parseInt(img.dataset.lensHeight) ||
        parseInt(img.dataset.lensSize) ||
        120,
      lensShape: img.dataset.lensShape || "circle",
      boxWidth:
        parseInt(img.dataset.zoomBoxWidth) ||
        parseInt(img.dataset.zoomBoxSize) ||
        400,
      boxHeight:
        parseInt(img.dataset.zoomBoxHeight) ||
        parseInt(img.dataset.zoomBoxSize) ||
        400,
    };

    console.log("⚙️ Config:", config);

    // Cria elementos de zoom
    function createZoomElements() {
      // Lente
      lensElement = document.createElement("div");
      lensElement.id = `simple-lens-${index}`;
      lensElement.style.cssText = `
        position: absolute !important;
        width: ${config.lensWidth}px !important;
        height: ${config.lensHeight}px !important;
        border: 3px solid #007acc !important;
        border-radius: 8px !important;
        background: rgba(0, 122, 204, 0.2) !important;
        display: none !important;
        pointer-events: none !important;
        z-index: 99999 !important;
        box-shadow: 0 0 15px rgba(0, 122, 204, 0.8) !important;
      `;

      // Caixa de resultado
      resultElement = document.createElement("div");
      resultElement.id = `simple-result-${index}`;
      resultElement.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        width: ${config.boxWidth}px !important;
        height: ${config.boxHeight}px !important;
        border: 3px solid #007acc !important;
        border-radius: 12px !important;
        background-color: white !important;
        background-repeat: no-repeat !important;
        display: none !important;
        z-index: 99998 !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
        pointer-events: none !important;
      `;

      // Adiciona ao DOM
      const wrapper = img.parentElement;
      wrapper.style.position = "relative";
      wrapper.appendChild(lensElement);
      document.body.appendChild(resultElement);

      console.log("✅ Elementos criados e adicionados");
    }

    // Ativar zoom
    function activateZoom() {
      console.log("🎯 ATIVANDO ZOOM!");
      isZoomActive = true;
      img.style.cursor = "crosshair";
      img.style.border = "2px solid #007acc";

      // Configura background
      resultElement.style.backgroundImage = `url('${img.src}')`;

      const imgRect = img.getBoundingClientRect();
      const bgSize = `${imgRect.width * config.factor}px ${
        imgRect.height * config.factor
      }px`;
      resultElement.style.backgroundSize = bgSize;

      // Reset posição inicial (sempre começa na direita)
      resultElement.style.left = "auto";
      resultElement.style.right = "20px";

      console.log("🖼️ Background configurado:", bgSize);
    }

    // Desativar zoom
    function deactivateZoom() {
      console.log("❌ DESATIVANDO ZOOM");
      isZoomActive = false;
      img.style.cursor = "pointer";
      img.style.border = "none";
      lensElement.style.display = "none";
      resultElement.style.display = "none";
    }

    // Movimento do mouse
    function handleMouseMove(e) {
      if (!isZoomActive) return;

      const imgRect = img.getBoundingClientRect();
      const mouseX = e.clientX - imgRect.left;
      const mouseY = e.clientY - imgRect.top;

      // Verifica se está dentro da imagem
      if (
        mouseX < 0 ||
        mouseX > imgRect.width ||
        mouseY < 0 ||
        mouseY > imgRect.height
      ) {
        lensElement.style.display = "none";
        resultElement.style.display = "none";
        return;
      }

      // Posiciona lente
      const lensX = mouseX - config.lensWidth / 2;
      const lensY = mouseY - config.lensHeight / 2;
      lensElement.style.left = lensX + "px";
      lensElement.style.top = lensY + "px";

      // Verifica se a caixa de zoom é muito grande (como no slide-39)
      const isLargeZoomBox = config.boxWidth > 500 || config.boxHeight > 400;

      if (isLargeZoomBox) {
        // Para caixas grandes, coloca a lente bem atrás da caixa de zoom
        lensElement.style.zIndex = "99990";
        lensElement.style.display = "block";
      } else {
        // Para caixas normais, mantém z-index normal
        lensElement.style.zIndex = "99997";
        lensElement.style.display = "block";
      }

      // Atualiza zoom
      const relativeX = mouseX / imgRect.width;
      const relativeY = mouseY / imgRect.height;

      const bgWidth = imgRect.width * config.factor;
      const bgHeight = imgRect.height * config.factor;

      const bgX = relativeX * bgWidth - config.boxWidth / 2;
      const bgY = relativeY * bgHeight - config.boxHeight / 2;

      // Auto-posicionamento da caixa de zoom
      if (mouseX > imgRect.width / 2) {
        // Mouse na direita -> caixa vai para esquerda
        resultElement.style.right = "auto";
        resultElement.style.left = "20px";
      } else {
        // Mouse na esquerda -> caixa fica na direita
        resultElement.style.left = "auto";
        resultElement.style.right = "20px";
      }

      resultElement.style.backgroundPosition = `-${bgX}px -${bgY}px`;
      resultElement.style.display = "block";
    }

    // Event listeners
    img.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("🖱️ CLIQUE DETECTADO!");

      if (!lensElement) {
        createZoomElements();
      }

      if (isZoomActive) {
        deactivateZoom();
      } else {
        activateZoom();
      }
    });

    img.addEventListener("mousemove", handleMouseMove);

    img.addEventListener("mouseleave", () => {
      if (isZoomActive) {
        lensElement.style.display = "none";
        resultElement.style.display = "none";
      }
    });

    // Clique fora da imagem para desativar zoom
    document.addEventListener("click", (e) => {
      if (
        isZoomActive &&
        !img.contains(e.target) &&
        !resultElement.contains(e.target)
      ) {
        console.log("🖱️ Clique fora detectado - desativando zoom");
        deactivateZoom();
      }
    });

    console.log(`✅ Zoom ${index + 1} configurado com sucesso!`);
  });
}

// Executa quando DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createSimpleZoom);
} else {
  createSimpleZoom();
}

// Fallback após 1 segundo
setTimeout(createSimpleZoom, 1000);

console.log("📦 Zoom simples carregado!");
