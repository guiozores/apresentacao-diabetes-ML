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

    // Gerar 20 amostras de Ipê Roxo (classe negativa)
    for (let i = 0; i < 20; i++) {
      let probAmarelo; // Probabilidade da classe positiva

      if (i < 10) {
        // 50% das amostras roxas são "fáceis" de classificar (baixa prob. de amarelo)
        probAmarelo = Math.random() * 0.25 + 0.15; // 0.15 - 0.4
      } else {
        // 50% das amostras roxas são "difíceis" - podem confundir o modelo
        probAmarelo = Math.random() * 0.5 + 0.25; // 0.25 - 0.75 (incerto)
      }

      dataset.push({
        id: i + 1,
        tipo: "roxo", // classe negativa
        imagem: "../assets/IPE-ROXO.webp",
        probabilidadeAmarelo: probAmarelo, // probabilidade da classe positiva
      });
    }

    // Gerar 20 amostras de Ipê Amarelo (classe positiva)
    for (let i = 0; i < 20; i++) {
      let probAmarelo; // Probabilidade da classe positiva

      if (i < 10) {
        // 50% das amostras amarelas são "fáceis" de classificar (alta prob. de amarelo)
        probAmarelo = Math.random() * 0.25 + 0.6; // 0.6 - 0.85
      } else {
        // 50% das amostras amarelas são "difíceis" - podem confundir o modelo
        probAmarelo = Math.random() * 0.5 + 0.25; // 0.25 - 0.75 (incerto)
      }

      dataset.push({
        id: i + 21,
        tipo: "amarelo", // classe positiva
        imagem: "../assets/IPE-AMARELO.webp",
        probabilidadeAmarelo: probAmarelo, // probabilidade da classe positiva
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
      probAmarelo: document.getElementById("probAmarelo"),
      probAmareloValue: document.getElementById("probAmareloValue"),
      thresholdLine: document.getElementById("thresholdLine"),
      thresholdDisplay: document.getElementById("thresholdDisplay"),

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
      specificity: document.getElementById("specificity"),

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
      this.updateThresholdDisplay();
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

  updateInterface() {
    this.updateThresholdDisplay();
    this.updateMetrics();
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
    // Mostrar apenas a probabilidade da classe positiva (Ipê Amarelo)
    const probAmarelo = sample.probabilidadeAmarelo;
    const probAmareloPercent = (probAmarelo * 100).toFixed(1);

    // Animar barra de probabilidade da classe positiva
    this.elements.probAmarelo.style.width = probAmareloPercent + "%";
    this.elements.probAmareloValue.textContent = probAmareloPercent + "%";

    // Mostrar threshold visual
    const thresholdPercent = (this.threshold * 100).toFixed(0);
    this.elements.thresholdDisplay.textContent = thresholdPercent + "%";
    if (this.elements.thresholdLine) {
      this.elements.thresholdLine.style.left = thresholdPercent + "%";
    }

    await this.delay(500 / this.animationSpeed);
  }

  async makePrediction(sample) {
    // Fazer predição baseada no threshold (classificação binária correta)
    const probAmarelo = sample.probabilidadeAmarelo; // probabilidade da classe positiva
    const predicted = probAmarelo >= this.threshold ? "amarelo" : "roxo";
    const isCorrect = predicted === sample.tipo;

    // Mostrar predição
    this.elements.prediction.textContent =
      predicted === "amarelo" ? "IPÊ AMARELO" : "IPÊ ROXO";
    this.elements.prediction.className = `prediction-value ${predicted}`;

    // Mostrar status do resultado
    const statusIcon = isCorrect ? "✓" : "✗";
    const statusText = isCorrect ? "CORRETO" : "INCORRETO";
    const statusClass = isCorrect ? "correct" : "incorrect";

    this.elements.resultStatus.innerHTML = `<span class="status-icon">${statusIcon}</span><span class="status-text">${statusText}</span>`;
    this.elements.resultStatus.className = `result-status ${statusClass}`;

    await this.delay(500 / this.animationSpeed);

    // Se houve erro, pausar e mostrar explicação
    if (!isCorrect) {
      this.pause();
      await this.showErrorExplanation(sample, predicted, probAmarelo);
    }
  }

  updateConfusionMatrix(sample) {
    const probAmarelo = sample.probabilidadeAmarelo; // probabilidade da classe positiva
    const predicted = probAmarelo >= this.threshold ? "amarelo" : "roxo";
    const actual = sample.tipo;

    // Determinar tipo de resultado seguindo padrão sklearn
    // Amarelo = Positivo (classe de interesse), Roxo = Negativo
    let cellType;
    if (actual === "amarelo" && predicted === "amarelo") {
      this.confusionMatrix.VP++; // Verdadeiro Positivo
      cellType = "VP";
    } else if (actual === "roxo" && predicted === "amarelo") {
      this.confusionMatrix.FP++; // Falso Positivo
      cellType = "FP";
    } else if (actual === "amarelo" && predicted === "roxo") {
      this.confusionMatrix.FN++; // Falso Negativo
      cellType = "FN";
    } else if (actual === "roxo" && predicted === "roxo") {
      this.confusionMatrix.VN++; // Verdadeiro Negativo
      cellType = "VN";
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
      this.elements.specificity.textContent = "0.0%";
      return;
    }

    // Calcular métricas
    const accuracy = ((VP + VN) / total) * 100;
    const precision = VP + FP > 0 ? (VP / (VP + FP)) * 100 : 0;
    const recall = VP + FN > 0 ? (VP / (VP + FN)) * 100 : 0; // Sensibilidade
    const specificity = VN + FP > 0 ? (VN / (VN + FP)) * 100 : 0; // Especificidade

    // Atualizar interface com animação
    this.animateMetricUpdate(this.elements.accuracy, accuracy.toFixed(1) + "%");
    this.animateMetricUpdate(
      this.elements.precision,
      precision.toFixed(1) + "%"
    );
    this.animateMetricUpdate(this.elements.recall, recall.toFixed(1) + "%");
    this.animateMetricUpdate(
      this.elements.specificity,
      specificity.toFixed(1) + "%"
    );
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
      return "ALTA SENSIBILIDADE: detecta mais Ipês Amarelos verdadeiros, mas classifica erroneamente alguns Ipês Roxos como Amarelos";
    } else if (this.threshold >= 0.4 && this.threshold <= 0.6) {
      return "THRESHOLD EQUILIBRADO: balanço entre sensibilidade e especificidade - precisão esperada ~75-80%";
    } else {
      return "ALTA ESPECIFICIDADE: evita classificar Ipês Roxos como Amarelos, mas perde alguns Ipês Amarelos verdadeiros";
    }
  }

  updateThresholdDisplay() {
    const thresholdPercent = (this.threshold * 100).toFixed(0);
    if (this.elements.thresholdDisplay) {
      this.elements.thresholdDisplay.textContent = thresholdPercent + "%";
    }
    if (this.elements.thresholdLine) {
      this.elements.thresholdLine.style.left = thresholdPercent + "%";
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
      return `Acurácia elevada: ${accuracy.toFixed(
        1
      )}% - modelo demonstra alta confiabilidade`;
    } else if (accuracy > 75) {
      return `Acurácia satisfatória: ${accuracy.toFixed(
        1
      )}% - desempenho dentro do esperado para classificação`;
    } else if (accuracy > 60) {
      return `Acurácia intermediária: ${accuracy.toFixed(
        1
      )}% - otimize o threshold para melhor balanço entre precisão e recall`;
    } else {
      return `Acurácia insuficiente: ${accuracy.toFixed(
        1
      )}% - necessário retreinamento ou ajuste de parâmetros`;
    }
  }

  getPerformanceInsight() {
    const { VP, FP, FN, VN } = this.confusionMatrix;
    const total = VP + FP + FN + VN;

    if (total === 0) return "Iniciando análise de erros...";

    if (FP > FN) {
      return `${FP} falsos positivos vs ${FN} falsos negativos - modelo "otimista": prefere classificar como Amarelo`;
    } else if (FN > FP) {
      return `${FN} falsos negativos vs ${FP} falsos positivos - modelo "conservador": prefere classificar como Roxo`;
    } else if (FP === FN && FP > 0) {
      return `${FP} falsos positivos = ${FN} falsos negativos - erros equilibrados entre as classes`;
    } else {
      return "Classificação perfeita - nenhum erro identificado até o momento";
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
    this.resetInterface();

    // Resetar controles
    this.elements.playBtn.disabled = false;
    this.elements.pauseBtn.disabled = true;
  }

  resetInterface() {
    // Resetar amostra atual
    this.elements.currentImage.src = "../assets/IPE-ROXO.webp";
    this.elements.sampleId.textContent = "1";
    this.elements.groundTruth.textContent = "Ipê Roxo";

    // Resetar probabilidades
    this.elements.probAmarelo.style.width = "0%";
    this.elements.probAmareloValue.textContent = "0%";
    if (this.elements.thresholdDisplay) {
      this.elements.thresholdDisplay.textContent =
        (this.threshold * 100).toFixed(0) + "%";
    }

    // Resetar predição
    this.elements.prediction.textContent = "Aguardando...";
    this.elements.prediction.className = "prediction-value";
    this.elements.resultStatus.innerHTML =
      '<span class="status-icon"></span><span class="status-text">Aguardando...</span>';
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
      "Ajuste o threshold para observar o impacto nas métricas de classificação";
  }

  showCompletionMessage() {
    this.elements.insightText.textContent =
      "Simulação concluída. 40 amostras processadas. Utilize o botão Reset para reiniciar a análise.";
  }

  async showErrorExplanation(sample, predicted, probAmarelo) {
    const actual = sample.tipo;
    const normalizedProbAmarelo = (probAmarelo * 100).toFixed(1);
    const normalizedProbRoxo = ((1 - probAmarelo) * 100).toFixed(1);

    // Determinar tipo de erro
    let errorType, errorIcon, errorTitle, errorExplanation, errorDetails;

    if (actual === "amarelo" && predicted === "roxo") {
      // Falso Negativo
      errorType = "Falso Negativo";
      errorIcon = "!";
      errorTitle = "Falso Negativo - Classificação Incorreta";

      if (this.threshold > 0.7) {
        errorExplanation = `O modelo classificou um Ipê AMARELO como ROXO. Isso acontece quando o threshold está muito alto (${this.threshold.toFixed(
          2
        )}), tornando o modelo muito rigoroso.`;
        errorDetails = `Com ${normalizedProbAmarelo}% de probabilidade para Amarelo, ficou abaixo do threshold de ${(
          this.threshold * 100
        ).toFixed(
          0
        )}%. Considere reduzir o threshold para capturar mais Ipês Amarelos.`;
      } else {
        errorExplanation = `O modelo classificou um Ipê AMARELO como ROXO. Características visuais ambíguas desta amostra dificultaram a classificação correta.`;
        errorDetails = `Com ${normalizedProbAmarelo}% de probabilidade para Amarelo, ficou abaixo do threshold de ${(
          this.threshold * 100
        ).toFixed(
          0
        )}%. Este erro é normal em casos de características similares entre as classes.`;
      }
    } else {
      // Falso Positivo
      errorType = "Falso Positivo";
      errorIcon = "!";
      errorTitle = "Falso Positivo - Classificação Incorreta";

      if (this.threshold < 0.3) {
        errorExplanation = `O modelo classificou um Ipê ROXO como AMARELO. Isso acontece quando o threshold está muito baixo (${this.threshold.toFixed(
          2
        )}), tornando o modelo muito sensível.`;
        errorDetails = `Com ${normalizedProbAmarelo}% de probabilidade para Amarelo, ficou acima do threshold de ${(
          this.threshold * 100
        ).toFixed(
          0
        )}%. Considere aumentar o threshold para reduzir falsos positivos.`;
      } else {
        errorExplanation = `O modelo classificou um Ipê ROXO como AMARELO. Características visuais similares desta amostra dificultaram a discriminação entre as classes.`;
        errorDetails = `Com ${normalizedProbAmarelo}% de probabilidade para Amarelo, ficou acima do threshold de ${(
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
