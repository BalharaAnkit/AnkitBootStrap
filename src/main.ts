// Lightweight helpers
const qs = <T extends Element = Element>(sel: string, scope: Document | Element = document) =>
  scope.querySelector<T>(sel);
const qsa = <T extends Element = Element>(sel: string, scope: Document | Element = document) =>
  Array.from(scope.querySelectorAll<T>(sel));

document.addEventListener("DOMContentLoaded", () => {
  // 1) Progressive enhancements for carousel
  const carousel = qs<HTMLElement>("#carouselExampleDark");
  if (carousel) {
    // Add lazy loading to images if missing
    qsa<HTMLImageElement>("img", carousel).forEach(img => {
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
    });

    // Basic swipe support (touch/pointer)
    let startX = 0;
    let dx = 0;
    const threshold = 40;

    const onPointerDown = (e: PointerEvent) => {
      startX = e.clientX;
      dx = 0;
      carousel.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (startX) dx = e.clientX - startX;
    };
    const onPointerUp = (e: PointerEvent) => {
      if (Math.abs(dx) > threshold) {
        const dir = dx > 0 ? "prev" : "next";
        // Use Bootstrap’s data API via dispatching
        const btnSel = dir === "prev" ? ".carousel-control-prev" : ".carousel-control-next";
        qs<HTMLButtonElement>(btnSel, carousel)?.click();
      }
      startX = 0;
      dx = 0;
      try { carousel.releasePointerCapture(e.pointerId); } catch {}
    };

    carousel.addEventListener("pointerdown", onPointerDown);
    carousel.addEventListener("pointermove", onPointerMove);
    carousel.addEventListener("pointerup", onPointerUp);
    carousel.addEventListener("pointercancel", onPointerUp);
  }

  // 2) Navbar active-link highlighting (based on pathname)
  const path = location.pathname.split("/").pop() || "index.html";
  qsa<HTMLAnchorElement>(".navbar a.nav-link").forEach(a => {
    const href = a.getAttribute("href");
    if (href && href.endsWith(path)) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    } else {
      a.classList.remove("active");
      a.removeAttribute("aria-current");
    }
  });

  // 3) Search form (demo hook)
  const searchForm = qs<HTMLFormElement>('form[role="search"]');
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = qs<HTMLInputElement>('input[type="search"]', searchForm);
      const q = input?.value.trim();
      if (q) {
        console.log("Search query:", q);
        // TODO: route to /search.html?q=... or filter posts
      }
    });
  }

  // 4) Back-to-top button
  let backBtn = qs<HTMLButtonElement>("#backToTop");
  if (!backBtn) {
    backBtn = document.createElement("button");
    backBtn.id = "backToTop";
    backBtn.title = "Back to top";
    backBtn.innerHTML = "↑";
    document.body.appendChild(backBtn);
  }
  const toggleBackBtn = () => {
    const show = window.scrollY > 300;
    backBtn!.style.display = show ? "inline-block" : "none";
  };
  window.addEventListener("scroll", toggleBackBtn, { passive: true });
  backBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  toggleBackBtn();
});
