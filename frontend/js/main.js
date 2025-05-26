// =============================================
// 1. Módulo de Menú Móvil
// =============================================
const MobileMenu = (() => {
  const toggleMenu = () => {
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document
      .getElementById("mobile-menu-toggle")
      .querySelector("svg");
    mobileMenu.classList.toggle("hidden");
    menuIcon.innerHTML = mobileMenu.classList.contains("hidden")
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>`;
  };

  const init = () => {
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener("click", toggleMenu);
    }
  };

  return { init };
})();

// =============================================
// 2. Módulo de Pantalla Completa
// =============================================
const Fullscreen = (() => {
  const toggleFullscreen = () => {
    const fullscreenIcon = document.getElementById("fullscreen-icon");
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()?.then(() => {
        fullscreenIcon?.classList.replace("fa-expand", "fa-compress");
      });
    } else {
      document.exitFullscreen()?.then(() => {
        fullscreenIcon?.classList.replace("fa-compress", "fa-expand");
      });
    }
  };

  const init = () => {
    const fullscreenToggle = document.getElementById("fullscreen-toggle");
    if (fullscreenToggle) {
      fullscreenToggle.addEventListener("click", toggleFullscreen);
    }
  };

  return { init };
})();

// =============================================
// 3. Módulo de Acordeón (Preguntas Frecuentes)
// =============================================
const Accordion = (() => {
  const init = () => {
    const toggles = document.querySelectorAll(".accordion-toggle");
    const contents = document.querySelectorAll(".accordion-content");
    
    // Abrir el primer elemento por defecto
    if (contents.length > 0) {
      contents[0].style.maxHeight = contents[0].scrollHeight + "px";
      toggles[0].querySelector("svg").classList.add("rotate-180");
    }

    toggles.forEach((toggle, index) => {
      toggle.addEventListener("click", () => {
        const content = contents[index];
        const isOpen = content.style.maxHeight;
        
        // Cerrar otros acordeones
        contents.forEach((otherContent, otherIndex) => {
          if (index !== otherIndex) {
            otherContent.style.maxHeight = null;
            toggles[otherIndex].querySelector("svg").classList.remove("rotate-180");
          }
        });

        // Alternar el actual
        if (isOpen) {
          content.style.maxHeight = null;
          toggle.querySelector("svg").classList.remove("rotate-180");
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
          toggle.querySelector("svg").classList.add("rotate-180");
        }
      });
    });
  };

  return { init };
})();

// =============================================
// 4. Módulo de Botón "Ir Arriba"
// =============================================
const ScrollToTop = (() => {
  const handleScroll = () => {
    const goTopBtn = document.getElementById("goTopBtn");
    if (!goTopBtn) return;

    if (window.scrollY > 100) {
      goTopBtn.classList.remove("translate-y-20", "opacity-0");
      goTopBtn.classList.add("translate-y-0", "opacity-100");
    } else {
      goTopBtn.classList.add("translate-y-20", "opacity-0");
      goTopBtn.classList.remove("translate-y-0", "opacity-100");
    }
  };

  const init = () => {
    window.addEventListener("scroll", handleScroll);
    document.getElementById("goTopBtn")?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  return { init };
})();

// =============================================
// 5. Módulo de Accesibilidad
// =============================================
const Accessibility = (() => {
  // Configuración de zoom
  let currentZoom = 100;
  const zoomStep = 10;
  const minZoom = 50;
  const maxZoom = 200;

  // Configuración de fuente
  const fonts = ["Quicksand", "Arial", "Verdana", "Georgia", "Times New Roman", "Courier New"];
  let currentFontIndex = 0;

  // Configuración de tamaño de fuente
  let currentFontSize = 100;
  const fontSizeStep = 10;
  const minFontSize = 80;
  const maxFontSize = 200;

  // Funciones de zoom
  const changeZoom = (direction) => {
    currentZoom = direction === "in" 
      ? Math.min(currentZoom + zoomStep, maxZoom)
      : Math.max(currentZoom - zoomStep, minZoom);
    document.body.style.zoom = `${currentZoom}%`;
  };

  const resetZoom = () => {
    currentZoom = 100;
    document.body.style.zoom = "100%";
  };

  // Funciones de fuente
  const changeFont = () => {
    currentFontIndex = (currentFontIndex + 1) % fonts.length;
    const newFont = fonts[currentFontIndex];
    document.body.style.fontFamily = newFont;
    updateFontDisplay(newFont);
    localStorage.setItem("selectedFont", newFont);
  };

  const updateFontDisplay = (fontName) => {
    document.querySelector(".current-font-name")?.textContent = fontName;
  };

  // Funciones de tamaño de fuente
  const changeFontSize = (action) => {
    if (action === "increase" && currentFontSize < maxFontSize) {
      currentFontSize += fontSizeStep;
    } else if (action === "decrease" && currentFontSize > minFontSize) {
      currentFontSize -= fontSizeStep;
    }
    document.body.style.fontSize = `${currentFontSize}%`;
  };

  const resetFontSize = () => {
    currentFontSize = 100;
    document.body.style.fontSize = "100%";
  };

  // Text-to-speech
  const toggleTextToSpeech = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }
    const text = document.body.innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
  };

  // Dropdown
  const initDropdown = () => {
    const button = document.getElementById("dropdownDefaultButton");
    const dropdown = document.getElementById("dropdown");
    
    if (button && dropdown) {
      button.addEventListener("click", () => {
        dropdown.classList.toggle("show");
      });

      document.addEventListener("click", (event) => {
        if (!button.contains(event.target) && !dropdown.contains(event.target)) {
          dropdown.classList.remove("show");
        }
      });
    }
  };

  // Inicialización
  const init = () => {
    initDropdown();
    
    // Aplicar fuente guardada
    const savedFont = localStorage.getItem("selectedFont");
    if (savedFont) {
      document.body.style.fontFamily = savedFont;
      currentFontIndex = fonts.indexOf(savedFont);
      if (currentFontIndex === -1) currentFontIndex = 0;
      updateFontDisplay(savedFont);
    } else {
      updateFontDisplay(fonts[0]);
    }
  };

  return { 
    init,
    changeZoom,
    resetZoom,
    changeFont,
    changeFontSize,
    resetFontSize,
    toggleTextToSpeech
  };
})();

// =============================================
// 6. Módulo de Efectos Visuales
// =============================================
const VisualEffects = (() => {
  const initLightEffect = () => {
    const container = document.querySelector(".light-container");
    const light = document.querySelector(".light-follow");

    if (!container || !light) return;

    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      light.style.left = `${e.clientX - rect.left}px`;
      light.style.top = `${e.clientY - rect.top}px`;
      light.style.opacity = "1";
    });

    container.addEventListener("mouseleave", () => {
      light.style.opacity = "0";
    });
  };

  const init = () => {
    initLightEffect();
  };

  return { init };
})();

// =============================================
// 7. Módulo de Galería
// =============================================
const Gallery = (() => {
  const getAllImages = () => [
    // Patio
    { src: "static/img/patio_1.jpeg", category: "escuela" },
    { src: "static/img/patio_2.jpeg", category: "escuela" },
    // ... más imágenes
  ].sort(() => Math.random() - 0.5);

  const createMasonryGallery = (images = getAllImages()) => {
    const gallery = document.getElementById("gallery-grid");
    if (!gallery) return;

    gallery.classList.add("transition-all", "duration-500", "ease-in-out");
    gallery.style.opacity = "0";

    setTimeout(() => {
      gallery.innerHTML = "";
      gallery.className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-all duration-500 ease-in-out";

      images.forEach((image, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "gallery-item relative group overflow-hidden rounded-lg transform transition-all duration-500 ease-in-out opacity-0 scale-95";
        itemDiv.setAttribute("data-category", image.category);

        const img = document.createElement("img");
        img.src = image.src;
        img.alt = `Imagen ${index + 1}`;
        img.className = "w-full h-48 md:h-64 object-cover transition-transform duration-300 group-hover:scale-110";

        itemDiv.appendChild(img);
        gallery.appendChild(itemDiv);

        setTimeout(() => {
          itemDiv.classList.remove("opacity-0", "scale-95");
          itemDiv.classList.add("opacity-100", "scale-100");
        }, index * 100);
      });

      gallery.style.opacity = "1";
    }, 300);
  };

  const setupFilterButtons = () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const allImages = getAllImages();

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        filterButtons.forEach((btn) => {
          btn.classList.remove("text-blue-700", "bg-blue-700", "text-white");
          btn.classList.add("text-gray-900", "bg-white");
        });

        button.classList.remove("text-gray-900", "bg-white");
        button.classList.add("text-blue-700", "bg-blue-700", "text-white");

        filter === "all" 
          ? createMasonryGallery()
          : createMasonryGallery(allImages.filter(img => img.category === filter));
      });
    });
  };

  const init = () => {
    createMasonryGallery();
    setupFilterButtons();
  };

  return { init };
})();

// =============================================
// 8. Módulo de Testimonios
// =============================================
const Testimonials = (() => {
  const API_URL = "https://aly-mbelleza-backend.onrender.com";
  let testimonialSwiper = null;

  const formatImageUrl = (url) => {
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const initSwiper = () => {
    if (typeof Swiper === "undefined") {
      console.error("Swiper no está disponible");
      return;
    }

    if (testimonialSwiper) testimonialSwiper.destroy(true, true);

    testimonialSwiper = new Swiper(".testimonials-swiper", {
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      breakpoints: {
        640: { slidesPerView: 1, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 30 },
        1024: { slidesPerView: 3, spaceBetween: 40 },
      },
    });
  };

  const loadTestimonials = async () => {
    try {
      const response = await fetch(`${API_URL}/api/testimonials`);
      if (!response.ok) throw new Error(`Error HTTP ${response.status}`);

      const { data: testimonials } = await response.json();
      const swiperWrapper = document.querySelector(".testimonials-swiper .swiper-wrapper");
      if (!swiperWrapper) throw new Error("No se encontró el contenedor de testimonios");

      swiperWrapper.innerHTML = testimonials.length === 0
        ? `<div class="swiper-slide flex items-center justify-center h-full w-full">
            <div class="text-center p-8 max-w-sm mx-auto">
              <div class="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 p-4 mb-4">
                <svg class="h-10 w-10 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No hay testimonios aún</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">Parece que nadie ha compartido su experiencia todavía.</p>
            </div>
          </div>`
        : testimonials.map(testimonial => `
            <div class="swiper-slide">
              <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                <div class="relative flex-grow">
                  <svg class="absolute -top-4 -left-4 h-8 w-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.999v10h-9.999z"/>
                  </svg>
                  <br>
                  <p class="text-gray-600 italic mb-8">"${testimonial.comment}"</p>
                </div>
                <div class="flex items-center mt-auto">
                  <img src="${formatImageUrl(testimonial.avatar)}" 
                     alt="${testimonial.name}" 
                     class="h-12 w-12 rounded-full object-cover"
                     onerror="this.onerror=null;this.src='https://us.123rf.com/450wm/thesomeday123/thesomeday1231712/thesomeday123171200009/91087331-icono-de-perfil-de-avatar-predeterminado-para-hombre-marcador-de-posici%C3%B3n-de-foto-gris-vector-de.jpg?ver=6'">
                  <div class="ml-4">
                    <h4 class="font-semibold text-gray-900">${testimonial.name}</h4>
                    <p class="text-gray-500 text-sm">${testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          `).join("");

      initSwiper();
    } catch (error) {
      console.error("Error al cargar testimonios:", error);
      document.querySelector(".testimonials-swiper .swiper-wrapper").innerHTML = `
        <div class="swiper-slide">
          <div class="testimonial-card text-center p-4 text-red-500">
            <p>Error al cargar testimonios.</p>
            <p class="text-sm">${error.message}</p>
          </div>
        </div>
      `;
    }
  };

  const initModal = () => {
    const modal = document.getElementById("testimonialModal");
    const form = document.getElementById("testimonialForm");

    if (!modal || !form) return;

    document.getElementById("openTestimonialModal")?.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });

    document.getElementById("closeTestimonialModal")?.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";

        const formData = new FormData(form);
        const response = await fetch(`${API_URL}/api/testimonials`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Error al enviar testimonio");
        }

        modal.classList.add("hidden");
        form.reset();
        setTimeout(loadTestimonials, 500);
        showNotification("success", "¡Éxito!", "Testimonio agregado correctamente");
      } catch (error) {
        showNotification("error", "Error", error.message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });

    // Mostrar nombre del archivo seleccionado
    document.getElementById("avatar")?.addEventListener("change", function(e) {
      document.getElementById("file-name").textContent = e.target.files[0]?.name || "Seleccionar imagen";
    });
  };

  const init = () => {
    // Cargar Swiper si no está disponible
    if (typeof Swiper === "undefined") {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/swiper@8/swiper-bundle.min.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/swiper@8/swiper-bundle.min.js";
      script.onload = () => {
        loadTestimonials();
        initModal();
      };
      document.head.appendChild(script);
    } else {
      loadTestimonials();
      initModal();
    }
  };

  return { init };
})();

// =============================================
// 9. Módulo de Formulario de Contacto
// =============================================
const ContactForm = (() => {
  const showNotification = (type, title, message) => {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg text-white ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } z-50`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const init = () => {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
          </span>
        `;

        const response = await fetch("https://aly-mbelleza-backend.onrender.com/api/send-email", {
          method: "POST",
          body: new FormData(form),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Error: ${response.status}`);
        }

        showNotification("success", "¡Mensaje enviado!", "Gracias por contactarnos. Te responderemos pronto.");
        form.reset();
      } catch (error) {
        showNotification("error", "Error", error.message.includes("Failed to fetch")
          ? "No se pudo conectar con el servidor. Intenta más tarde."
          : error.message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  };

  return { init };
})();

// =============================================
// 10. Módulo de Cookies
// =============================================
const CookieConsent = (() => {
  const init = () => {
    const cookieConsent = document.getElementById("cookies-consent");
    const cookieCard = document.getElementById("cookie-card");
    if (!cookieConsent || !cookieCard) return;

    setTimeout(() => {
      cookieConsent.style.display = "block";
      cookieCard.classList.add("animate-slide-in-bottom");
    }, 1000);

    const closeCookieConsent = () => {
      cookieCard.classList.remove("animate-slide-in-bottom");
      cookieCard.classList.add("animate-slide-out-bottom");
      setTimeout(() => {
        cookieConsent.style.display = "none";
      }, 500);
    };

    ["close-btn", "accept-all", "reject-all", "manage-cookies"].forEach(id => {
      document.getElementById(id)?.addEventListener("click", closeCookieConsent);
    });
  };

  return { init };
})();

// =============================================
// Inicialización de todos los módulos
// =============================================
document.addEventListener("DOMContentLoaded", () => {
  MobileMenu.init();
  Fullscreen.init();
  Accordion.init();
  ScrollToTop.init();
  Accessibility.init();
  VisualEffects.init();
  Gallery.init();
  Testimonials.init();
  ContactForm.init();
});

window.addEventListener("load", CookieConsent.init);