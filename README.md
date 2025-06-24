# Apresentação Monografia - Machine Learning para Predição de Diabetes

Apresentação moderna e interativa para defesa de monografia sobre **Machine Learning aplicado à predição de diabetes**, desenvolvida com HTML, CSS e JavaScript puros.

## 🎯 Sobre o Projeto

Esta apresentação foi desenvolvida para a defesa de uma monografia que explora técnicas de Machine Learning para predição de diabetes, incluindo:

- **Análise Exploratória de Dados (AED)**
- **Pré-processamento de dados** (tratamento de outliers, normalização, balanceamento com SMOTE)
- **Implementação de múltiplos algoritmos** de ML
- **Otimização de hiperparâmetros**
- **Avaliação e comparação de modelos**
- **Análise de resultados** com métricas específicas para problemas de saúde

## ✨ Características Técnicas

- **Design Responsivo**: Adaptável a diferentes tamanhos de tela
- **Navegação Fluida**: Múltiplas formas de navegação entre slides
- **Animações Suaves**: Transições elegantes entre conteúdos
- **Controles Intuitivos**: Teclado, mouse, touch e botões visuais
- **Modular**: Cada slide é um arquivo HTML independente com CSS próprio

## 🚀 Como Executar

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor local (opcional, mas recomendado)

### Execução Local

```bash
# Opção 1: Servidor HTTP simples com Python
python -m http.server 8000

# Opção 2: Servidor com Node.js (se tiver instalado)
npx serve .

# Opção 3: Abrir diretamente no navegador
# Simplesmente abra o arquivo index.html
```

### Acesso

Abra no navegador: `http://localhost:8000` ou diretamente o arquivo `index.html`

## 🎮 Controles de Navegação

- **Setas do Teclado**: ← → para navegar entre slides
- **Espaço**: Próximo slide
- **PageUp/PageDown**: Navegação por slides
- **Home/End**: Primeiro/último slide
- **ESC**: Alternar tela cheia
- **Mouse Wheel**: Navegação por scroll
- **Toque (Mobile)**: Swipe para navegar
- **Botões na Tela**: Controles visuais na parte inferior

### Estrutura da Apresentação

A apresentação contém slides organizados cobrindo todo o processo de desenvolvimento:

- **Slides 1-5**: Introdução, problema, objetivos e metodologia
- **Slides 6-10**: Entendimento e preparação dos dados
- **Slides 11-15**: Análise Exploratória de Dados (AED)
- **Slides 16-20**: Pré-processamento (outliers, normalização, SMOTE)
- **Slides 21-25**: Modelagem e treinamento
- **Slides 26-30**: Resultados, otimização e conclusões

### Modelos de Machine Learning Apresentados

- Logistic Regression
- Random Forest
- Support Vector Machine (SVM)
- Gradient Boosting
- XGBoost
- Decision Tree
- AdaBoost
- kNN
- Naive Bayes

### Assets Disponíveis

O projeto inclui gráficos e visualizações organizados por categoria:

- **AED**: Análise exploratória (AED-01.png a AED-08.png)
- **Pré-processamento**: PRE-PROCESS-01.png, PRE-PROCESS-02.png
- **Tratamento de Outliers**: IQR-01.png a IQR-03.png, NORMAL-01.png
- **Balanceamento**: SMOTE-01.png
- **Otimização**: OTIMIZA-01.png a OTIMIZA-07.png
- **Resultados**: RESULT-TREINA-01.png a RESULT-TREINA-06.png

## 📊 Conteúdo Técnico da Monografia

### Metodologia

- **Framework**: CRISP-DM (Cross-Industry Standard Process for Data Mining)
- **Dataset**: Pima Indians Diabetes Database
- **Linguagem**: Python com bibliotecas científicas (scikit-learn, pandas, matplotlib, seaborn)

### Técnicas de Pré-processamento

- **Tratamento de Outliers**: Método IQR (Interquartile Range)
- **Normalização**: StandardScaler e MinMaxScaler
- **Balanceamento**: SMOTE (Synthetic Minority Oversampling Technique)
- **Seleção de Features**: Análise de correlação e importância

