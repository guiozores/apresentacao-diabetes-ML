// Slide 12: SMOTE Visualization - Simplified

class SMOTEVisualization {
  constructor() {
    this.originalData = {};
    this.balancedData = {};

    this.init();
  }

  init() {
    this.generateDatasets();
    this.renderPlots();
  }

  generateDatasets() {
    // Dataset original - fortemente desbalanceado (80% não diabéticos, 20% diabéticos)
    // Números menores para visualização mais clara do desequilíbrio
    this.originalData = {
      normal: this.generatePoints(80, "normal"), // 80% - classe majoritária
      diabetes: this.generatePoints(20, "diabetes"), // 20% - classe minoritária
    };

    // Dataset balanceado com SMOTE (80 cada = 50% cada)
    this.balancedData = {
      normal: [...this.originalData.normal], // Mantém os MESMOS pontos azuis (80)
      diabetes: [...this.originalData.diabetes], // Mantém diabéticos originais (20)
      synthetic: this.generatePoints(60, "synthetic"), // Adiciona 60 sintéticos = 80 total diabéticos (50%)
    };
  }

  generatePoints(count, type) {
    const points = [];
    for (let i = 0; i < count; i++) {
      // Distribui pontos aleatoriamente pela área
      points.push({
        x: Math.random() * 90 + 5, // 5% a 95% da largura
        y: Math.random() * 90 + 5, // 5% a 95% da altura
        type: type,
      });
    }
    return points;
  }

  renderPlots() {
    this.renderPlot("originalPlot", this.originalData);
    this.renderPlot("balancedPlot", this.balancedData);
  }

  renderPlot(containerId, data) {
    const container = document.getElementById(containerId);
    const plotArea = container.querySelector(".plot-area");

    // Limpa pontos existentes
    plotArea.innerHTML = "";

    // Dimensões do plot
    const width = plotArea.offsetWidth;
    const height = plotArea.offsetHeight;

    // Renderiza pontos normais
    data.normal.forEach((point, index) => {
      setTimeout(() => {
        this.createDataPoint(plotArea, point, width, height);
      }, index * 20);
    });

    // Renderiza pontos diabéticos
    data.diabetes.forEach((point, index) => {
      setTimeout(() => {
        this.createDataPoint(plotArea, point, width, height);
      }, data.normal.length * 20 + index * 30);
    });

    // Renderiza pontos sintéticos (se existirem)
    if (data.synthetic) {
      data.synthetic.forEach((point, index) => {
        setTimeout(() => {
          this.createDataPoint(plotArea, point, width, height);
        }, data.normal.length * 20 + data.diabetes.length * 30 + index * 50);
      });
    }
  }

  createDataPoint(container, point, width, height) {
    const dot = document.createElement("div");
    dot.className = `data-point ${point.type}`;

    // Posiciona o ponto usando porcentagens
    const x = (point.x / 100) * (width - 10) + 5;
    const y = (point.y / 100) * (height - 10) + 5;

    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.width = "6px"; // Todos os pontos com mesmo tamanho
    dot.style.height = "6px"; // Todos os pontos com mesmo tamanho

    // Tooltip simples
    dot.title = this.getTooltip(point);

    // Animação de entrada
    dot.style.opacity = "0";
    dot.style.transform = "scale(0)";
    container.appendChild(dot);

    setTimeout(() => {
      dot.style.opacity = "1";
      dot.style.transform = "scale(1)";
    }, 50);

    return dot;
  }

  getTooltip(point) {
    switch (point.type) {
      case "normal":
        return "Paciente Não Diabético";
      case "diabetes":
        return "Paciente Diabético (Original)";
      case "synthetic":
        return "Paciente Diabético (Sintético - SMOTE)";
      default:
        return "";
    }
  }
}

// Inicializa quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  new SMOTEVisualization();
});

// Redimensiona os plots quando a janela é redimensionada
window.addEventListener("resize", () => {
  setTimeout(() => {
    new SMOTEVisualization();
  }, 100);
});
