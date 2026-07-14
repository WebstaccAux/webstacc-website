const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const preloader = document.querySelector("[data-preloader]");

if (preloader) {
  let introFinished = false;

  const finishIntro = () => {
    if (introFinished) return;
    introFinished = true;
    document.body.classList.remove("intro-active");
    document.body.classList.add("intro-done");
    window.setTimeout(() => {
      preloader.hidden = true;
    }, reducedMotion ? 120 : 900);
  };

  const startIntroExit = () => {
    window.setTimeout(finishIntro, reducedMotion ? 120 : 4800);
  };

  if (document.readyState === "complete") {
    startIntroExit();
  } else {
    window.addEventListener("load", startIntroExit, { once: true });
  }

  window.setTimeout(finishIntro, reducedMotion ? 650 : 7000);
}

const progress = document.querySelector(".scroll-progress");
const glow = document.querySelector(".pointer-glow");
const hero = document.querySelector(".hero");
const heroScene = document.querySelector("[data-wow-scene]");

const updateScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${value}%`;
  document.documentElement.style.setProperty("--page-scroll", `${value / 100}`);
};

window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener(
    "pointermove",
    (event) => {
      glow.style.opacity = "1";
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    },
    { passive: true }
  );
}

const stack = document.querySelector("[data-stack]");
if (stack && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  stack.addEventListener("pointermove", (event) => {
    const bounds = stack.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    stack.style.setProperty("--ry", `${x * 28}deg`);
    stack.style.setProperty("--rx", `${y * -24}deg`);
    stack.style.setProperty("--light-x", `${(x + 0.5) * 100}%`);
    stack.style.setProperty("--light-y", `${(y + 0.5) * 100}%`);
  });

  stack.addEventListener("pointerleave", () => {
    stack.style.setProperty("--ry", "-12deg");
    stack.style.setProperty("--rx", "-7deg");
    stack.style.setProperty("--light-x", "35%");
    stack.style.setProperty("--light-y", "20%");
  });
}

const finePointer = window.matchMedia("(pointer: fine)");
const desktopDepth = window.matchMedia("(min-width: 961px)");

if (hero && heroScene && !reducedMotion && finePointer.matches) {
  hero.addEventListener(
    "pointermove",
    (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      heroScene.style.setProperty("--scene-x", `${x * 34}px`);
      heroScene.style.setProperty("--scene-y", `${y * 30}px`);
      heroScene.style.setProperty("--scene-rx", `${y * -8}deg`);
      heroScene.style.setProperty("--scene-ry", `${x * 12}deg`);
    },
    { passive: true }
  );

  hero.addEventListener("pointerleave", () => {
    heroScene.style.setProperty("--scene-x", "0px");
    heroScene.style.setProperty("--scene-y", "0px");
    heroScene.style.setProperty("--scene-rx", "0deg");
    heroScene.style.setProperty("--scene-ry", "0deg");
  });
}

if (!reducedMotion && finePointer.matches) {
  document.querySelectorAll(".tilt-surface").forEach((surface) => {
    surface.addEventListener("pointermove", (event) => {
      const bounds = surface.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      const strength = surface.classList.contains("work-card") ? 6 : 4;

      surface.style.setProperty("--tilt-x", `${y * -strength}deg`);
      surface.style.setProperty("--tilt-y", `${x * strength}deg`);
      surface.style.setProperty("--glare-x", `${(x + 0.5) * 100}%`);
      surface.style.setProperty("--glare-y", `${(y + 0.5) * 100}%`);
      surface.style.setProperty("--glare-opacity", "1");
    });

    surface.addEventListener("pointerleave", () => {
      surface.style.setProperty("--tilt-x", "0deg");
      surface.style.setProperty("--tilt-y", "0deg");
      surface.style.setProperty("--glare-opacity", "0");
    });
  });
}

const heroStack = document.querySelector(".stack-scene");
const agencyOrb = document.querySelector(".agency-portrait");
let depthFrame = null;

const updateDepth = () => {
  depthFrame = null;
  if (reducedMotion || !desktopDepth.matches) return;

  const scroll = window.scrollY;
  heroStack?.style.setProperty("--parallax-y", `${Math.min(scroll * 0.075, 55)}px`);
  heroScene?.style.setProperty("--scroll-shift", `${Math.min(scroll * 0.045, 48)}px`);
  heroScene?.style.setProperty("--scroll-spin", `${Math.min(scroll * 0.025, 22)}deg`);

  if (agencyOrb) {
    const agencyBounds = agencyOrb.parentElement.getBoundingClientRect();
    const agencyOffset = (agencyBounds.top + agencyBounds.height / 2 - window.innerHeight / 2) * -0.035;
    agencyOrb.style.setProperty("--agency-depth", `${agencyOffset}px`);
  }
};

const requestDepth = () => {
  if (depthFrame === null) depthFrame = requestAnimationFrame(updateDepth);
};

window.addEventListener("scroll", requestDepth, { passive: true });
window.addEventListener("resize", requestDepth, { passive: true });
updateDepth();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);

document
  .querySelectorAll(".lead-quiz, .expertise-list, .work-grid, .method-steps, .contact-inner")
  .forEach((group) => {
    group.querySelectorAll(".reveal").forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index * 85, 340)}ms`);
    });
  });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll(".expertise-item").forEach((item) => {
  const button = item.querySelector("button");
  const symbol = item.querySelector(".expertise-toggle");

  button.addEventListener("click", () => {
    const wasActive = item.classList.contains("active");

    document.querySelectorAll(".expertise-item").forEach((otherItem) => {
      otherItem.classList.remove("active");
      otherItem.querySelector("button").setAttribute("aria-expanded", "false");
      otherItem.querySelector(".expertise-toggle").textContent = "+";
    });

    if (!wasActive) {
      item.classList.add("active");
      button.setAttribute("aria-expanded", "true");
      symbol.textContent = "−";
    }
  });
});

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.count);

      if (reducedMotion) {
        element.textContent = target;
      } else {
        const start = performance.now();
        const duration = 1300;

        const tick = (now) => {
          const elapsed = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - elapsed, 4);
          element.textContent = Math.round(target * eased);
          if (elapsed < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      }

      counterObserver.unobserve(element);
    });
  },
  { threshold: 0.8 }
);

