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
      parts.push("Sou empresa e gostaria de orientações para apoiar (patrocínio / incentivo fiscal / doação recorrente).");
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

  function updateAllWhatsappLinks() {
    const amount = $("#amount")?.value?.trim() || "";
    const project = $("#project")?.value?.trim() || "";

    const msgDefault = buildMessage({ amount, project, context: "doacao" });
    const msgEmpresa = buildMessage({ amount, project, context: "empresa" });
    const msgParceria = buildMessage({ amount, project, context: "parceria" });

    const setHref = (id, href) => {
      const el = $(id);
      if (el) el.setAttribute("href", href);
    };

    setHref("#ctaWhatsappCard", waLink(msgDefault));
    setHref("#ctaWhatsappSide", waLink(msgDefault));
    setHref("#ctaWhatsappSection", waLink(msgDefault));
    setHref("#footerWhatsapp", waLink(msgDefault));
    setHref("#footerWhatsappText", waLink(msgDefault));
    setHref("#ctaWhatsappFooter", waLink(msgDefault));
    setHref("#ctaWhatsappFooterTop", waLink(msgDefault));
    setHref("#contactWhatsapp", waLink(msgDefault));

    setHref("#ctaWhatsappEmpresa", waLink(msgEmpresa));
    setHref("#ctaWhatsappParceiro", waLink(msgParceria));
  }

  // keep links updated
  ["input", "change"].forEach((evt) => {
    $("#amount")?.addEventListener(evt, updateAllWhatsappLinks);
    $("#project")?.addEventListener(evt, updateAllWhatsappLinks);
  });
  updateAllWhatsappLinks();

  // ===== Instagram =====
  const setIg = (id) => {
    const el = $(id);
    if (el) el.setAttribute("href", INSTAGRAM_URL);
  };
  setIg("#contactInstagram");
  setIg("#footerInstagram");

  // ===== Project quick-select (buttons with data-project) =====
  document.querySelectorAll("[data-project]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const project = btn.getAttribute("data-project");
      const select = $("#project");
      if (select && project) {
        select.value = project;
        updateAllWhatsappLinks();
      }
    });
  });

  // ===== Year =====
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
