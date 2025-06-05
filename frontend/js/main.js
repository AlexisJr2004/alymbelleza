//Script para el menú del celular
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document
    .getElementById("mobile-menu-toggle")
    .querySelector("svg");
  mobileMenu.classList.toggle("hidden");
  if (!mobileMenu.classList.contains("hidden")) {
    menuIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        `;
  } else {
    menuIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
        `;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);
  }
});

// Función para mostrar/ocultar el submenú de servicios
function toggleServicesMenu() {
  const submenu = document.getElementById("services-submenu");
  submenu.classList.toggle("hidden");
}

// Cargar datos del usuario
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userProfileSection = document.getElementById(
    "mobile-user-profile-section"
  );
  const loginSection = document.getElementById("mobile-login-section");
  const profileImg = document.getElementById("mobile-profile-img");
  const profileName = document.getElementById("mobile-profile-name");
  const profileEmail = document.getElementById("mobile-profile-email");
  const profileRole = document.getElementById("mobile-profile-role");
  const statusIndicator = document.getElementById("mobile-status-indicator");
  const logoutBtn = document.getElementById("mobile-logout-btn");
  const adminLinkContainer = document.getElementById(
    "mobile-admin-link-container"
  );

  if (user) {
    // Mostrar sección de perfil y ocultar login
    userProfileSection.classList.remove("hidden");
    loginSection.classList.add("hidden");

    // Configurar datos del usuario
    profileName.textContent = user.name || "Usuario";
    profileEmail.textContent = user.email || "";

    // Establecer rol y color del indicador
    if (user.role === "admin") {
      profileRole.textContent = "Administrador";
      statusIndicator.classList.remove("bg-green-500");
      statusIndicator.classList.add("bg-purple-500");
      adminLinkContainer.classList.remove("hidden");
    } else {
      profileRole.textContent = "Cliente";
    }

    // Imagen de perfil
    const profileImageUrl =
      user.profileImage && user.profileImage.startsWith("http")
        ? user.profileImage
        : user.profileImage && user.profileImage.startsWith("/uploads/")
        ? "https://aly-mbelleza-backend.onrender.com" + user.profileImage
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name || "U"
          )}&background=random&length=1`;

    profileImg.src = profileImageUrl;

    // Logout con SweetAlert
    logoutBtn.addEventListener("click", () => {
      Swal.fire({
        title: "¿Cerrar sesión?",
        text: "¿Estás seguro de que deseas salir de tu cuenta?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#7e22ce",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Sí, cerrar sesión",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("user");
          window.location.href = "index.html";
        }
      });
    });
  } else {
    // Mostrar sección de login y ocultar perfil
    loginSection.classList.remove("hidden");
    userProfileSection.classList.add("hidden");
  }
});

//Script para el botón de la pantalla completa
document.addEventListener("DOMContentLoaded", () => {
  const fullscreenToggle = document.getElementById("fullscreen-toggle");
  const fullscreenIcon = document.getElementById("fullscreen-icon");
  fullscreenToggle.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
        fullscreenIcon.classList.replace("fa-expand", "fa-compress");
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        fullscreenIcon.classList.replace("fa-compress", "fa-expand");
      }
    }
  });
});

//Script para la seccion de preguntas
document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".accordion-toggle");
  const contents = document.querySelectorAll(".accordion-content");
  contents[0].style.maxHeight = contents[0].scrollHeight + "px";
  toggles[0].querySelector("svg").classList.add("rotate-180");

  toggles.forEach((toggle, index) => {
    toggle.addEventListener("click", () => {
      const content = contents[index];
      const isOpen = content.style.maxHeight;
      contents.forEach((otherContent, otherIndex) => {
        if (index !== otherIndex) {
          otherContent.style.maxHeight = null;
          toggles[otherIndex]
            .querySelector("svg")
            .classList.remove("rotate-180");
        }
      });
      if (isOpen) {
        content.style.maxHeight = null;
        toggle.querySelector("svg").classList.remove("rotate-180");
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        toggle.querySelector("svg").classList.add("rotate-180");
      }
    });
  });
});

//Script para el botón ir arriba
document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("scroll", function () {
    var goTopBtn = document.getElementById("goTopBtn");
    if (window.scrollY > 100) {
      goTopBtn.classList.remove("translate-y-20");
      goTopBtn.classList.remove("opacity-0");
      goTopBtn.classList.add("translate-y-0");
      goTopBtn.classList.add("opacity-100");
    } else {
      goTopBtn.classList.add("translate-y-20");
      goTopBtn.classList.add("opacity-0");
      goTopBtn.classList.remove("translate-y-0");
      goTopBtn.classList.remove("opacity-100");
    }
  });

  document.getElementById("goTopBtn").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

//Script para el boón de accesibilidad
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);
  }
});
const button = document.getElementById("dropdownDefaultButton");
const dropdown = document.getElementById("dropdown");
button.addEventListener("click", () => {
  dropdown.classList.toggle("show");
});
document.addEventListener("click", (event) => {
  if (!button.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});

// Funciones para controlar el zoom
let currentZoom = 100;
function changeZoom(direction) {
  if (direction === "in") {
    currentZoom += 10;
  } else if (direction === "out") {
    currentZoom -= 10;
  }
  currentZoom = Math.max(50, Math.min(currentZoom, 200));
  document.body.style.zoom = `${currentZoom}%`;
}
function resetZoom() {
  currentZoom = 100;
  document.body.style.zoom = "100%";
}

// Script y Array de fuentes disponibles, incluyendo la fuente por defecto
const fonts = [
  "Quicksand",
  "Arial",
  "Verdana",
  "Georgia",
  "Times New Roman",
  "Courier New",
];
let currentFontIndex = 0;
function changeFont() {
  currentFontIndex = (currentFontIndex + 1) % fonts.length;
  const newFont = fonts[currentFontIndex];
  document.body.style.fontFamily = newFont;
  updateFontDisplay(newFont);
  localStorage.setItem("selectedFont", newFont);
}
function updateFontDisplay(fontName) {
  const fontDisplay = document.querySelector(".current-font-name");
  if (fontDisplay) {
    fontDisplay.textContent = fontName;
  }
}
// Al cargar la página, aplicar la fuente guardada si existe
document.addEventListener("DOMContentLoaded", function () {
  const savedFont = localStorage.getItem("selectedFont");
  if (savedFont) {
    document.body.style.fontFamily = savedFont;
    currentFontIndex = fonts.indexOf(savedFont);
    if (currentFontIndex === -1) currentFontIndex = 0;
    updateFontDisplay(savedFont);
  } else {
    updateFontDisplay(fonts[0]);
  }
});

// Script para la lectura de pantalla
function toggleTextToSpeech() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    return;
  }
  const text = document.body.innerText;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  window.speechSynthesis.speak(utterance);
}

// Variables para el ajuste de tamaño de fuente
let currentFontSize = 100;
const fontSizeStep = 10;
const minFontSize = 80;
const maxFontSize = 200;

// Función para cambiar el tamaño de la fuente
function changeFontSize(action) {
  if (action === "increase" && currentFontSize < maxFontSize) {
    currentFontSize += fontSizeStep;
  } else if (action === "decrease" && currentFontSize > minFontSize) {
    currentFontSize -= fontSizeStep;
  }
  document.body.style.fontSize = `${currentFontSize}%`;
}

// Función para resetear el tamaño de la fuente
function resetFontSize() {
  currentFontSize = 100;
  document.body.style.fontSize = "100%";
}

//Script para el efecto de luz en la seccion
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".light-container");
  const light = document.querySelector(".light-follow");

  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    light.style.left = `${x}px`;
    light.style.top = `${y}px`;
    light.style.opacity = "1";
  });

  container.addEventListener("mouseleave", () => {
    light.style.opacity = "0";
  });
});

// Función para obtener todas las imágenes del sitio con categorías
function getAllImages() {
  return [
    // Patio
    { src: "static/img/patio_1.jpeg", category: "escuela" },
    { src: "static/img/patio_2.jpeg", category: "escuela" },
    { src: "static/img/patio_3.jpeg", category: "escuela" },
    { src: "static/img/patio_4.jpeg", category: "escuela" },
    { src: "static/img/patio_5.jpeg", category: "escuela" },
    { src: "static/img/patio_6.jpeg", category: "escuela" },
    { src: "static/img/patio_7.jpeg", category: "escuela" },

    // Especialidades
    { src: "static/img/especialidad_1.jpeg", category: "especialidades" },
    { src: "static/img/especialidad_2.jpeg", category: "especialidades" },
    { src: "static/img/especialidad_3.jpeg", category: "especialidades" },

    // Viajes Escolares
    { src: "static/img/viaje_1.jpeg", category: "viajes-escolares" },
    { src: "static/img/viaje_2.jpeg", category: "viajes-escolares" },
    { src: "static/img/viaje_3.jpeg", category: "viajes-escolares" },
    { src: "static/img/viaje_4.jpeg", category: "viajes-escolares" },
    { src: "static/img/viaje_5.jpeg", category: "viajes-escolares" },
    { src: "static/img/viaje_6.jpeg", category: "viajes-escolares" },
    { src: "static/img/viaje_7.jpeg", category: "viajes-escolares" },
    { src: "static/img/viaje_8.jpeg", category: "viajes-escolares" },
    { src: "static/img/viaje_9.jpeg", category: "viajes-escolares" },

    // Deportes
    { src: "static/img/evento_1.jpeg", category: "eventos" },
    { src: "static/img/evento_2.jpeg", category: "eventos" },
    { src: "static/img/evento_3.jpeg", category: "eventos" },
    { src: "static/img/evento_4.jpeg", category: "eventos" },
    { src: "static/img/evento_5.jpeg", category: "eventos" },
    { src: "static/img/evento_6.jpeg", category: "eventos" },
    { src: "static/img/evento_7.jpeg", category: "eventos" },
    { src: "static/img/evento_8.jpeg", category: "eventos" },
  ].sort(() => Math.random() - 0.5);
}

function toggleServicesMenu() {
  const submenu = document.getElementById("services-submenu");
  submenu.classList.toggle("hidden");
}

// Función para crear un diseño de galería con animación
function createMasonryGallery(images = getAllImages()) {
  const gallery = document.getElementById("gallery-grid");

  // Añadir clases de transición
  gallery.classList.add("transition-all", "duration-500", "ease-in-out");

  // Limpiar la galería actual con animación de desvanecimiento
  gallery.style.opacity = "0";

  // Usar setTimeout para crear efecto de transición
  setTimeout(() => {
    // Limpiar contenido
    gallery.innerHTML = "";

    // Modificar clases para un diseño más dinámico
    gallery.className =
      "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-all duration-500 ease-in-out";

    images.forEach((image, index) => {
      // Crear contenedor para cada imagen con animación de entrada
      const itemDiv = document.createElement("div");
      itemDiv.className =
        "gallery-item relative group overflow-hidden rounded-lg transform transition-all duration-500 ease-in-out opacity-0 scale-95";
      itemDiv.setAttribute("data-category", image.category);

      // Crear imagen
      const img = document.createElement("img");
      img.src = image.src;
      img.alt = `Imagen ${index + 1}`;
      img.className =
        "w-full h-48 md:h-64 object-cover transition-transform duration-300 group-hover:scale-110";

      // Agregar imagen al contenedor
      itemDiv.appendChild(img);

      // Agregar contenedor a la galería
      gallery.appendChild(itemDiv);

      // Pequeño retraso para animación de entrada
      setTimeout(() => {
        itemDiv.classList.remove("opacity-0", "scale-95");
        itemDiv.classList.add("opacity-100", "scale-100");
      }, index * 100);
    });

    // Mostrar galería
    gallery.style.opacity = "1";
  }, 300);
}

// Función de filtrado
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const allImages = getAllImages();

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      // Restablecer estilos de botones
      filterButtons.forEach((btn) => {
        btn.classList.remove("text-blue-700", "bg-blue-700", "text-white");
        btn.classList.add("text-gray-900", "bg-white");
      });

      // Aplicar estilo al botón seleccionado
      button.classList.remove("text-gray-900", "bg-white");
      button.classList.add("text-blue-700", "bg-blue-700", "text-white");

      // Filtrar imágenes
      if (filter === "all") {
        createMasonryGallery(); // Mostrar todas las imágenes
      } else {
        const filteredImages = allImages.filter(
          (image) => image.category === filter
        );
        createMasonryGallery(filteredImages);
      }
    });
  });
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  createMasonryGallery();
  setupFilterButtons();
});

// Añadir estilos adicionales para transiciones suaves
const style = document.createElement("style");
style.textContent = `
  .gallery-item {
      transition: all 0.5s ease-in-out;
  }
