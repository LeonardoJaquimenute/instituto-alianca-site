(() => {
  const PHONE_RAW = "559282809430"; // +55 92 8280-9430
  const INSTAGRAM_URL = "https://www.instagram.com/inst.alianca/";

  const $ = (sel) => document.querySelector(sel);

  // ===== Navbar (mobile) =====
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // close menu on click (mobile)
    navMenu.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.tagName === "A") {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    // close on outside click
    document.addEventListener("click", (e) => {
      if (!navMenu.classList.contains("is-open")) return;
      const t = e.target;
      const clickedInside = navMenu.contains(t) || navToggle.contains(t);
      if (!clickedInside) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ===== WhatsApp builder =====
  function buildMessage({ amount, project, context }) {
    const parts = [];
    parts.push("Olá! Quero apoiar o Instituto Aliança.");
    if (project) parts.push(`Projeto: ${project}.`);
    if (amount) parts.push(`Valor sugerido: R$ ${amount}.`);

    if (context === "empresa") {
      parts.push(
        "Sou empresa e gostaria de orientações para apoiar (patrocínio / incentivo fiscal / doação recorrente)."
      );
    } else if (context === "parceria") {
      parts.push("Quero conversar sobre parceria/patrocínio e contrapartidas.");
    } else {
      parts.push("Podem me orientar sobre como realizar a doação?");
    }

    return parts.join(" ");
  }

  function waLink(message) {
    const text = encodeURIComponent(message);
    return `https://wa.me/${PHONE_RAW}?text=${text}`;
  }

  function setHref(selector, href) {
    const el = $(selector);
    if (el) el.setAttribute("href", href);
  }

  function updateAllWhatsappLinks() {
    const amount = $("#amount")?.value?.trim() || "";
    const project = $("#project")?.value?.trim() || "";

    const msgDefault = buildMessage({ amount, project, context: "doacao" });
    const msgEmpresa = buildMessage({ amount, project, context: "empresa" });
    const msgParceria = buildMessage({ amount, project, context: "parceria" });

    const hrefDefault = waLink(msgDefault);
    const hrefEmpresa = waLink(msgEmpresa);
    const hrefParceria = waLink(msgParceria);

    // Doação (default)
    setHref("#ctaWhatsappCard", hrefDefault);
    setHref("#ctaWhatsappSide", hrefDefault);
    setHref("#ctaWhatsappSection", hrefDefault);
    setHref("#footerWhatsapp", hrefDefault);
    setHref("#footerWhatsappText", hrefDefault);
    setHref("#ctaWhatsappFooter", hrefDefault);
    setHref("#ctaWhatsappFooterTop", hrefDefault);
    setHref("#contactWhatsapp", hrefDefault);

    // Empresa / Parceria
    setHref("#ctaWhatsappEmpresa", hrefEmpresa);
    setHref("#ctaWhatsappParceiro", hrefParceria);
  }

  // ===== Instagram =====
  function setIg(selector) {
    const el = $(selector);
    if (el) el.setAttribute("href", INSTAGRAM_URL);
  }
  setIg("#contactInstagram");
  setIg("#footerInstagram");

  // ===== Year =====
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ==========================
  // Dropdown custom de projetos (fix iOS) 
  // ==========================
  const dropdown = document.getElementById("projectDropdown");
  const btn = document.getElementById("projectBtn");
  const list = document.getElementById("projectList");
  const label = document.getElementById("projectLabel");
  const hidden = document.getElementById("project"); // hidden input (valor real)
  const items = list ? Array.from(list.querySelectorAll(".dropdown__item")) : [];

  function closeDropdown() {
    if (!dropdown || !btn) return;
    dropdown.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  }

  function openDropdown() {
    if (!dropdown || !btn) return;
    dropdown.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  }

  function toggleDropdown() {
    if (!dropdown) return;
    dropdown.classList.contains("is-open") ? closeDropdown() : openDropdown();
  }

  function setProject(value, labelText) {
    if (!hidden) return;

    hidden.value = value || "";

    if (label) {
      // texto do botão do dropdown
      label.textContent = labelText || (value ? value : "Quero ajudar o Instituto (geral)");
    }

    // marca item selecionado no dropdown (se existir)
    if (items.length) {
      items.forEach((it) => {
        const v = it.dataset.value || "";
        it.classList.toggle("is-selected", v === (value || ""));
      });
    }

    // atualiza links do WhatsApp
    updateAllWhatsappLinks();

    // fecha dropdown se estiver aberto
    closeDropdown();
  }

  // Events: dropdown
  if (btn && dropdown) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleDropdown();
    });

    items.forEach((it) => {
      it.addEventListener("click", () => {
        const value = it.dataset.value || "";
        const text = it.textContent.trim();
        setProject(value, text);
      });
    });

    // fecha clicando fora
    document.addEventListener("click", (e) => {
      if (!dropdown.classList.contains("is-open")) return;
      if (!dropdown.contains(e.target)) closeDropdown();
    });
  }

  // ===== Listeners para atualizar WhatsApp (amount + hidden project)
  ["input", "change"].forEach((evt) => {
    $("#amount")?.addEventListener(evt, updateAllWhatsappLinks);
    hidden?.addEventListener(evt, updateAllWhatsappLinks);
  });

  // ===== Project quick-select (links/buttons com data-project)
  document.querySelectorAll("[data-project]").forEach((btnEl) => {
    btnEl.addEventListener("click", () => {
      const project = btnEl.getAttribute("data-project");
      if (project) setProject(project, project);
    });
  });

  // ===== Inicialização (default)
  setProject("", "Quero ajudar o Instituto (geral)");
})();