### Métricas de Avaliação

- **Acurácia**: Precisão geral do modelo
- **Precisão**: Taxa de verdadeiros positivos
- **Recall (Sensibilidade)**: Capacidade de detectar casos positivos
- **F1-Score**: Harmônica entre precisão e recall
- **AUC-ROC**: Área sob a curva ROC
- **Matriz de Confusão**: Análise detalhada de erros

## 🎨 Personalização

### Cores

As cores principais estão definidas no `:root` do CSS:

- `--primary-blue`: Azul principal da Apple (#007AFF)
- `--primary-dark`: Azul escuro (#0051D5)
- `--gradient-text`: Gradiente para títulos

### Fontes

- **Títulos**: Inter com gradiente
- **Texto**: Inter regular
- **Família**: Fallback para fontes do sistema Apple

### Animações

- Cada slide tem animações específicas
- Elementos aparecem com stagger timing
- Hover effects em elementos interativos

## 📱 Responsividade

A apresentação se adapta automaticamente a diferentes tamanhos de tela:

- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Layout adaptado com navegação por toque
- **Mobile**: Layout otimizado para visualização em dispositivos pequenos

## 🔧 Funcionalidades Técnicas

### JavaScript

- **Classe PresentationController**: Controla toda a navegação
- **Observers**: Detectam quando slides ficam visíveis para animações
- **Event Listeners**: Múltiplas formas de navegação
- **Responsive**: Adaptação automática para diferentes dispositivos

### CSS

- **CSS Grid/Flexbox**: Layout moderno e responsivo
- **CSS Custom Properties**: Fácil personalização de cores e espaçamentos
- **Smooth Transitions**: Animações suaves entre slides
- **Print Styles**: Preparado para impressão (se necessário)


## Estrutura do Projeto

```
apresentacao-diabetes-ML/
├── index.html              # Página principal da apresentação
├── script.js               # Lógica de navegação e controles
├── styles.css              # Estilos globais
├── global.css              # Estilos adicionais
├── guia-rapido.html        # Guia rápido de navegação
├── index-original.html     # Versão original (backup)
├── Monografia.pdf          # Documento da monografia
├── README.md               # Este arquivo
├── assets/                 # Gráficos e visualizações
│   ├── AED-*.png          # Análise exploratória
│   ├── PRE-PROCESS-*.png  # Pré-processamento
│   ├── IQR-*.png          # Tratamento de outliers
│   ├── NORMAL-*.png       # Normalização
│   ├── SMOTE-*.png        # Balanceamento de dados
│   ├── OTIMIZA-*.png      # Otimização de modelos
│   └── RESULT-TREINA-*.png # Resultados de treinamento
└── slides/                 # Slides individuais
    ├── slide-*.html       # Arquivos HTML dos slides
    ├── slide-*.css        # Estilos específicos por slide
    ├── slide-*-backup.html # Versões de backup
    └── slide-*-new.html   # Versões atualizadas
```
## 🔧 Desenvolvimento e Contribuição

### Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Animações, Grid, Flexbox, Custom Properties
- **JavaScript ES6+**: Classes, Modules, Async/Await
- **Responsive Design**: Mobile-first approach

### Arquitetura

- **Modular**: Cada slide é independente
- **Escalável**: Fácil adição de novos slides
- **Manutenível**: Código bem estruturado e comentado
- **Performante**: Lazy loading e otimizações

## 📈 Resultados da Pesquisa

A monografia demonstrou que:

- **Random Forest** obteve a melhor performance geral
- **SMOTE** melhorou significativamente o recall para casos positivos
- **Normalização** foi essencial para algoritmos baseados em distância
- **Otimização de hiperparâmetros** aumentou a performance em 8-12%

## 📞 Informações Adicionais

- **Repositório**: [github.com/guiozores/apresentacao-diabetes-ML](https://github.com/guiozores/apresentacao-diabetes-ML)
- **Licença**: MIT License
- **Versão**: 1.0.0
- **Compatibilidade**: Navegadores modernos (Chrome 80+, Firefox 75+, Safari 13+)

---