`;
document.head.appendChild(style);

// Configuración global
const API_URL = "https://aly-mbelleza-backend.onrender.com";
let testimonialSwiper = null;

// Función para formatear la URL de la imagen
function formatImageUrl(url) {
  // Si ya es una URL completa, devolverla tal cual
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Si es una ruta relativa, construir la URL completa
  const baseUrl = window.location.origin; // O usa tu dominio específico
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

// Función para inicializar Swiper
const initTestimonialSwiper = () => {
  if (typeof Swiper === "undefined") {
    console.error("Swiper no está disponible");
    return;
  }

  // Destruir instancia anterior si existe
  if (testimonialSwiper) {
    testimonialSwiper.destroy(true, true);
  }

  // Crear nueva instancia
  testimonialSwiper = new Swiper(".testimonials-swiper", {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: { slidesPerView: 1, spaceBetween: 20 },
      768: { slidesPerView: 2, spaceBetween: 30 },
      1024: { slidesPerView: 3, spaceBetween: 40 },
    },
  });
};

// Función para cargar testimonios
const loadTestimonials = async () => {
  try {
    console.log("Cargando testimonios...");

    const response = await fetch(`${API_URL}/api/testimonials`);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const { data: testimonials } = await response.json();
    console.log("Testimonios recibidos:", testimonials);

    const swiperWrapper = document.querySelector(
      ".testimonials-swiper .swiper-wrapper"
    );
    if (!swiperWrapper) {
      throw new Error("No se encontró el contenedor de testimonios");
    }

    // Limpiar contenedor
    swiperWrapper.innerHTML = "";

    if (testimonials.length === 0) {
      // Mensaje completamente centrado (vertical y horizontalmente)
      swiperWrapper.innerHTML = `
        <div class="swiper-slide flex items-center justify-center h-full w-full">
          <div class="text-center p-8 max-w-sm mx-auto">
            <div class="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 p-4 mb-4">
              <svg class="h-10 w-10 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No hay testimonios aún</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Parece que nadie ha compartido su experiencia todavía.</p>
          </div>
        </div>
      `;
    } else {
      testimonials.forEach((testimonial) => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        slide.innerHTML = `
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
        `;
        swiperWrapper.appendChild(slide);
      });
    }

    // Inicializar o actualizar Swiper
    initTestimonialSwiper();

    console.log("Testimonios cargados y mostrados correctamente");
  } catch (error) {
    console.error("Error al cargar testimonios:", error);

    const swiperWrapper = document.querySelector(
      ".testimonials-swiper .swiper-wrapper"
    );
    if (swiperWrapper) {
      swiperWrapper.innerHTML = `
        <div class="swiper-slide">
          <div class="testimonial-card text-center p-4 text-red-500">
            <p>Error al cargar testimonios.</p>
            <p class="text-sm">${error.message}</p>
          </div>
        </div>
      `;
    }
  }
};

// Cargar testimonios cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Cargar CSS de Swiper si no está presente
  if (!document.querySelector('link[href*="swiper-bundle.min.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/swiper@8/swiper-bundle.min.css";
    document.head.appendChild(link);
  }

  // Cargar Swiper JS si no está disponible
  if (typeof Swiper === "undefined") {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/swiper@8/swiper-bundle.min.js";
    script.onload = loadTestimonials;
    document.head.appendChild(script);
  } else {
    loadTestimonials();
  }
});

// Manejo del modal (tu código existente sigue igual)
const testimonialModal = document.getElementById("testimonialModal");
const openModalBtn = document.getElementById("openTestimonialModal");
const closeModalBtn = document.getElementById("closeTestimonialModal");
const testimonialForm = document.getElementById("testimonialForm");

// Reemplazamos este bloque por uno con validación de sesión
if (openModalBtn) {
  openModalBtn.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para dejar un testimonio.",
        confirmButtonColor: "#7e22ce",
      });
      return;
    }
    if (testimonialModal) {
      testimonialModal.classList.remove("hidden");
    }
  });
}

if (closeModalBtn && testimonialModal) {
  closeModalBtn.addEventListener("click", () => {
    testimonialModal.classList.add("hidden");
  });
}

if (testimonialForm) {
  testimonialForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const submitBtn = testimonialForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";

      const formData = new FormData(testimonialForm);

      // Tomar datos del usuario logueado
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        showNotification(
          "Debes iniciar sesión para dejar un testimonio.",
          "error"
        );
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        return;
      }

      formData.append("name", user.name);
      formData.append("avatar", user.profileImage);

      const response = await fetch(
        "https://aly-mbelleza-backend.onrender.com/api/testimonials",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        let errorMessage = "Error al enviar testimonio";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          const text = await response.text();
          if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json().catch(() => ({}));

      testimonialModal.classList.add("hidden");
      testimonialForm.reset();

      setTimeout(loadTestimonials, 500);

      showNotification(
        "success",
        "¡Éxito!",
        result.message || "Testimonio agregado correctamente"
      );
    } catch (error) {
      console.error("Error en el envío:", error);
      showNotification(
        "error",
        "Error",
        typeof error === "object" ? error.message : "Error al enviar testimonio"
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}

// Función para mostrar notificaciones
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg text-white ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  } z-50 transition-all duration-300 transform translate-x-0`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("translate-x-full");
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Cargar testimonios al iniciar y asegurar que Swiper esté cargado
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si Swiper está disponible
  if (typeof Swiper === "undefined") {
    console.warn("Swiper no está cargado. Cargando ahora...");
    loadSwiperScript().then(loadTestimonials);
  } else {
    loadTestimonials();
  }
});

