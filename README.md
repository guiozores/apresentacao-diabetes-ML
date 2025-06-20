# Apresentação TCC - Além das Métricas

Apresentação moderna e minimalista para TCC sobre Machine Learning e Análise de Comportamento Preditivo para Risco de Diabetes.

## 🎯 Características

- **Design Minimalista**: Inspirado no padrão Apple Inc.
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Animações Suaves**: Transições e animações pertinentes
- **Navegação Intuitiva**: Múltiplas formas de navegar
- **Otimizado para Apresentação**: Foco no conteúdo essencial

## 🚀 Como Usar

### Navegação

- **Setas do Teclado**: ← → para navegar entre slides
- **Espaço**: Próximo slide
- **PageUp/PageDown**: Navegação por slides
- **Home/End**: Primeiro/último slide
- **ESC**: Alternar tela cheia
- **Mouse Wheel**: Navegação por scroll
- **Toque (Mobile)**: Swipe para navegar
- **Botões na Tela**: Controles visuais na parte inferior

### Estrutura dos Slides

1. **Slide 1**: Título e apresentação
2. **Slide 2**: O problema de saúde pública
3. **Slide 3**: Objetivos e justificativa
4. **Slide 4**: Tese central
5. **Slide 5**: Abordagem metodológica
6. **Slide 6**: Entendimento dos dados
7. **Slide 7**: Tratamento dos zeros
8. **Slide 8**: Pipeline de preparação
9. **Slide 9**: Modelagem
10. **Slide 10**: Avaliação
11. **Slide 11**: Resultados AED
12. **Slide 12**: Avaliação quantitativa
13. **Slide 13**: Otimização de limiar
14. **Slide 14**: Avaliação qualitativa
15. **Slide 15**: Modelo superior
16. **Slide 16**: Conclusões
17. **Slide 17**: Trabalhos futuros
18. **Slide 18**: Agradecimentos

## 📊 Inserindo Gráficos

Os slides estão preparados para receber imagens nos locais marcados como "placeholder". Para adicionar suas figuras:

1. Substitua os elementos com classe `image-placeholder` pelo código HTML da imagem:

   ```html
   <div class="chart-container">
     <img src="caminho/para/sua/figura.png" alt="Descrição da figura" />
   </div>
   ```

2. Figuras específicas mencionadas:
   - **Slide 5**: Figura 22 - Ciclo de vida da mineração de dados (CRISP-DM)
   - **Slide 11**: Figura 23 (Outcome) e Figura 30 (SkinThickness)
   - **Slide 12**: Figura 37 - Painel completo de performance
   - **Slide 13**: Figura 46 - Comparação das Matrizes de Confusão
   - **Slide 14**: Figura 47 - Análise dos 4 melhores modelos
   - **Slide 15**: Figura 47 - Random Forest em destaque

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

## 🎯 Dicas para Apresentação

1. **Teste Antecipadamente**: Abra em tela cheia antes da apresentação
2. **Navegação**: Use as setas do teclado para controle preciso
3. **Backup**: Tenha uma versão PDF como backup
4. **Gráficos**: Adicione as figuras com boa resolução
5. **Tempo**: Pratique os tempos de transição

## 📂 Estrutura de Arquivos

```
apresentacao-monografia/
├── index.html          # Arquivo principal
├── styles.css          # Estilos CSS
├── script.js           # Funcionalidades JavaScript
├── README.md           # Este arquivo
└── assets/             # Pasta para imagens (criar se necessário)
    ├── figura-22.png   # Ciclo CRISP-DM
    ├── figura-23.png   # Outcome
    ├── figura-30.png   # SkinThickness
    ├── figura-37.png   # Painel performance
    ├── figura-46.png   # Matrizes confusão
    └── figura-47.png   # Análise modelos
```

## 🌟 Próximos Passos

1. **Adicionar Figuras**: Insira as imagens nos locais apropriados
2. **Testar Navegação**: Verifique todos os controles
3. **Ajustar Conteúdo**: Modifique textos se necessário
4. **Praticar**: Ensaie a apresentação com os controles
5. **Expandir**: Adicione mais slides se necessário usando `presentationController.addSlide()`

## 🎨 Exemplos de Uso Avançado

### Adicionar Slide Dinamicamente

```javascript
// No console do navegador
presentationController.addSlide(`
    <div class="slide-content">
        <h2 class="slide-title">Novo Slide</h2>
        <p>Conteúdo do novo slide</p>
    </div>
`);
```

### Ir para Slide Específico

```javascript
// Por índice
presentationController.goToSlide(5);

// Por ID
presentationController.goToSlideById("slide-10");
```

### Informações do Slide Atual

```javascript
console.log(presentationController.getCurrentSlideInfo());
```

## 📞 Suporte

Para dúvidas sobre customização ou funcionalidades, consulte:

- Código comentado nos arquivos
- Console do navegador para debug
- Variável global `presentationController` para controle programático

---

**Boa apresentação! 🎉**