document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector(".mobile-nav");
const menuLabel = menuButton?.querySelector(".sr-only");

const setMenu = (open) => {
  menuButton?.setAttribute("aria-expanded", String(open));
  mobileNav?.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  if (menuLabel) menuLabel.textContent = open ? "Menü schließen" : "Menü öffnen";
};

menuButton?.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1100) setMenu(false);
});

if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const bounds = element.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;
      element.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
}

const quiz = document.querySelector("[data-quiz]");

if (quiz) {
  const stages = [...quiz.querySelectorAll("[data-quiz-step]")];
  const progressItems = [...quiz.querySelectorAll(".quiz-progress i")];
  const currentStep = quiz.querySelector("[data-current-step]");
  const stepLabel = quiz.querySelector("[data-step-label]");
  const backButton = quiz.querySelector("[data-quiz-back]");
  const nextButton = quiz.querySelector("[data-quiz-next]");
  const submitButton = quiz.querySelector("[data-quiz-submit]");
  const errorMessage = quiz.querySelector(".quiz-error");
  const success = quiz.querySelector("[data-quiz-success]");
  const mailLink = quiz.querySelector("[data-quiz-mail]");
  const resetButton = quiz.querySelector("[data-quiz-reset]");
  const topbar = quiz.querySelector(".quiz-topbar");
  const progress = quiz.querySelector(".quiz-progress");
  const actions = quiz.querySelector(".quiz-actions");
  let activeStep = 0;

  const updateQuiz = (nextStep, shouldScroll = true) => {
    activeStep = Math.max(0, Math.min(nextStep, stages.length - 1));

    stages.forEach((stage, index) => {
      const active = index === activeStep;
      stage.hidden = !active;
      stage.classList.toggle("is-active", active);
    });

    progressItems.forEach((item, index) => {
      item.classList.toggle("done", index < activeStep);
      item.classList.toggle("active", index === activeStep);
    });

    currentStep.textContent = String(activeStep + 1).padStart(2, "0");
    stepLabel.textContent = stages[activeStep].dataset.quizStep;
    backButton.disabled = activeStep === 0;
    nextButton.hidden = activeStep === stages.length - 1;
    submitButton.hidden = activeStep !== stages.length - 1;
    errorMessage.textContent = "";

    if (shouldScroll) {
      quiz.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center",
      });
    }
  };

  const validateQuizStep = () => {
    const stage = stages[activeStep];
    const radios = [...stage.querySelectorAll('input[type="radio"]')];
    const checkboxes = [...stage.querySelectorAll('input[type="checkbox"]:not([name="datenschutz"])')];

    if (radios.length && !radios.some((input) => input.checked)) {
      errorMessage.textContent = "Bitte wähle eine der Optionen aus.";
      return false;
    }

    if (checkboxes.length && !checkboxes.some((input) => input.checked)) {
      errorMessage.textContent = "Bitte wähle mindestens eine Leistung aus.";
      return false;
    }

    const invalidField = [...stage.querySelectorAll("[required]")].find(
      (field) => !field.checkValidity()
    );

    if (invalidField) {
      errorMessage.textContent =
        invalidField.type === "email"
          ? "Bitte gib eine gültige E-Mail-Adresse ein."
          : "Bitte fülle alle Pflichtfelder aus.";
      invalidField.focus();
      return false;
    }

    return true;
  };

  quiz.addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;

    if (input.type === "radio") {
      quiz
        .querySelectorAll(`input[name="${input.name}"]`)
        .forEach((radio) => radio.closest(".option-card")?.classList.remove("is-selected"));
    }

    input.closest(".option-card")?.classList.toggle("is-selected", input.checked);
    errorMessage.textContent = "";
  });

  nextButton.addEventListener("click", () => {
    if (validateQuizStep()) updateQuiz(activeStep + 1);
  });

  backButton.addEventListener("click", () => updateQuiz(activeStep - 1));

  quiz.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateQuizStep()) return;

    const data = new FormData(quiz);
    const services = data.getAll("leistungen").join(", ");
    const subject = `Neue Projektanfrage von ${data.get("name")}`;
    const body = [
      "Hallo Webstacc,",
      "",
      "ich habe den Projekt-Check auf eurer Website ausgefüllt:",
      "",
      `Unternehmensform: ${data.get("unternehmen") || "–"}`,
      `Gewünschte Leistungen: ${services || "–"}`,
      `Budgetrahmen: ${data.get("budget") || "–"}`,
      `Gewünschter Start: ${data.get("timing") || "–"}`,
      "",
      `Name: ${data.get("name") || "–"}`,
      `E-Mail: ${data.get("email") || "–"}`,
      `Unternehmen: ${data.get("firma") || "–"}`,
      `Telefon: ${data.get("telefon") || "–"}`,
      "",
      "Weitere Informationen:",
      data.get("nachricht") || "–",
    ].join("\n");

    mailLink.href = `mailto:vertrieb@webstacc.de?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    stages.forEach((stage) => {
      stage.hidden = true;
    });
    topbar.hidden = true;
    progress.hidden = true;
    actions.hidden = true;
    errorMessage.hidden = true;
    success.hidden = false;
    success.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });
  });

  resetButton.addEventListener("click", () => {
    quiz.reset();
    quiz.querySelectorAll(".option-card").forEach((card) => card.classList.remove("is-selected"));
    topbar.hidden = false;
    progress.hidden = false;
    actions.hidden = false;
    errorMessage.hidden = false;
    success.hidden = true;
    updateQuiz(0);
  });

  updateQuiz(0, false);
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();