// Función para cargar Swiper dinámicamente si es necesario
function loadSwiperScript() {
  return new Promise((resolve) => {
    if (typeof Swiper !== "undefined") return resolve();

    const script = document.createElement("script");
    script.src = "https://unpkg.com/swiper/swiper-bundle.min.js";
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

document.getElementById("avatar").addEventListener("change", function (event) {
  const file = event.target.files[0]; // Obtener el archivo seleccionado
  if (file) {
    const reader = new FileReader(); // Crear un FileReader para leer el archivo
    reader.onload = function (e) {
      // Mostrar la imagen en un elemento <img> (opcional)
      const imgPreview = document.createElement("img");
      imgPreview.src = e.target.result;
      imgPreview.classList.add(
        "w-24",
        "h-24",
        "rounded-full",
        "mx-auto",
        "mb-4",
        "shadow-md"
      );
      document
        .getElementById("avatar")
        .insertAdjacentElement("afterend", imgPreview);
    };
    reader.readAsDataURL(file); // Leer el archivo como una URL de datos
  }
});

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;

  try {
    // Estado de carga
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

    // Crear FormData directamente del formulario
    const formData = new FormData(form);

    // Convertir a objeto simple para logging
    const formDataObj = Object.fromEntries(formData.entries());
    console.log("Datos del formulario:", formDataObj);

    const backendUrl =
      "https://aly-mbelleza-backend.onrender.com/api/send-email";

    const response = await fetch(backendUrl, {
      method: "POST",
      body: formData, // Enviamos FormData directamente
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error del servidor:", errorData);
      throw new Error(errorData.error || `Error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Respuesta exitosa:", result);

    showNotification(
      "success",
      "¡Mensaje enviado!",
      "Gracias por contactarnos. Te responderemos pronto."
    );

    form.reset();
  } catch (error) {
    console.error("Error en el envío:", error);
    showNotification(
      "error",
      "Error",
      error.message.includes("Failed to fetch")
        ? "No se pudo conectar con el servidor. Intenta más tarde."
        : error.message
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
});

function showNotification(type, title, message) {
  // Crear el contenedor de la notificación
  const notification = document.createElement("div");
  notification.className = `notification ${
    type === "success"
      ? "bg-teal-50 border-teal-500"
      : "bg-red-50 border-red-500"
  } border-t-2 rounded-lg p-4`;
  notification.setAttribute("role", "alert");
  notification.setAttribute("tabindex", "-1");

  // Icono
  const icon = document.createElement("span");
  icon.className = `inline-flex justify-center items-center size-8 rounded-full border-4 ${
    type === "success"
      ? "border-teal-100 bg-teal-200 text-teal-800"
      : "border-red-100 bg-red-200 text-red-800"
  }`;
  icon.innerHTML = `
    <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      ${
        type === "success"
          ? '<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path>'
          : '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>'
      }
    </svg>
  `;

  // Contenido
  const content = document.createElement("div");
  content.className = "ms-3";
  content.innerHTML = `
    <h3 class="text-gray-800 font-semibold">${title}</h3>
    <p class="text-sm text-gray-700">${message}</p>
  `;

  // Agregar icono y contenido a la notificación
  notification.appendChild(icon);
  notification.appendChild(content);

  // Agregar la notificación al cuerpo del documento
  document.body.appendChild(notification);

  // Ocultar y eliminar la notificación después de 5 segundos
  setTimeout(() => {
    notification.classList.add("hide");
    notification.addEventListener(
      "animationend",
      () => {
        notification.remove();
      },
      { once: true }
    );
  }, 5000);
}

// Cambiamos DOMContentLoaded por window.onload para esperar a toda la página
window.addEventListener("load", function () {
  const cookieConsent = document.getElementById("cookies-consent");
  const cookieCard = document.getElementById("cookie-card");
  const closeBtn = document.getElementById("close-btn");
  const acceptAll = document.getElementById("accept-all");
  const rejectAll = document.getElementById("reject-all");
  const manageCookies = document.getElementById("manage-cookies");

  // Mostrar el consentimiento con animación después de que la página cargue
  setTimeout(() => {
    cookieConsent.style.display = "block";
    cookieCard.classList.add("animate-slide-in-bottom");
  }, 1000);

  // Función para cerrar el consentimiento de cookies
  function closeCookieConsent() {
    cookieCard.classList.remove("animate-slide-in-bottom");
    cookieCard.classList.add("animate-slide-out-bottom");
    setTimeout(() => {
      cookieConsent.style.display = "none";
    }, 500);
  }

  // Listeners para todos los botones
  closeBtn.addEventListener("click", closeCookieConsent);
  acceptAll.addEventListener("click", closeCookieConsent);
  rejectAll.addEventListener("click", closeCookieConsent);
  manageCookies.addEventListener("click", closeCookieConsent);
});

// Mostrar nombre del archivo seleccionado
document.getElementById("avatar").addEventListener("change", function (e) {
  const fileName = e.target.files[0]?.name || "Seleccionar imagen";
  document.getElementById("file-name").textContent = fileName;
});

document.addEventListener("DOMContentLoaded", function () {
  const openButton = document.getElementById("openTestimonialModal");
  const closeButton = document.getElementById("closeTestimonialModal");
  const modal = document.getElementById("testimonialModal");
  const form = document.getElementById("testimonialForm");

  // Posicionar el modal inicialmente sobre el botón
  function positionModalOnButton() {
    const buttonRect = openButton.getBoundingClientRect();
    const modalContent = modal.querySelector("> div > div");

    // Calcular posición central del botón
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    // Establecer posición inicial
    modal.style.position = "fixed";
    modal.style.left = `${centerX}px`;
    modal.style.top = `${centerY}px`;
    modal.style.transform = "translate(-50%, -50%) scale(0)";
    modalContent.style.transform = "scale(0.5)";
  }

  // Abrir modal con animación
  openButton.addEventListener("click", function (e) {
    e.preventDefault();

    // Posicionar el modal sobre el botón primero
    positionModalOnButton();

    // Mostrar el modal
    modal.classList.remove("hidden");

    // Forzar reflow para que la animación funcione
    void modal.offsetWidth;

    // Animación de entrada
    modal.style.transform = "translate(-50%, -50%) scale(1)";
    modal.querySelector("> div > div").classList.add("modal-enter");

    // Expandir a pantalla completa después de la animación inicial
    setTimeout(() => {
      modal.style.left = "0";
      modal.style.top = "0";
      modal.style.transform = "none";
      modal.querySelector("> div > div").style.transform = "none";
    }, 300);
  });

  // Cerrar modal con animación
  closeButton.addEventListener("click", function (e) {
    e.preventDefault();

    // Volver a posicionar sobre el botón antes de la animación
    const buttonRect = openButton.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    // Animación de salida
    modal.querySelector("> div > div").classList.remove("modal-enter");
    modal.querySelector("> div > div").classList.add("modal-exit");

    // Mover de vuelta al botón durante la animación
    setTimeout(() => {
      modal.style.left = `${centerX}px`;
      modal.style.top = `${centerY}px`;
      modal.style.transform = "translate(-50%, -50%) scale(0)";
    }, 100);

    // Ocultar el modal después de la animación
    setTimeout(() => {
      modal.classList.add("hidden");
      modal.querySelector("> div > div").classList.remove("modal-exit");
    }, 300);
  });

  // Manejar el envío del formulario (opcional)
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Aquí iría tu lógica para enviar el testimonio
    alert("Testimonio enviado con éxito!");
    closeButton.click(); // Cierra el modal después de enviar
  });

  // Actualizar nombre del archivo seleccionado
  document.getElementById("avatar").addEventListener("change", function (e) {
    const fileName = e.target.files[0]?.name || "Seleccionar imagen";
    document.getElementById("file-name").textContent = fileName;
  });
});





        const NOTIFICATION_API_URL = "https://aly-mbelleza-backend.onrender.com/api/appointments";

        // Función para guardar la cita y abrir WhatsApp
        async function handleDateClick(date) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.token) {
                Swal.fire('Debes iniciar sesión para agendar una cita');
                return;
            }

            // Resaltar día seleccionado
            const allCells = document.querySelectorAll('#calendar > div');
            allCells.forEach(cell => {
                cell.classList.remove('bg-blue-600', 'text-white');
                if (cell.textContent && isToday(new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(cell.textContent)))) {
                    cell.classList.add('bg-blue-100');
                }
            });

            // Guardar cita en backend
            try {
                const res = await fetch(NOTIFICATION_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ date })
                });
                const data = await res.json();
                if (data.success) {
                    Swal.fire('¡Cita agendada!', 'Tu cita ha sido registrada.', 'success');
                    loadAppointments(); // Actualiza el panel y notificaciones
                } else {
                    Swal.fire('Error', data.message || 'No se pudo agendar la cita', 'error');
                }
            } catch (err) {
                Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
            }

            // WhatsApp
            const formattedDate = date.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            const message = `Hola Merly 👋, quiero agendar una cita para el ${formattedDate}, me confirmas si estarás disponible, gracias amiga ❤️, espero tu respuesta.`;
            const phoneNumber = '593981229675';
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }

        // Cargar citas del usuario y mostrarlas en el panel y notificaciones
        async function loadAppointments() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.token) return;
            try {
                const res = await fetch(NOTIFICATION_API_URL, {
                    headers: { "Authorization": `Bearer ${user.token}` }
                });
                const data = await res.json();
                console.log("CITAS QUE LLEGAN DEL BACKEND:", data);
                if (data.success) {
                    renderAppointments(data.appointments);
                    renderNotifications(data.appointments);
                }
            } catch (err) {
                // Puedes mostrar un error si quieres
            }
        }

        // Renderizar citas en el panel
        function renderAppointments(appointments) {
            const list = document.getElementById('appointments-list');
            list.innerHTML = '';
            if (!appointments.length) {
                list.innerHTML = '<li class="text-gray-500">No tienes citas pendientes.</li>';
                return;
            }
            appointments.forEach(app => {
                const li = document.createElement('li');
                li.className = "flex justify-between items-center bg-purple-50 rounded-lg px-4 py-2";
                li.innerHTML = `
                    <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div class="flex items-center gap-3">
                            <div class="bg-blue-100 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            </div>
                            <span class="font-medium text-gray-700">
                            ${new Date(app.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                        
                        <div class="flex gap-2">
                            <button class="realizada-btn px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm font-medium flex items-center gap-1 transition-colors" data-id="${app._id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Realizada
                            </button>
                            <button class="cancelar-btn px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-md text-sm font-medium flex items-center gap-1 transition-colors" data-id="${app._id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancelar
                            </button>
                        </div>
                    </div>
                `;
                list.appendChild(li);
            });

            // Eventos para los botones
            document.querySelectorAll('.realizada-btn').forEach(btn => {
                btn.onclick = () => updateAppointmentStatus(btn.dataset.id, 'realizada');
            });
            document.querySelectorAll('.cancelar-btn').forEach(btn => {
                btn.onclick = () => cancelAppointment(btn.dataset.id);
            });
        }

        // Renderizar notificaciones
        function renderNotifications(appointments) {
            const count = document.getElementById('notification-count');
            const list = document.getElementById('appointments-list');
            count.textContent = appointments.length;
            if (appointments.length > 0) {
                count.classList.remove('hidden');
            } else {
                count.classList.add('hidden');
            }
            list.innerHTML = '';
            if (!appointments.length) {
                list.innerHTML = `
                    <li class="px-5 py-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="mt-3 text-gray-500 font-medium">No hay notificaciones</p>
                        <p class="text-sm text-gray-400 mt-1">Cuando tengas nuevas citas, aparecerán aquí</p>
                    </li>
                `;
                return;
            }
            appointments.forEach(app => {
                // Estado visual
                let estado = app.status || 'pendiente';
                let estadoColor = 'text-yellow-500';
                let estadoIcon = `<i class="fas fa-clock"></i>`;
                let estadoText = 'Pendiente';
                if (estado === 'realizada') {
                    estadoColor = 'text-emerald-500';
                    estadoIcon = `<i class="fas fa-check-circle"></i>`;
                    estadoText = 'Realizada';
                } else if (estado === 'cancelada') {
                    estadoColor = 'text-rose-500';
                    estadoIcon = `<i class="fas fa-times-circle"></i>`;
                    estadoText = 'Cancelada';
                }
                // Fecha y hora
                const fecha = new Date(app.date);
                const fechaStr = fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                const horaStr = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

                // Mensaje
                const mensaje = `Tienes una reservación con tu estilista el <span class="font-semibold">${fechaStr}`;

                // Botones solo si está pendiente
                let botones = '';
                if (estado === 'pendiente') {
                    botones = `
                        <div class="flex gap-2 mt-3">
                            <button class="cancelar-btn px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-md text-xs font-medium flex items-center gap-1 transition-colors" data-id="${app._id}">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button class="realizada-btn px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-xs font-medium flex items-center gap-1 transition-colors" data-id="${app._id}">
                                <i class="fas fa-check"></i> Realizada
                            </button>
                        </div>
                    `;
                }

                const li = document.createElement('li');
                li.className = "px-5 py-4 flex flex-col gap-1 bg-white hover:bg-purple-50 rounded-xl mb-2 shadow-sm border border-gray-100";
                li.innerHTML = `
                    <div class="flex items-center gap-3">
                        <span class="text-xl ${estadoColor}">${estadoIcon}</span>
                        <span class="text-sm font-semibold ${estadoColor}">${estadoText}</span>
                    </div>
                    <div class="text-gray-700 text-sm mt-1">${mensaje}</div>
                    ${botones}
                `;
                list.appendChild(li);
            });

            // Eventos para los botones
            document.querySelectorAll('.realizada-btn').forEach(btn => {
                btn.onclick = () => updateAppointmentStatus(btn.dataset.id, 'realizada');
            });
            document.querySelectorAll('.cancelar-btn').forEach(btn => {
                btn.onclick = () => cancelAppointment(btn.dataset.id);
            });
        }

        // Cambiar estado de cita
        async function updateAppointmentStatus(id, status) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.token) return;
            // Actualiza en la base de datos
            await fetch(`${NOTIFICATION_API_URL}/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify({ status })
            });
            // Quita la notificación del DOM
            const li = document.querySelector(`.realizada-btn[data-id="${id}"]`)?.closest('li') ||
                    document.querySelector(`.cancelar-btn[data-id="${id}"]`)?.closest('li');
            if (li) li.remove();
            // Actualiza el contador
            const count = document.getElementById('notification-count');
            const list = document.getElementById('appointments-list');
            count.textContent = list.children.length;
            if (list.children.length === 0) {
                list.innerHTML = '<li class="text-gray-500 px-4 py-2">Sin notificaciones.</li>';
                count.classList.add('hidden');
            }
        }

        // Cancelar cita y abrir WhatsApp
        async function cancelAppointment(id) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.token) return;
            // Buscar la cita para obtener la fecha
            const res = await fetch(NOTIFICATION_API_URL, { headers: { "Authorization": `Bearer ${user.token}` } });
            const data = await res.json();
            const cita = data.appointments.find(a => a._id === id);
            if (cita) {
                const formattedDate = new Date(cita.date).toLocaleDateString('es-ES', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                });
                const message = `Hola Merly, lamentablemente debo cancelar mi cita para el ${formattedDate}. Disculpa las molestias.`;
                const phoneNumber = '593981229675';
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            }
            // Cambiar estado en backend
            await updateAppointmentStatus(id, 'cancelada');
        }

        // Cargar citas al iniciar
        document.addEventListener('DOMContentLoaded', loadAppointments);


        document.getElementById('notification-btn').onclick = function (e) {
            e.stopPropagation();
            const dropdown = document.getElementById('notification-dropdown');
            const isHidden = dropdown.classList.contains('hidden');
            if (isHidden) {
                dropdown.classList.remove('hidden', 'opacity-0', 'scale-95');
                dropdown.classList.add('opacity-100', 'scale-100');
            } else {
                dropdown.classList.remove('opacity-100', 'scale-100');
                dropdown.classList.add('opacity-0', 'scale-95');
                setTimeout(() => dropdown.classList.add('hidden'), 200);
            }
            if (!dropdown.classList.contains('hidden')) {
                loadAppointments();
            }
        };

        function closeNotifications() {
            const dropdown = document.getElementById('notification-dropdown');
            dropdown.classList.remove('opacity-100', 'scale-100');
            dropdown.classList.add('opacity-0', 'scale-95');
            setTimeout(() => dropdown.classList.add('hidden'), 200);
        }

        document.addEventListener('click', function (event) {
            const dropdown = document.getElementById('notification-dropdown');
            const btn = document.getElementById('notification-btn');
            if (!dropdown.contains(event.target) && !btn.contains(event.target)) {
                dropdown.classList.remove('opacity-100', 'scale-100');
                dropdown.classList.add('opacity-0', 'scale-95');
                setTimeout(() => dropdown.classList.add('hidden'), 200);
            }
        });
