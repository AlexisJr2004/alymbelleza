// =============================================
// CONSTANTES Y CONFIGURACIONES GLOBALES
// =============================================
const API_URL = "https://aly-mbelleza-backend.onrender.com";
const fonts = [
  "Quicksand",
  "Arial",
  "Verdana",
  "Georgia",
  "Times New Roman",
  "Courier New",
];
let currentZoom = 100;
let currentFontSize = 100;
let currentFontIndex = 0;
let testimonialSwiper = null;

// =============================================
// FUNCIONES DE UTILIDAD
// =============================================

function formatImageUrl(url) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const baseUrl = window.location.origin;
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

function showNotification(type, title, message) {
  const notification = document.createElement("div");
  notification.className = `notification ${
    type === "success"
      ? "bg-teal-50 border-teal-500"
      : "bg-red-50 border-red-500"
  } border-t-2 rounded-lg p-4`;
  notification.setAttribute("role", "alert");
  notification.setAttribute("tabindex", "-1");

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

  const content = document.createElement("div");
  content.className = "ms-3";
  content.innerHTML = `
    <h3 class="text-gray-800 font-semibold">${title}</h3>
    <p class="text-sm text-gray-700">${message}</p>
  `;

  notification.appendChild(icon);
  notification.appendChild(content);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("hide");
    notification.addEventListener("animationend", () => notification.remove(), {
      once: true,
    });
  }, 5000);
}

// =============================================
// MANEJO DE MENÚS
// =============================================

function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document
    .getElementById("mobile-menu-toggle")
    .querySelector("svg");

  mobileMenu.classList.toggle("hidden");

  if (!mobileMenu.classList.contains("hidden")) {
    menuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>`;
  } else {
    menuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>`;
  }
}

function toggleServicesMenu() {
  const submenu = document.getElementById("services-submenu");
  submenu.classList.toggle("hidden");
}

function setupDropdownMenu() {
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
}

// =============================================
// ACCESIBILIDAD
// =============================================

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

function changeFontSize(action) {
  if (action === "increase" && currentFontSize < 200) {
    currentFontSize += 10;
  } else if (action === "decrease" && currentFontSize > 80) {
    currentFontSize -= 10;
  }
  document.body.style.fontSize = `${currentFontSize}%`;
}

function resetFontSize() {
  currentFontSize = 100;
  document.body.style.fontSize = "100%";
}

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

// =============================================
// USUARIO Y AUTENTICACIÓN
// =============================================

