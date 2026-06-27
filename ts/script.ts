// ============================================================
// Cworks Website \u2014 TypeScript Source
// Compile to js/script.js via `npx tsc`
// ============================================================

interface Window {
  WebFont?: { load: (config: Record<string, unknown>) => void };
}

(function (): void {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const loader = document.getElementById("page-loader");
  const heroTitle = document.getElementById("hero-title");
  const heroSubtitle = document.getElementById("hero-subtitle");
  let loaderHidden = false;
  let heroRevealed = false;

  function hideLoader(): void {
    if (loaderHidden || !loader) return;
    loaderHidden = true;
    loader.classList.add("page-loader--done");
    setTimeout((): void => {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
    }, 700);
  }

  function revealHero(): void {
    if (heroRevealed || !heroTitle || !heroSubtitle) return;
    heroRevealed = true;

    if (prefersReducedMotion) {
      heroTitle.style.opacity = "1";
      heroSubtitle.style.opacity = "1";
      return;
    }

    const titleText = heroTitle.textContent?.trim() ?? "";
    const titleChars = titleText.split("");

    heroTitle.textContent = "";
    titleChars.forEach((ch: string, i: number): void => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = ch;
      span.style.animationDelay = `${0.6 + i * 0.08}s`;
      heroTitle.appendChild(span);
    });

    const subtitleText = heroSubtitle.textContent?.trim() ?? "";
    const words = subtitleText.split(" ");

    heroSubtitle.textContent = "";
    words.forEach((word: string, i: number): void => {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = word;
      span.style.animationDelay = `${1.0 + i * 0.12}s`;
      heroSubtitle.appendChild(span);
      if (i < words.length - 1) {
        heroSubtitle.appendChild(document.createTextNode(" "));
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", (): void => {
      revealHero();
      setTimeout(hideLoader, 1800);
    });
  } else {
    revealHero();
    setTimeout(hideLoader, 1800);
  }

  window.addEventListener("load", (): void => hideLoader());
  setTimeout(hideLoader, 3000);
})();
