// JavaScript para controle da apresentação
class PresentationController {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = document.querySelectorAll(".slide").length;
    this.slides = document.querySelectorAll(".slide");
    this.prevBtn = document.getElementById("prev-btn");
    this.nextBtn = document.getElementById("next-btn");
    this.slideCounter = document.getElementById("slide-counter");
    this.progressFill = document.querySelector(".progress-fill");

    this.init();
  }

  init() {
    this.updateSlideCounter();
    this.updateProgressBar();
    this.bindEvents();
    this.showSlide(0);

    // Adiciona animações aos elementos quando o slide fica ativo
    this.addSlideAnimations();
  }

  bindEvents() {
    // Navegação por botões
    this.prevBtn.addEventListener("click", () => this.previousSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());

    // Navegação por teclado
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowRight":
        case " ": // Espaço
        case "PageDown":
          e.preventDefault();
          this.nextSlide();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          this.previousSlide();
          break;
        case "Home":
          e.preventDefault();
          this.goToSlide(0);
          break;
        case "End":
          e.preventDefault();
          this.goToSlide(this.totalSlides - 1);
          break;
        case "Escape":
          e.preventDefault();
          this.toggleFullscreen();
          break;
      }
    });

    // Navegação por mouse wheel (opcional)
    let wheelTimeout;
    document.addEventListener(
      "wheel",
      (e) => {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          if (e.deltaY > 0) {
            this.nextSlide();
          } else if (e.deltaY < 0) {
            this.previousSlide();
          }
        }, 150);
      },
      { passive: true }
    );

    // Navegação por toque (mobile)
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    document.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      },
      { passive: true }
    );

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }
    };

    this.handleSwipe = handleSwipe;
  }

  showSlide(index) {
    // Remove classes ativas de todos os slides
    this.slides.forEach((slide, i) => {
      slide.classList.remove("active", "prev");
      if (i < index) {
        slide.classList.add("prev");
      }
    });

    // Adiciona classe ativa ao slide atual
    this.slides[index].classList.add("active");

    // Anima elementos do slide ativo
    this.animateSlideElements(index);

    this.currentSlide = index;
    this.updateSlideCounter();
    this.updateProgressBar();
    this.updateNavigationButtons();
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.showSlide(this.currentSlide + 1);
    }
  }

  previousSlide() {
    if (this.currentSlide > 0) {
      this.showSlide(this.currentSlide - 1);
    }
  }

  goToSlide(index) {
    if (index >= 0 && index < this.totalSlides) {
      this.showSlide(index);
    }
  }

  updateSlideCounter() {
    this.slideCounter.textContent = `${this.currentSlide + 1} / ${
      this.totalSlides
    }`;
  }

  updateProgressBar() {
    const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
    this.progressFill.style.width = `${progress}%`;
  }

  updateNavigationButtons() {
    this.prevBtn.disabled = this.currentSlide === 0;
    this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  addSlideAnimations() {
    // Adiciona animações específicas para cada tipo de slide
    this.slides.forEach((slide, index) => {
      const slideId = slide.id;

      // Animações específicas por slide
      switch (slideId) {
        case "slide-1":
          this.addTitleSlideAnimations(slide);
          break;
        case "slide-4":
          this.addThesisSlideAnimations(slide);
          break;
        case "slide-8":
          this.addPipelineAnimations(slide);
          break;
        case "slide-13":
          this.addThresholdAnimations(slide);
          break;
        case "slide-15":
          this.addSuperiorModelAnimations(slide);
          break;
        case "slide-18":
          this.addThanksAnimations(slide);
          break;
        default:
          this.addGenericSlideAnimations(slide);
      }
    });
  }

  addTitleSlideAnimations(slide) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const title = slide.querySelector(".main-title");
          const authors = slide.querySelector(".authors");
          const logo = slide.querySelector(".fatec-logo");

          setTimeout(() => {
            logo.style.animation = "fadeInUp 1s ease forwards";
          }, 200);

          setTimeout(() => {
            title.style.animation = "fadeInUp 1.2s ease forwards";
          }, 600);

          setTimeout(() => {
            authors.style.animation = "fadeInUp 1s ease forwards";
          }, 1200);
        }
      });
    });

    observer.observe(slide);
  }

  addThesisSlideAnimations(slide) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const question = slide.querySelector(".big-question");
          const comparison = slide.querySelector(".thesis-comparison");
          const subtitle = slide.querySelector(".thesis-subtitle");

          setTimeout(() => {
            question.style.animation = "fadeInUp 1s ease forwards";
          }, 300);

          setTimeout(() => {
            comparison.style.animation = "slideInRight 1s ease forwards";
          }, 800);

          setTimeout(() => {
            subtitle.style.animation = "fadeInUp 1s ease forwards";
          }, 1300);
        }
      });
    });

    observer.observe(slide);
  }

  addPipelineAnimations(slide) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const steps = slide.querySelectorAll(".step-item");

          steps.forEach((step, index) => {
            setTimeout(() => {
              step.style.animation = "slideInRight 0.8s ease forwards";
            }, index * 200);
          });
        }
      });
    });

    observer.observe(slide);
  }

  addThresholdAnimations(slide) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const thresholdChange = slide.querySelector(".threshold-change");

          setTimeout(() => {
            thresholdChange.style.animation = "pulse 2s ease infinite";
          }, 500);
        }
      });
    });

    observer.observe(slide);
  }

  addSuperiorModelAnimations(slide) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const attributes = slide.querySelectorAll(".attribute-item");

          attributes.forEach((attr, index) => {
            setTimeout(() => {
              attr.style.animation = "fadeInUp 0.8s ease forwards";
            }, index * 300);
          });
        }
      });
    });

    observer.observe(slide);
  }

  addThanksAnimations(slide) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const thanksTitle = slide.querySelector(".thanks-title");
          const questionsTitle = slide.querySelector(".questions-title");
          const contactInfo = slide.querySelector(".contact-info");

          setTimeout(() => {
            thanksTitle.style.animation = "fadeInUp 1s ease forwards";
          }, 200);

          setTimeout(() => {
            questionsTitle.style.animation = "fadeInUp 1s ease forwards";
          }, 600);

          setTimeout(() => {
            contactInfo.style.animation = "fadeInUp 1s ease forwards";
          }, 1000);
        }
      });
    });

    observer.observe(slide);
  }

  addGenericSlideAnimations(slide) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const animatableElements = slide.querySelectorAll(
            ".keyword-item, .bullet-point, .strategy-item, .info-block, " +
              ".evaluation-block, .finding-item, .conclusion-item, .future-item"
          );

          animatableElements.forEach((element, index) => {
            setTimeout(() => {
              element.style.animation = "fadeInUp 0.6s ease forwards";
            }, index * 100);
          });
        }
      });
    });

    observer.observe(slide);
  }

  animateSlideElements(slideIndex) {
    const slide = this.slides[slideIndex];

    // Reset todas as animações
    const animatedElements = slide.querySelectorAll('[style*="animation"]');
    animatedElements.forEach((el) => {
      el.style.animation = "";
    });

    // Trigger das animações específicas será feito pelos observers
  }

  // Método para adicionar slides dinamicamente (para futuras expansões)
  addSlide(slideHTML, position = -1) {
    const slideElement = document.createElement("section");
    slideElement.className = "slide";
    slideElement.innerHTML = slideHTML;

    const container = document.querySelector(".presentation-container");

    if (position === -1 || position >= this.totalSlides) {
      container.appendChild(slideElement);
    } else {
      const referenceSlide = this.slides[position];
      container.insertBefore(slideElement, referenceSlide);
    }

    this.slides = document.querySelectorAll(".slide");
    this.totalSlides = this.slides.length;
    this.updateSlideCounter();
    this.updateProgressBar();
  }

  // Método para ir para um slide específico por ID
  goToSlideById(slideId) {
    const slideIndex = Array.from(this.slides).findIndex(
      (slide) => slide.id === slideId
    );
    if (slideIndex !== -1) {
      this.goToSlide(slideIndex);
    }
  }

  // Método para obter informações do slide atual
  getCurrentSlideInfo() {
    return {
      index: this.currentSlide,
      id: this.slides[this.currentSlide].id,
      title:
        this.slides[this.currentSlide].querySelector(".slide-title")
          ?.textContent ||
        this.slides[this.currentSlide].querySelector(".main-title")
          ?.textContent ||
        "Slide sem título",
    };
  }
}