function setupUserProfile() {
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
    userProfileSection.classList.remove("hidden");
    loginSection.classList.add("hidden");

    profileName.textContent = user.name || "Usuario";
    profileEmail.textContent = user.email || "";

    if (user.role === "admin") {
      profileRole.textContent = "Administrador";
      statusIndicator.classList.remove("bg-green-500");
      statusIndicator.classList.add("bg-purple-500");
      adminLinkContainer.classList.remove("hidden");
    } else {
      profileRole.textContent = "Cliente";
    }

    const profileImageUrl =
      user.profileImage && user.profileImage.startsWith("http")
        ? user.profileImage
        : user.profileImage && user.profileImage.startsWith("/uploads/")
        ? "https://aly-mbelleza-backend.onrender.com" + user.profileImage
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name || "U"
          )}&background=random&length=1`;

    profileImg.src = profileImageUrl;

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
    loginSection.classList.remove("hidden");
    userProfileSection.classList.add("hidden");
  }
}

// =============================================
// TESTIMONIOS
// =============================================
function initTestimonialSwiper() {
  if (typeof Swiper === "undefined") {
    console.error("Swiper no está disponible");
    return;
  }

  if (testimonialSwiper) {
    testimonialSwiper.destroy(true, true);
  }

  testimonialSwiper = new Swiper(".testimonials-swiper", {
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
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
}
 
async function loadTestimonials() {
  try {
    const response = await fetch(`${API_URL}/api/testimonials`);
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    const { data: testimonials } = await response.json();

    const swiperWrapper = document.querySelector(
      ".testimonials-swiper .swiper-wrapper"
    );
    if (!swiperWrapper)
      throw new Error("No se encontró el contenedor de testimonios");
    swiperWrapper.innerHTML = "";

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && !user._id && user.token) {
      try {
        const payload = JSON.parse(atob(user.token.split(".")[1]));
        user._id = payload.userId || payload._id || payload.id;
      } catch (e) {}
    }

    if (testimonials.length === 0) {
      swiperWrapper.innerHTML = `
        <div class="swiper-slide flex items-center justify-center h-full w-full">
          <div class="text-center p-8 max-w-sm mx-auto">
            <div class="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 mb-4">
              <svg class="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">No hay testimonios aún</h3>
            <p class="text-gray-600 mb-6">Parece que nadie ha compartido su experiencia todavía.</p>
          </div>
        </div>`;
    } else {
      testimonials.forEach((testimonial) => {
        // FECHA Y HORA DE PUBLICACIÓN
        const fecha = new Date(testimonial.createdAt).toLocaleDateString("es-ES", {
          year: "numeric", month: "short", day: "numeric"
        });
        const hora = new Date(testimonial.createdAt).toLocaleTimeString("es-ES", {
          hour: "2-digit", minute: "2-digit"
        });

        let isOwner = false;
        if (
          user &&
          testimonial.userId &&
          user._id &&
          String(testimonial.userId) === String(user._id)
        ) {
          isOwner = true;
        }

        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        slide.innerHTML = `
    <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col relative group">
      <div class="relative flex-grow">
        <svg class="absolute -top-4 -left-4 h-8 w-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.999v10h-9.999z"/>
        </svg>
        <br>
        <p class="text-gray-600 italic mb-8 comment-text" data-id="${
          testimonial._id
        }">${testimonial.comment}</p>
        <p class="text-xs text-gray-500 mt-2">
          Publicado el <span>${fecha}</span> a las <span>${hora}</span>
        </p>
      </div>
      <div class="flex items-center mt-auto">
        <img src="${formatImageUrl(testimonial.avatar)}" alt="${
          testimonial.name
        }" class="h-12 w-12 rounded-full object-cover"
          onerror="this.onerror=null;this.src='https://us.123rf.com/450wm/thesomeday123/thesomeday1231712/thesomeday123171200009/91087331-icono-de-perfil-de-avatar-predeterminado-para-hombre-marcador-de-posici%C3%B3n-de-foto-gris-vector-de.jpg?ver=6'">
        <div class="ml-4">
          <h4 class="font-semibold text-gray-900">${testimonial.name}</h4>
          <p class="text-gray-500 text-sm">${testimonial.role}</p>
        </div>
      </div>
      ${
        isOwner
          ? `
        <div class="absolute top-4 right-4">
          <div class="relative group">
            <button class="testimonial-menu-btn w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center focus:outline-none" aria-label="Opciones">
              <span class="sr-only">Opciones</span>
              <span class="text-2xl font-bold text-gray-600">⋮</span>
            </button>
            <div class="testimonial-menu hidden absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
              <button class="edit-testimonial-btn block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                data-id="${testimonial._id}" data-role="${testimonial.role}">Editar</button>
              <button class="delete-testimonial-btn block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                data-id="${testimonial._id}">Eliminar</button>
            </div>
          </div>
        </div>
      `
          : ""
      }
    </div>
  `;
        swiperWrapper.appendChild(slide);
      });
    }

    initTestimonialSwiper();
    // Al final de loadTestimonials(), después de initTestimonialSwiper();
    if (testimonialSwiper && user && user._id) {
      const myIndex = testimonials.findIndex(
        (t) => String(t.userId) === String(user._id)
      );
      if (myIndex !== -1) {
        // Swiper es circular, así que ajusta el índice para el loop
        testimonialSwiper.slideToLoop(myIndex, 0); // 0 ms de transición
      }
    }

    setTimeout(() => {
    // Manejo del menú de opciones de testimonios
    document.querySelectorAll(".testimonial-menu-btn").forEach((btn) => {
      btn.onclick = function (e) {
        e.stopPropagation();
        const menu = btn.parentElement.querySelector(".testimonial-menu");
        // Si el menú ya está visible, ciérralo
        const isOpen = !menu.classList.contains("hidden");
        // Cierra todos los menús primero
        document.querySelectorAll(".testimonial-menu").forEach((m) => m.classList.add("hidden"));
        // Si estaba cerrado, ábrelo (toggle)
        if (!isOpen) menu.classList.remove("hidden");
      };
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", function closeMenus(e) {
      document.querySelectorAll(".testimonial-menu").forEach((menu) => {
        if (!menu.classList.contains("hidden")) {
          menu.classList.add("hidden");
        }
      });
    });

    // Evita que el menú se cierre si haces clic dentro del menú
    document.querySelectorAll(".testimonial-menu").forEach((menu) => {
      menu.onclick = function (e) {
        e.stopPropagation();
      };
    });

    document.querySelectorAll(".edit-testimonial-btn").forEach((btn) => {
      btn.onclick = function () {
        btn.closest(".testimonial-menu").classList.add("hidden");

        document
          .querySelectorAll(".comment-text[contenteditable='true']")
          .forEach((p) => {
            p.removeAttribute("contenteditable");
            const saveBtn = p.parentNode.querySelector(".save-edit-btn");
            if (saveBtn) saveBtn.remove();
          });

        const id = btn.getAttribute("data-id");
        const role = btn.getAttribute("data-role");
        const commentP = btn
          .closest(".swiper-slide")
          .querySelector(".comment-text");

        commentP.setAttribute("contenteditable", "true");

        const saveBtn = document.createElement("button");
        saveBtn.className =
          "save-edit-btn float-right -mt-2 w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center focus:outline-none";
        saveBtn.innerHTML = `<i class="fas fa-play text-xl text-gray-500"></i>`;
        saveBtn.setAttribute("data-id", id);
        saveBtn.setAttribute("data-role", role);

        commentP.parentNode.appendChild(saveBtn);

        saveBtn.onclick = async function () {
          const newComment = commentP.textContent;
          await updateTestimonialInline(id, newComment, role);
        };
      };
    });

    document.querySelectorAll(".delete-testimonial-btn").forEach((btn) => {
      btn.onclick = async function () {
        const id = btn.getAttribute("data-id");
        Swal.fire({
          title: "¿Seguro que quieres borrar este testimonio?",
          text: "Esta acción no se puede deshacer.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#e3342f",
          cancelButtonColor: "#6b7280",
          confirmButtonText: "Sí, borrar",
          cancelButtonText: "Cancelar",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await deleteTestimonial(id);
            loadTestimonials();
          }
        });
      };
    });
  }, 100);
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
}

async function updateTestimonialInline(id, comment, role) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && !user._id && user.id) user._id = user.id;
  if (!user || !user.token) {
    showNotification(
      "error",
      "Error",
      "Debes iniciar sesión para editar testimonios."
    );
    return;
  }

  const formData = new FormData();
  formData.append("comment", comment);
  formData.append("role", role);
  formData.append("name", user.name);
  formData.append("avatar", user.profileImage);

  try {
    const response = await fetch(`${API_URL}/api/testimonials/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${user.token}` },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "No se pudo editar el testimonio");

    showNotification(
      "success",
      "¡Éxito!",
      data.message || "Testimonio editado correctamente"
    );
    loadTestimonials();
  } catch (err) {
    showNotification(
      "error",
      "Error al editar testimonio",
      err.message || "Error desconocido"
    );
    console.error(err);
  }
}

async function deleteTestimonial(id) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.token) {
    showNotification(
      "error",
      "Error",
      "Debes iniciar sesión para borrar testimonios."
    );
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/testimonials/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "No se pudo borrar el testimonio");

    showNotification(
      "success",
      "¡Éxito!",
      data.message || "Testimonio eliminado"
    );
  } catch (err) {
    showNotification(
      "error",
      "Error al borrar testimonio",
      err.message || "Error desconocido"
    );
    console.error(err);
  }
}

function setupTestimonialModal() {
  const testimonialModal = document.getElementById("testimonialModal");
  const openModalBtn = document.getElementById("openTestimonialModal");
  const closeModalBtn = document.getElementById("closeTestimonialModal");
  const testimonialForm = document.getElementById("testimonialForm");

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
      if (testimonialModal) testimonialModal.classList.remove("hidden");
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

        const response = await fetch(`${API_URL}/api/testimonials`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        });

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
          typeof error === "object"
            ? error.message
            : "Error al enviar testimonio"
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }
}

// =============================================
// FORMULARIOS
// =============================================

function setupContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      const form = e.target;
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

        const formData = new FormData(form);
        const formDataObj = Object.fromEntries(formData.entries());

        const response = await fetch(`${API_URL}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataObj),
        });

        const contentType = response.headers.get("content-type");
        let result;

        if (contentType && contentType.includes("application/json")) {
          result = await response.json();
        } else {
          const text = await response.text();
          throw new Error(
            text || "El servidor no respondió correctamente. Intenta más tarde."
          );
        }

        if (!response.ok)
          throw new Error(result.error || `Error: ${response.status}`);

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
  }
}

