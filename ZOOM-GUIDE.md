# 🔍 Sistema Universal de Zoom - Guia de Uso

## 📋 Como Usar

### 1. **Incluir o Script**

```html
<script src="../zoom-system.js"></script>
```

### 2. **Configurar a Imagem**

Adicione os atributos `data-*` na tag `<img>`:

```html
<img
  src="imagem.png"
  data-zoom-enabled="true"
  data-zoom-factor="2.5"
  data-lens-shape="circle"
  data-lens-size="120"
  data-zoom-box-size="400"
/>
```

## ⚙️ Configurações Disponíveis

| Atributo               | Valor                       | Descrição                                  |
| ---------------------- | --------------------------- | ------------------------------------------ |
| `data-zoom-enabled`    | `"true"`                    | **Obrigatório** - Ativa o zoom             |
| `data-zoom-factor`     | `"2.5"`                     | Fator de ampliação (padrão: 2.5)           |
| `data-lens-shape`      | `"circle"` ou `"rectangle"` | Formato da lente                           |
| `data-lens-size`       | `"120"`                     | Tamanho da lente circular                  |
| `data-lens-width`      | `"150"`                     | Largura da lente retangular                |
| `data-lens-height`     | `"100"`                     | Altura da lente retangular                 |
| `data-zoom-box-size`   | `"400"`                     | Tamanho da caixa de zoom quadrada          |
| `data-zoom-box-width`  | `"500"`                     | Largura da caixa de zoom                   |
| `data-zoom-box-height` | `"300"`                     | Altura da caixa de zoom                    |
| `data-auto-position`   | `"true"`                    | Reposicionamento automático (padrão: true) |

## 🎨 Exemplos de Uso

### **Zoom Circular (como Slide 36)**

```html
<img
  src="imagem.png"
  data-zoom-enabled="true"
  data-zoom-factor="2.5"
  data-lens-shape="circle"
  data-lens-size="120"
  data-zoom-box-size="400"
/>
```

### **Zoom Retangular (para Slide 39)**

```html
<img
  src="imagem.png"
  data-zoom-enabled="true"
  data-zoom-factor="3"
  data-lens-shape="rectangle"
  data-lens-width="200"
  data-lens-height="100"
  data-zoom-box-width="600"
  data-zoom-box-height="400"
/>
```

### **Zoom Pequeno e Rápido**

```html
<img
  src="imagem.png"
  data-zoom-enabled="true"
  data-zoom-factor="4"
  data-lens-size="80"
  data-zoom-box-size="300"
/>
```

### **Zoom Grande para Detalhes**

```html
<img
  src="imagem.png"
  data-zoom-enabled="true"
  data-zoom-factor="5"
  data-lens-size="150"
  data-zoom-box-width="700"
  data-zoom-box-height="500"
/>
```

## 🚀 Funcionalidades

✅ **Auto-inicialização** - Detecta automaticamente todas as imagens com `data-zoom-enabled="true"`  
✅ **Reposicionamento automático** - A caixa de zoom muda de lado automaticamente  
✅ **Múltiplas instâncias** - Pode ter várias imagens com zoom na mesma página  
✅ **Configuração flexível** - Cada imagem pode ter configurações diferentes  
✅ **CSS automatico** - Injeta estilos necessários automaticamente  
✅ **Responsivo** - Funciona em diferentes tamanhos de tela

## 🎯 Vantagens

1. **Reutilizável** - Um arquivo para todos os slides
2. **Configurável** - Personalize cada zoom via HTML
3. **Limpo** - Sem JavaScript no HTML
4. **Modular** - Fácil de manter e atualizar
5. **Flexível** - Formatos circular, retangular, quadrado
6. **Automático** - Funciona sem configuração manual

## 📝 Exemplos Prontos

- **Slide 36**: `slide-36.html` (zoom circular)
- **Slide 39**: `slide-39-exemplo.html` (zoom retangular)

## 🔧 Personalização Avançada

Para modificar cores, bordas ou animações, edite o CSS em `zoom-system.js` na função `injectCSS()`.
