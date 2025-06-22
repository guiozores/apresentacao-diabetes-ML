// Slide 4e - Classificador de Ipês em Tempo Real
// JavaScript para simulação interativa

class IpeClassifier {
  constructor() {
    this.currentSampleIndex = 0;
    this.isPlaying = false;
    this.animationSpeed = 1;
    this.threshold = 0.5;
    this.processedCount = 0;

    // Estado da matriz de confusão
    this.confusionMatrix = {
      VP: 0, // Verdadeiro Positivo
      FP: 0, // Falso Positivo
      FN: 0, // Falso Negativo
      VN: 0, // Verdadeiro Negativo
    };

    // Dataset simulado
    this.dataset = this.generateDataset();

    // Elementos DOM
    this.elements = this.initializeElements();

    // Event listeners
    this.initializeEventListeners();

    // Inicializar interface
    this.updateInterface();
  }
  generateDataset() {
    const dataset = [];

    // Gerar 20 amostras de Ipê Roxo (com muitos casos difíceis)
    for (let i = 0; i < 20; i++) {
      let probRoxo, probAmarelo;

      if (i < 10) {
        // 50% das amostras roxas são "fáceis" de classificar
        probRoxo = Math.random() * 0.25 + 0.6; // 0.6 - 0.85
        probAmarelo = Math.random() * 0.25 + 0.15; // 0.15 - 0.4
      } else {
        // 50% das amostras roxas são "difíceis" - alta chance de erro
        probRoxo = Math.random() * 0.5 + 0.25; // 0.25 - 0.75 (muito incerto)
        probAmarelo = Math.random() * 0.5 + 0.25; // 0.25 - 0.75 (muito incerto)
      }

      dataset.push({
        id: i + 1,
        tipo: "roxo",
        imagem: "../assets/IPE-ROXO.webp",
        probabilidadeRoxo: probRoxo,
        probabilidadeAmarelo: probAmarelo,
      });
    }

    // Gerar 20 amostras de Ipê Amarelo (com muitos casos difíceis)
    for (let i = 0; i < 20; i++) {
      let probRoxo, probAmarelo;

      if (i < 10) {
        // 50% das amostras amarelas são "fáceis" de classificar
        probRoxo = Math.random() * 0.25 + 0.15; // 0.15 - 0.4
        probAmarelo = Math.random() * 0.25 + 0.6; // 0.6 - 0.85
      } else {
        // 50% das amostras amarelas são "difíceis" - alta chance de erro
        probRoxo = Math.random() * 0.5 + 0.25; // 0.25 - 0.75 (muito incerto)
        probAmarelo = Math.random() * 0.5 + 0.25; // 0.25 - 0.75 (muito incerto)
      }

      dataset.push({
        id: i + 21,
        tipo: "amarelo",
        imagem: "../assets/IPE-AMARELO.webp",
        probabilidadeRoxo: probRoxo,
        probabilidadeAmarelo: probAmarelo,
      });
    }

    // Embaralhar dataset
    return this.shuffleArray(dataset);
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  initializeElements() {
    return {
      // Amostra atual
      currentImage: document.getElementById("currentImage"),
      sampleId: document.getElementById("sampleId"),
      groundTruth: document.getElementById("groundTruth"),
      loadingSpinner: document.querySelector(".loading-spinner"),
      sampleImage: document.querySelector(".sample-image"),

      // Probabilidades
      probRoxo: document.getElementById("probRoxo"),
      probRoxoValue: document.getElementById("probRoxoValue"),
      probAmarelo: document.getElementById("probAmarelo"),
      probAmareloValue: document.getElementById("probAmareloValue"),

      // Predição
      prediction: document.getElementById("prediction"),
      resultStatus: document.getElementById("resultStatus"),

      // Matriz de confusão
      processedCount: document.getElementById("processedCount"),
      cellVP: document.getElementById("cellVP"),
      cellFP: document.getElementById("cellFP"),
      cellFN: document.getElementById("cellFN"),
      cellVN: document.getElementById("cellVN"),

      // Controles
      threshold: document.getElementById("threshold"),
      thresholdValue: document.getElementById("thresholdValue"),
      speed: document.getElementById("speed"),
      playBtn: document.getElementById("playBtn"),
      pauseBtn: document.getElementById("pauseBtn"),
      nextBtn: document.getElementById("nextBtn"),
      resetBtn: document.getElementById("resetBtn"),

      // Métricas
      accuracy: document.getElementById("accuracy"),
      precision: document.getElementById("precision"),
      recall: document.getElementById("recall"),
      f1score: document.getElementById("f1score"),

      // Insights
      insightText: document.getElementById("insightText"),

      // Balão explicativo
      errorOverlay: document.getElementById("errorOverlay"),
      errorExplanation: document.getElementById("errorExplanation"),
      errorIcon: document.getElementById("errorIcon"),
      errorTitleText: document.getElementById("errorTitleText"),
      errorContent: document.getElementById("errorContent"),
      probabilityComparison: document.getElementById("probabilityComparison"),
      predictedType: document.getElementById("predictedType"),
      predictedProb: document.getElementById("predictedProb"),
      actualType: document.getElementById("actualType"),
      errorDetails: document.getElementById("errorDetails"),
      errorContinue: document.getElementById("errorContinue"),
    };
  }

  initializeEventListeners() {
    // Controles de reprodução
    this.elements.playBtn.addEventListener("click", () => this.play());
    this.elements.pauseBtn.addEventListener("click", () => this.pause());
    this.elements.nextBtn.addEventListener("click", () =>
      this.processNextSample()
    );
    this.elements.resetBtn.addEventListener("click", () => this.reset());

    // Controle de threshold
    this.elements.threshold.addEventListener("input", (e) => {
      this.threshold = parseFloat(e.target.value);
      this.elements.thresholdValue.textContent = this.threshold.toFixed(2);
      this.updateMetrics();
      this.updateThresholdInsight();
    });

    // Controle de velocidade
    this.elements.speed.addEventListener("change", (e) => {
      this.animationSpeed = parseFloat(e.target.value);
    });

    // Balão explicativo
    this.elements.errorContinue.addEventListener("click", () => {
      this.hideErrorExplanation();
    });
  }

  async play() {
    this.isPlaying = true;
    this.elements.playBtn.disabled = true;
    this.elements.pauseBtn.disabled = false;

    while (this.isPlaying && this.currentSampleIndex < this.dataset.length) {
      await this.processNextSample();
      await this.delay(2000 / this.animationSpeed);
    }

    if (this.currentSampleIndex >= this.dataset.length) {
      this.pause();
      this.showCompletionMessage();
    }
  }

  pause() {
    this.isPlaying = false;
    this.elements.playBtn.disabled = false;
    this.elements.pauseBtn.disabled = true;
  }

  async processNextSample() {
    if (this.currentSampleIndex >= this.dataset.length) {
      this.showCompletionMessage();
      return;
    }

    const sample = this.dataset[this.currentSampleIndex];

    // Etapa 1: Mostrar nova amostra
    await this.loadNewSample(sample);

    // Etapa 2: Simular processamento
    await this.simulateProcessing();

    // Etapa 3: Mostrar probabilidades
    await this.showProbabilities(sample);

    // Etapa 4: Fazer predição
    await this.makePrediction(sample);

    // Etapa 5: Atualizar matriz
    this.updateConfusionMatrix(sample);

    // Etapa 6: Atualizar métricas
    this.updateMetrics();

    this.currentSampleIndex++;
    this.processedCount++;
    this.elements.processedCount.textContent = this.processedCount;

    this.updateInsights();
  }

  async loadNewSample(sample) {
    // Mostrar loading
    this.elements.loadingSpinner.classList.add("active");
    this.elements.sampleImage.classList.add("processing");

    await this.delay(300 / this.animationSpeed);

    // Atualizar informações da amostra
    this.elements.currentImage.src = sample.imagem;
    this.elements.sampleId.textContent = sample.id;
    this.elements.groundTruth.textContent =
      sample.tipo === "roxo" ? "Ipê Roxo" : "Ipê Amarelo";

    // Remover loading
    this.elements.loadingSpinner.classList.remove("active");
    this.elements.sampleImage.classList.remove("processing");
  }

  async simulateProcessing() {
    // Efeito de processamento
    this.elements.prediction.textContent = "Processando...";
    this.elements.resultStatus.innerHTML =
      '<span class="status-icon">⏳</span><span class="status-text">Analisando...</span>';
    this.elements.resultStatus.className = "result-status";

    await this.delay(500 / this.animationSpeed);
  }

  async showProbabilities(sample) {
    // Animar barras de probabilidade
    const probRoxo = sample.probabilidadeRoxo;
    const probAmarelo = sample.probabilidadeAmarelo;

    // Normalizar para somar 100%
    const total = probRoxo + probAmarelo;
    const normalizedRoxo = (probRoxo / total) * 100;
    const normalizedAmarelo = (probAmarelo / total) * 100;

    // Animar barra roxa
    this.elements.probRoxo.style.width = normalizedRoxo + "%";
    this.elements.probRoxoValue.textContent = normalizedRoxo.toFixed(1) + "%";

    await this.delay(200 / this.animationSpeed);

    // Animar barra amarela
    this.elements.probAmarelo.style.width = normalizedAmarelo + "%";
    this.elements.probAmareloValue.textContent =
      normalizedAmarelo.toFixed(1) + "%";

    await this.delay(300 / this.animationSpeed);
  }

  async makePrediction(sample) {
    // Fazer predição baseada no threshold
    const probRoxo =
      sample.probabilidadeRoxo /
      (sample.probabilidadeRoxo + sample.probabilidadeAmarelo);
    const predicted = probRoxo >= this.threshold ? "roxo" : "amarelo";
    const isCorrect = predicted === sample.tipo;

    // Mostrar predição
    this.elements.prediction.textContent =
      predicted === "roxo" ? "IPÊ ROXO" : "IPÊ AMARELO";
    this.elements.prediction.className = `prediction-value ${predicted}`;

    // Mostrar status do resultado
    const statusIcon = isCorrect ? "✅" : "❌";
    const statusText = isCorrect ? "CORRETO" : "INCORRETO";
    const statusClass = isCorrect ? "correct" : "incorrect";

    this.elements.resultStatus.innerHTML = `<span class="status-icon">${statusIcon}</span><span class="status-text">${statusText}</span>`;
    this.elements.resultStatus.className = `result-status ${statusClass}`;

    await this.delay(500 / this.animationSpeed);

    // Se houve erro, pausar e mostrar explicação
    if (!isCorrect) {
      this.pause();
      await this.showErrorExplanation(sample, predicted, probRoxo);
    }
  }

  updateConfusionMatrix(sample) {
    const probRoxo =
      sample.probabilidadeRoxo /
      (sample.probabilidadeRoxo + sample.probabilidadeAmarelo);
    const predicted = probRoxo >= this.threshold ? "roxo" : "amarelo";
    const actual = sample.tipo;

    // Determinar tipo de resultado
    let cellType;
    if (actual === "roxo" && predicted === "roxo") {
      this.confusionMatrix.VP++;
      cellType = "VP";
    } else if (actual === "amarelo" && predicted === "amarelo") {
      this.confusionMatrix.VN++;
      cellType = "VN";
    } else if (actual === "amarelo" && predicted === "roxo") {
      this.confusionMatrix.FP++;
      cellType = "FP";
    } else if (actual === "roxo" && predicted === "amarelo") {
      this.confusionMatrix.FN++;
      cellType = "FN";
    }

    // Animar célula correspondente
    const cellElement = this.elements[`cell${cellType}`];
    cellElement.classList.add("updating");
    cellElement.querySelector(".cell-value").textContent =
      this.confusionMatrix[cellType];

    setTimeout(() => {
      cellElement.classList.remove("updating");
    }, 600);
  }

  updateMetrics() {
    const { VP, FP, FN, VN } = this.confusionMatrix;
    const total = VP + FP + FN + VN;

    if (total === 0) {
      this.elements.accuracy.textContent = "0.0%";
      this.elements.precision.textContent = "0.0%";
      this.elements.recall.textContent = "0.0%";
      this.elements.f1score.textContent = "0.0%";
      return;
    }

    // Calcular métricas
    const accuracy = ((VP + VN) / total) * 100;
    const precision = VP + FP > 0 ? (VP / (VP + FP)) * 100 : 0;
    const recall = VP + FN > 0 ? (VP / (VP + FN)) * 100 : 0;
    const f1 =
      precision + recall > 0
        ? (2 * precision * recall) / (precision + recall)
        : 0;

    // Atualizar interface com animação
    this.animateMetricUpdate(this.elements.accuracy, accuracy.toFixed(1) + "%");
    this.animateMetricUpdate(
      this.elements.precision,
      precision.toFixed(1) + "%"
    );
    this.animateMetricUpdate(this.elements.recall, recall.toFixed(1) + "%");
    this.animateMetricUpdate(this.elements.f1score, f1.toFixed(1) + "%");
  }

  animateMetricUpdate(element, newValue) {
    element.classList.add("updating");
    element.textContent = newValue;

    setTimeout(() => {
      element.classList.remove("updating");
    }, 300);
  }

  updateInsights() {
    const insights = [
      `Threshold atual: ${this.threshold.toFixed(
        2
      )} - ${this.getThresholdInsight()}`,
      `Amostras processadas: ${this.processedCount}/40`,
      this.getBalanceInsight(),
      this.getPerformanceInsight(),
    ];

    this.elements.insightText.textContent =
      insights[Math.floor(Math.random() * insights.length)];
  }

  getThresholdInsight() {
    if (this.threshold < 0.4) {
      return "ALTA SENSIBILIDADE: detecta mais Ipês Roxos verdadeiros, mas classifica erroneamente alguns Ipês Amarelos como Roxos";
    } else if (this.threshold >= 0.4 && this.threshold <= 0.6) {
      return "THRESHOLD EQUILIBRADO: balanço entre acertos e erros - precisão esperada ~75-80%";
    } else {
      return "ALTA ESPECIFICIDADE: evita classificar Ipês Amarelos como Roxos, mas perde alguns Ipês Roxos verdadeiros";
    }
  }

  updateThresholdInsight() {
    this.elements.insightText.textContent = this.getThresholdInsight();
  }

  getBalanceInsight() {
    const { VP, FP, FN, VN } = this.confusionMatrix;
    const totalErrors = FP + FN;
    const totalCorrect = VP + VN;
    const total = VP + FP + FN + VN;

    if (total === 0) return "Aguardando primeiras classificações...";

    const accuracy = ((VP + VN) / total) * 100;

    if (accuracy > 85) {
      return `Excelente performance! Precisão: ${accuracy.toFixed(
        1
      )}% - modelo muito confiável`;
    } else if (accuracy > 75) {
      return `Boa performance! Precisão: ${accuracy.toFixed(
        1
      )}% - alguns erros são normais em classificação`;
    } else if (accuracy > 60) {
      return `Performance moderada: ${accuracy.toFixed(
        1
      )}% - considere ajustar o threshold`;
    } else {
      return `Performance baixa: ${accuracy.toFixed(
        1
      )}% - modelo precisa de melhorias`;
    }
  }

  getPerformanceInsight() {
    const { VP, FP, FN, VN } = this.confusionMatrix;
    const total = VP + FP + FN + VN;

    if (total === 0) return "Iniciando análise de erros...";

    if (FP > FN) {
      return `${FP} falsos positivos vs ${FN} falsos negativos - modelo "otimista": prefere dizer que é Roxo`;
    } else if (FN > FP) {
      return `${FN} falsos negativos vs ${FP} falsos positivos - modelo "conservador": prefere dizer que é Amarelo`;
    } else if (FP === FN && FP > 0) {
      return `${FP} falsos positivos = ${FN} falsos negativos - erros equilibrados entre as classes`;
    } else {
      return "Nenhum erro até agora - modelo performando perfeitamente!";
    }
  }

  reset() {
    // Resetar estado
    this.currentSampleIndex = 0;
    this.processedCount = 0;
    this.isPlaying = false;

    // Resetar matriz de confusão
    this.confusionMatrix = { VP: 0, FP: 0, FN: 0, VN: 0 };

    // Reembaralhar dataset
    this.dataset = this.shuffleArray(this.dataset);

    // Resetar interface
    this.updateInterface();

    // Resetar controles
    this.elements.playBtn.disabled = false;
    this.elements.pauseBtn.disabled = true;
  }

  updateInterface() {
    // Resetar amostra atual
    this.elements.currentImage.src = "../assets/IPE-ROXO.webp";
    this.elements.sampleId.textContent = "1";
    this.elements.groundTruth.textContent = "Ipê Roxo";

    // Resetar probabilidades
    this.elements.probRoxo.style.width = "0%";
    this.elements.probRoxoValue.textContent = "0%";
    this.elements.probAmarelo.style.width = "0%";
    this.elements.probAmareloValue.textContent = "0%";

    // Resetar predição
    this.elements.prediction.textContent = "Aguardando...";
    this.elements.prediction.className = "prediction-value";
    this.elements.resultStatus.innerHTML =
      '<span class="status-icon">⏳</span><span class="status-text">Aguardando...</span>';
    this.elements.resultStatus.className = "result-status";

    // Resetar matriz
    this.elements.processedCount.textContent = "0";
    this.elements.cellVP.querySelector(".cell-value").textContent = "0";
    this.elements.cellFP.querySelector(".cell-value").textContent = "0";
    this.elements.cellFN.querySelector(".cell-value").textContent = "0";
    this.elements.cellVN.querySelector(".cell-value").textContent = "0";

    // Resetar métricas
    this.updateMetrics();

    // Resetar insights
    this.elements.insightText.textContent =
      "Ajuste o threshold e observe como as métricas mudam em tempo real!";
  }

  showCompletionMessage() {
    this.elements.insightText.textContent =
      "🎉 Simulação completa! Todas as 40 amostras foram processadas. Clique em Reset para recomeçar.";
  }

  async showErrorExplanation(sample, predicted, probRoxo) {
    const actual = sample.tipo;
    const normalizedProbRoxo = (probRoxo * 100).toFixed(1);
    const normalizedProbAmarelo = ((1 - probRoxo) * 100).toFixed(1);

    // Determinar tipo de erro
    let errorType, errorIcon, errorTitle, errorExplanation, errorDetails;

    if (actual === "roxo" && predicted === "amarelo") {
      // Falso Negativo
      errorType = "Falso Negativo";
      errorIcon = "🟡";
      errorTitle = "Falso Negativo - Ipê Roxo perdido!";

      if (this.threshold > 0.7) {
        errorExplanation = `O modelo classificou um Ipê ROXO como AMARELO. Isso acontece quando o threshold está muito alto (${this.threshold.toFixed(
          2
        )}), tornando o modelo muito rigoroso.`;
        errorDetails = `Com ${normalizedProbRoxo}% de probabilidade para Roxo, ficou abaixo do threshold de ${(
          this.threshold * 100
        ).toFixed(
          0
        )}%. Considere reduzir o threshold para capturar mais Ipês Roxos.`;
      } else {
        errorExplanation = `O modelo classificou um Ipê ROXO como AMARELO. O modelo se confundiu com características visuais ambíguas desta amostra.`;
        errorDetails = `Com ${normalizedProbRoxo}% de probabilidade para Roxo, ficou abaixo do threshold de ${(
          this.threshold * 100
        ).toFixed(
          0
        )}%. Este erro é normal em casos de características similares entre as classes.`;
      }
    } else {
      // Falso Positivo
      errorType = "Falso Positivo";
      errorIcon = "🟣";
      errorTitle = "Falso Positivo - Confusão de cores!";

      if (this.threshold < 0.3) {
        errorExplanation = `O modelo classificou um Ipê AMARELO como ROXO. Isso acontece quando o threshold está muito baixo (${this.threshold.toFixed(
          2
        )}), tornando o modelo muito sensível.`;
        errorDetails = `Com ${normalizedProbRoxo}% de probabilidade para Roxo, ficou acima do threshold de ${(
          this.threshold * 100
        ).toFixed(
          0
        )}%. Considere aumentar o threshold para reduzir falsos positivos.`;
      } else {
        errorExplanation = `O modelo classificou um Ipê AMARELO como ROXO. O modelo se confundiu com características visuais similares desta amostra.`;
        errorDetails = `Com ${normalizedProbRoxo}% de probabilidade para Roxo, ficou acima do threshold de ${(
          this.threshold * 100
        ).toFixed(
          0
        )}%. Este erro é normal em casos onde as características são ambíguas.`;
      }
    }

    // Preencher conteúdo do balão
    this.elements.errorIcon.textContent = errorIcon;
    this.elements.errorTitleText.textContent = errorTitle;
    this.elements.errorContent.textContent = errorExplanation;
    this.elements.errorDetails.textContent = errorDetails;

    // Preencher comparação de probabilidades
    this.elements.predictedType.textContent =
      predicted === "roxo" ? "Ipê Roxo" : "Ipê Amarelo";
    this.elements.predictedProb.textContent =
      predicted === "roxo"
        ? normalizedProbRoxo + "%"
        : normalizedProbAmarelo + "%";
    this.elements.actualType.textContent =
      actual === "roxo" ? "Ipê Roxo" : "Ipê Amarelo";

    // Mostrar overlay e balão
    this.elements.errorOverlay.classList.add("show");
    this.elements.errorExplanation.classList.add("show");

    // Retornar uma Promise que resolve quando o usuário clica em continuar
    return new Promise((resolve) => {
      this.errorResolve = resolve;
    });
  }

  hideErrorExplanation() {
    this.elements.errorOverlay.classList.remove("show");
    this.elements.errorExplanation.classList.remove("show");

    // Resolver a Promise para continuar a execução
    if (this.errorResolve) {
      this.errorResolve();
      this.errorResolve = null;
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Inicializar quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  new IpeClassifier();
});