// =============================================
// ELEMENTOS DE INTERFAZ
// =============================================

function setupGoTopButton() {
  window.addEventListener("scroll", function () {
    const goTopBtn = document.getElementById("goTopBtn");
    if (!goTopBtn) return;

    if (window.scrollY > 100) {
      goTopBtn.classList.remove("translate-y-20", "opacity-0");
      goTopBtn.classList.add("translate-y-0", "opacity-100");
    } else {
      goTopBtn.classList.add("translate-y-20", "opacity-0");
      goTopBtn.classList.remove("translate-y-0", "opacity-100");
    }
  });

  const goTopBtn = document.getElementById("goTopBtn");
  if (goTopBtn) {
    goTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function setupAccordion() {
  const toggles = document.querySelectorAll(".accordion-toggle");
  const contents = document.querySelectorAll(".accordion-content");

  if (contents.length > 0) {
    contents[0].style.maxHeight = contents[0].scrollHeight + "px";
    toggles[0].querySelector("svg").classList.add("rotate-180");
  }

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
}

function setupLightEffect() {
  const container = document.querySelector(".light-container");
  const light = document.querySelector(".light-follow");

  if (container && light) {
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
  }
}

function setupFullscreenToggle() {
  const fullscreenToggle = document.getElementById("fullscreen-toggle");
  const fullscreenIcon = document.getElementById("fullscreen-icon");

  if (fullscreenToggle && fullscreenIcon) {
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
  }
}

function setupCookieConsent() {
  const cookieConsent = document.getElementById("cookies-consent");
  const cookieCard = document.getElementById("cookie-card");
  const closeBtn = document.getElementById("close-btn");
  const acceptAll = document.getElementById("accept-all");
  const rejectAll = document.getElementById("reject-all");
  const manageCookies = document.getElementById("manage-cookies");

  if (!cookieConsent) return;

  setTimeout(() => {
    cookieConsent.style.display = "block";
    cookieCard.classList.add("animate-slide-in-bottom");
  }, 1000);

  function closeCookieConsent() {
    cookieCard.classList.remove("animate-slide-in-bottom");
    cookieCard.classList.add("animate-slide-out-bottom");
    setTimeout(() => {
      cookieConsent.style.display = "none";
    }, 500);
  }

  if (closeBtn) closeBtn.addEventListener("click", closeCookieConsent);
  if (acceptAll) acceptAll.addEventListener("click", closeCookieConsent);
  if (rejectAll) rejectAll.addEventListener("click", closeCookieConsent);
  if (manageCookies)
    manageCookies.addEventListener("click", closeCookieConsent);
}

// =============================================
// INICIALIZACIÓN
// =============================================

document.addEventListener("DOMContentLoaded", () => {
  // Menús y navegación
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  if (mobileMenuToggle)
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);

  setupDropdownMenu();
  setupUserProfile();

  // Accesibilidad
  const savedFont = localStorage.getItem("selectedFont");
  if (savedFont) {
    document.body.style.fontFamily = savedFont;
    currentFontIndex = fonts.indexOf(savedFont);
    if (currentFontIndex === -1) currentFontIndex = 0;
    updateFontDisplay(savedFont);
  } else {
    updateFontDisplay(fonts[0]);
  }

  // Elementos de interfaz
  setupGoTopButton();
  setupAccordion();
  setupLightEffect();
  setupFullscreenToggle();
  setupCookieConsent();

  // Formularios
  setupContactForm();
  setupTestimonialModal();

  // Testimonios
  if (!document.querySelector('link[href*="swiper-bundle.min.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/swiper@8/swiper-bundle.min.css";
    document.head.appendChild(link);
  }

  if (typeof Swiper === "undefined") {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/swiper@8/swiper-bundle.min.js";
    script.onload = loadTestimonials;
    document.head.appendChild(script);
  } else {
    loadTestimonials();
  }

  // Avatar preview
  document
    .getElementById("avatar")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
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
        reader.readAsDataURL(file);
      }
    });
});

window.addEventListener("load", setupCookieConsent);
