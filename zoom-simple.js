/**
 * Sistema de Zoom SIMPLES E DIRETO - COM TRAVAMENTO E PAN
 * Versão 2.0 - Funcionalidades:
 * 1. Clique na imagem = ativa zoom (lupa segue cursor)
 * 2. Clique na lupa = trava lupa + permite pan da janela
 * 3. Clique fora = desativa tudo
 */

console.log("🚀 CARREGANDO ZOOM SIMPLES V2.0...");

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

    // Variáveis do zoom - usando máquina de estados
    let zoomState = "inactive"; // Estados: 'inactive', 'active', 'locked'
    let isDragging = false;
    let lensElement = null;
    let resultElement = null;
    let dragOffset = { x: 0, y: 0 };
    let lockedPosition = { x: 0, y: 0 };
    let overlayMonitor = null;

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
      // Verifica se já existem elementos criados
      if (lensElement && resultElement) {
        console.log("⚠️ Elementos já existem, não criando novos");
        return;
      }

      // Remove elementos antigos se existirem
      const oldLens = document.getElementById(`simple-lens-${index}`);
      const oldResult = document.getElementById(`simple-result-${index}`);
      if (oldLens) oldLens.remove();
      if (oldResult) oldResult.remove();

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
        cursor: pointer !important;
      `;

      // Adiciona event listener para cliques na lente quando travado
      lensElement.addEventListener("click", (e) => {
        if (zoomState === "locked") {
          console.log(
            "🖱️ Clique direto na lente - tratando como clique na imagem"
          );
          e.stopPropagation();
          handleImageClick(e);
        }
      });

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
        user-select: none !important;
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
      zoomState = "active";
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
      resultElement.style.top = "20px";

      // Garante que os elementos estejam visíveis e funcionando
      lensElement.style.display = "block";
      resultElement.style.display = "block";

      console.log("🖼️ Background configurado:", bgSize);
      console.log("✅ Zoom ativado com elementos visíveis");
    }

    // Garantir persistência do liquid glass
    function ensureLiquidGlass() {
      if (zoomState !== "locked") return;

      const overlay = document.getElementById(`liquid-glass-${index}`);
      if (!overlay || overlay.style.opacity !== "1") {
        console.log("🔄 Reforçando liquid glass...");
        applyLiquidGlass();
      }
    }

    // Aplicar efeito liquid glass
    function applyLiquidGlass() {
      console.log("✨ APLICANDO LIQUID GLASS!");

      // Verifica se já existe overlay ativo
      const existingOverlay = document.getElementById(`liquid-glass-${index}`);
      if (existingOverlay && existingOverlay.style.opacity === "1") {
        console.log("✅ Overlay já existe e está ativo");
        return;
      }

      // Remove overlay antigo se existir
      if (existingOverlay) {
        console.log("🗑️ Removendo overlay antigo");
        existingOverlay.remove();
      }

      // Cria novo overlay
      const overlay = document.createElement("div");
      overlay.id = `liquid-glass-${index}`;
      overlay.className = `liquid-glass-overlay-${index}`;
      overlay.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        backdrop-filter: blur(8px) saturate(180%) !important;
        background: rgba(255, 255, 255, 0.1) !important;
        z-index: 99990 !important;
        pointer-events: none !important;
        transition: all 0.3s ease !important;
        opacity: 0 !important;
      `;

      // Adiciona atributo para identificação
      overlay.setAttribute("data-zoom-overlay", "true");
      overlay.setAttribute("data-zoom-index", index);
      overlay.setAttribute("data-persistent", "true");

      document.body.appendChild(overlay);
      console.log("📦 Overlay criado e adicionado ao DOM");

      // Anima entrada
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.style.opacity = "1";
          console.log("🎭 Animação de entrada iniciada");
        });
      });

      // Aumenta z-index da janela de zoom para ficar acima
      if (resultElement) {
        resultElement.style.zIndex = "99999";
        console.log("⬆️ Z-index da janela atualizado para 99999");
      }
    }

    // Remover efeito liquid glass
    function removeLiquidGlass() {
      console.log("💨 REMOVENDO LIQUID GLASS!");

      const overlay = document.getElementById(`liquid-glass-${index}`);
      if (overlay) {
        overlay.style.opacity = "0";
        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        }, 300);
      }

      // Restaura z-index da janela de zoom
      if (resultElement) {
        resultElement.style.zIndex = "99998";
      }
    }

    // Travar zoom
    function lockZoom(mouseX, mouseY) {
      console.log("🔒 TRAVANDO ZOOM!");

      // Verifica se elementos existem
      if (!lensElement || !resultElement) {
        console.error("❌ Elementos não existem! Abortando travamento.");
        return;
      }

      zoomState = "locked";
      lockedPosition = { x: mouseX, y: mouseY };
      console.log("✅ Estado travado.");

      // Muda cursor e permite pointer events na janela de zoom
      img.style.cursor = "default";
      resultElement.style.cursor = "grab";
      resultElement.style.pointerEvents = "auto";
      lensElement.style.pointerEvents = "auto"; // Permite cliques na lente quando travado

      // Adiciona borda vermelha para indicar modo travado
      lensElement.style.border = "3px solid #ff4444";
      resultElement.style.border = "3px solid #ff4444";
      console.log("🔴 Bordas vermelhas aplicadas");

      // Aplica efeito liquid glass
      applyLiquidGlass();
      console.log("✨ Liquid glass aplicado");

      // Inicia monitoramento do overlay
      if (overlayMonitor) clearInterval(overlayMonitor);
      overlayMonitor = setInterval(() => {
        ensureLiquidGlass();
      }, 100); // Verifica a cada 100ms
      console.log("👁️ Monitor de overlay iniciado");

      updateZoomPosition(mouseX, mouseY);
      console.log("📍 Posição atualizada para:", mouseX, mouseY);
    }

    // Destravar zoom
    function unlockZoom() {
      console.log("🔓 DESTRAVANDO ZOOM!");
      zoomState = "active";
      isDragging = false;

      // Para monitoramento do overlay
      if (overlayMonitor) {
        clearInterval(overlayMonitor);
        overlayMonitor = null;
        console.log("👁️ Monitor de overlay parado");
      }

      // Restaura cursor e remove pointer events
      img.style.cursor = "crosshair";
      resultElement.style.cursor = "default";
      resultElement.style.pointerEvents = "none";
      lensElement.style.pointerEvents = "none";

      // Restaura borda azul
      lensElement.style.border = "3px solid #007acc";
      resultElement.style.border = "3px solid #007acc";

      // Remove efeito liquid glass
      removeLiquidGlass();
    } // Desativar zoom
    function deactivateZoom() {
      console.log("❌ DESATIVANDO ZOOM");
      zoomState = "inactive";
      isDragging = false;
      img.style.cursor = "pointer";
      img.style.border = "none";

      // Para monitoramento do overlay
      if (overlayMonitor) {
        clearInterval(overlayMonitor);
        overlayMonitor = null;
        console.log("👁️ Monitor de overlay parado");
      }

      // Remove efeito liquid glass
      removeLiquidGlass();

      if (lensElement) {
        lensElement.style.display = "none";
        lensElement.style.border = "3px solid #007acc"; // Reset cor
      }
      if (resultElement) {
        resultElement.style.display = "none";
        resultElement.style.pointerEvents = "none";
        resultElement.style.border = "3px solid #007acc"; // Reset cor
      }
    }

    // Atualizar posição do zoom
    function updateZoomPosition(mouseX, mouseY) {
      const imgRect = img.getBoundingClientRect();

      // Posiciona lente
      const lensX = mouseX - config.lensWidth / 2;
      const lensY = mouseY - config.lensHeight / 2;
      lensElement.style.left = lensX + "px";
      lensElement.style.top = lensY + "px";
      lensElement.style.display = "block";

      // Atualiza zoom
      const relativeX = mouseX / imgRect.width;
      const relativeY = mouseY / imgRect.height;

      const bgWidth = imgRect.width * config.factor;
      const bgHeight = imgRect.height * config.factor;

      const bgX = relativeX * bgWidth - config.boxWidth / 2;
      const bgY = relativeY * bgHeight - config.boxHeight / 2;

      resultElement.style.backgroundPosition = `-${bgX}px -${bgY}px`;
      resultElement.style.display = "block";
    }

    // Movimento do mouse
    function handleMouseMove(e) {
      if (zoomState !== "active") return; // Para quando travado ou inativo

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
        if (lensElement) lensElement.style.display = "none";
        if (resultElement) resultElement.style.display = "none";
        return;
      }

      // Garante que elementos existem antes de atualizar
      if (lensElement && resultElement) {
        updateZoomPosition(mouseX, mouseY);
      }
    }

    // Clique na imagem
    function handleImageClick(e) {
      e.preventDefault();
      e.stopPropagation(); // Impede que o clique se propague para o document

      console.log(`🖱️ CLIQUE NA IMAGEM! Estado atual: ${zoomState}`);

      if (!lensElement) {
        createZoomElements();
      }

      const imgRect = img.getBoundingClientRect();
      const mouseX = e.clientX - imgRect.left;
      const mouseY = e.clientY - imgRect.top;

      switch (zoomState) {
        case "inactive":
          // 1. Primeiro clique: Ativa o zoom (lupa solta)
          console.log("🎯 1º CLIQUE: Ativando zoom...");
          activateZoom();
          updateZoomPosition(mouseX, mouseY);
          console.log("✅ Zoom ativado. Novo estado: active");
          break;

        case "active":
          // 2. Segundo clique: Trava a lupa e borra o fundo
          console.log("🔒 2º CLIQUE: Travando zoom...");
          lockZoom(mouseX, mouseY);
          console.log("✅ Zoom travado. Novo estado: locked");
          break;

        case "locked":
          // 3. Terceiro clique (na imagem): Destrava, volta para lupa solta
          console.log("🔓 3º CLIQUE (na imagem): Destravando zoom...");
          unlockZoom();
          console.log("✅ Zoom destravado. Novo estado: active");
          break;
      }

      console.log(`📊 Estado final: ${zoomState}`);
    }

    // Drag da janela de zoom
    function handleResultMouseDown(e) {
      if (zoomState !== "locked") return;

      console.log("🖱️ INICIANDO DRAG DA JANELA!");
      isDragging = true;
      resultElement.style.cursor = "grabbing";

      const rect = resultElement.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;

      e.preventDefault();
    }

    function handleDocumentMouseMove(e) {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Limita para não sair da tela
      const maxX = window.innerWidth - config.boxWidth;
      const maxY = window.innerHeight - config.boxHeight;

      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));

      resultElement.style.left = boundedX + "px";
      resultElement.style.right = "auto";
      resultElement.style.top = boundedY + "px";

      // Garante que z-index permaneça correto
      resultElement.style.zIndex = "99999";
    }

    function handleDocumentMouseUp() {
      if (!isDragging) return;

      console.log("🖱️ FINALIZANDO DRAG!");
      isDragging = false;
      resultElement.style.cursor = "grab";
    }

    // Event listeners
    img.addEventListener("click", handleImageClick);
    img.addEventListener("mousemove", handleMouseMove);

    img.addEventListener("mouseleave", () => {
      if (zoomState === "active") {
        lensElement.style.display = "none";
        resultElement.style.display = "none";
      }
    });

    // Event listeners para drag da janela
    document.addEventListener("mousedown", (e) => {
      if (resultElement && resultElement.contains(e.target)) {
        handleResultMouseDown(e);
      }
    });

    document.addEventListener("mousemove", handleDocumentMouseMove);
    document.addEventListener("mouseup", handleDocumentMouseUp);

    // Clique fora da imagem para desativar zoom
    document.addEventListener("click", (e) => {
      // Se clicar na lente quando travado, trata como clique na imagem
      if (
        zoomState === "locked" &&
        lensElement &&
        lensElement.contains(e.target)
      ) {
        console.log(
          "🖱️ Clique na lente detectado - tratando como clique na imagem"
        );
        // Simula clique na imagem
        handleImageClick(e);
        return;
      }

      if (
        zoomState !== "inactive" &&
        !img.contains(e.target) &&
        (!resultElement || !resultElement.contains(e.target)) &&
        (!lensElement || !lensElement.contains(e.target))
      ) {
        console.log("🖱️ Clique fora detectado - desativando zoom");
        deactivateZoom();
      }
    });

    console.log(`✅ Zoom ${index + 1} configurado com sucesso!`);
  });
}

// Executa quando DOM estiver pronto (apenas uma vez)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createSimpleZoom);
} else {
  createSimpleZoom();
}

console.log("📦 Zoom simples V2.0 carregado!");