// Inicializar a apresentação quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  const presentation = new PresentationController();

  // Tornar o controlador globalmente acessível para debug/controle externo
  window.presentationController = presentation;

  // Adicionar dicas de navegação
  const addNavigationHints = () => {
    console.log("🎯 Dicas de Navegação:");
    console.log("• Use as setas ← → para navegar");
    console.log("• Pressione Espaço para próximo slide");
    console.log("• Use PageUp/PageDown para navegação");
    console.log("• Home/End para ir ao primeiro/último slide");
    console.log("• ESC para alternar tela cheia");
    console.log("• Mouse wheel para navegação");
    console.log("• Swipe no mobile");
    console.log("• presentationController disponível no console");
  };

  addNavigationHints();
});

// Prevenir zoom acidental no mobile
document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});

document.addEventListener("gesturechange", function (e) {
  e.preventDefault();
});

document.addEventListener("gestureend", function (e) {
  e.preventDefault();
});

// Prevenir contexto menu no clique direito para uma experiência mais limpa
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// Adicionar classe para indicar quando está em fullscreen
document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    document.body.classList.add("fullscreen");
  } else {
    document.body.classList.remove("fullscreen");
  }
});

// Otimização de performance para animações
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);
if (prefersReducedMotion.matches) {
  document.documentElement.style.setProperty("--transition-duration", "0s");
}
