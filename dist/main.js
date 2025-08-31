"use strict";
// Lightweight helpers
const qs = (sel, scope = document) => scope.querySelector(sel);
const qsa = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));
document.addEventListener("DOMContentLoaded", () => {
    // 1) Progressive enhancements for carousel
    const carousel = qs("#carouselExampleDark");
    if (carousel) {
        // Add lazy loading to images if missing
        qsa("img", carousel).forEach(img => {
            if (!img.hasAttribute("loading"))
                img.setAttribute("loading", "lazy");
        });
        // Basic swipe support (touch/pointer)
        let startX = 0;
        let dx = 0;
        const threshold = 40;
        const onPointerDown = (e) => {
            startX = e.clientX;
            dx = 0;
            carousel.setPointerCapture(e.pointerId);
        };
        const onPointerMove = (e) => {
            if (startX)
                dx = e.clientX - startX;
        };
        const onPointerUp = (e) => {
            var _a;
            if (Math.abs(dx) > threshold) {
                const dir = dx > 0 ? "prev" : "next";
                // Use Bootstrap’s data API via dispatching
                const btnSel = dir === "prev" ? ".carousel-control-prev" : ".carousel-control-next";
                (_a = qs(btnSel, carousel)) === null || _a === void 0 ? void 0 : _a.click();
            }
            startX = 0;
            dx = 0;
            try {
                carousel.releasePointerCapture(e.pointerId);
            }
            catch (_b) { }
        };
        carousel.addEventListener("pointerdown", onPointerDown);
        carousel.addEventListener("pointermove", onPointerMove);
        carousel.addEventListener("pointerup", onPointerUp);
        carousel.addEventListener("pointercancel", onPointerUp);
    }
    // 2) Navbar active-link highlighting (based on pathname)
    const path = location.pathname.split("/").pop() || "index.html";
    qsa(".navbar a.nav-link").forEach(a => {
        const href = a.getAttribute("href");
        if (href && href.endsWith(path)) {
            a.classList.add("active");
            a.setAttribute("aria-current", "page");
        }
        else {
            a.classList.remove("active");
            a.removeAttribute("aria-current");
        }
    });
    // 3) Search form (demo hook)
    const searchForm = qs('form[role="search"]');
    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const input = qs('input[type="search"]', searchForm);
            const q = input === null || input === void 0 ? void 0 : input.value.trim();
            if (q) {
                console.log("Search query:", q);
                // TODO: route to /search.html?q=... or filter posts
            }
        });
    }
    // 4) Back-to-top button
    let backBtn = qs("#backToTop");
    if (!backBtn) {
        backBtn = document.createElement("button");
        backBtn.id = "backToTop";
        backBtn.title = "Back to top";
        backBtn.innerHTML = "↑";
        document.body.appendChild(backBtn);
    }
    const toggleBackBtn = () => {
        const show = window.scrollY > 300;
        backBtn.style.display = show ? "inline-block" : "none";
    };
    window.addEventListener("scroll", toggleBackBtn, { passive: true });
    backBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    toggleBackBtn();
});
