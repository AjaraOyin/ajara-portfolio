// =========================================================
// Ajara Lawal: personal site interactions
// Everything here is small and optional. The page still
// works and reads fine if JavaScript is turned off.
// =========================================================


// ---------- 1. Mobile menu ----------
const toggle = document.querySelector(".nav__toggle");
const menu = document.querySelector(".nav__menu");

toggle.addEventListener("click", () => {
  const isOpen = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!isOpen));
  menu.classList.toggle("is-open", !isOpen);
});

// Close the menu after tapping a link
menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
  });
});

// Close the menu with the Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.classList.contains("is-open")) {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    toggle.focus();
  }
});


// ---------- 2. Header border once you scroll ----------
const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 10);
}, { passive: true });


// ---------- 3. Underline the section you're reading ----------
const navLinks = document.querySelectorAll(".nav__menu a");
const sections = document.querySelectorAll("main section[id]");

const watcher = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navLinks.forEach((link) => {
      const matches = link.getAttribute("href") === "#" + entry.target.id;
      link.classList.toggle("is-current", matches);
    });
  });
}, {
  // A section counts as "current" when it crosses the middle of the screen
  rootMargin: "-45% 0px -50% 0px"
});

sections.forEach((section) => watcher.observe(section));


// ---------- 4. Project filters ----------
const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");
const count = document.querySelector(".projects__count");

function showProjects(tag) {
  let shown = 0;

  projects.forEach((project) => {
    const tags = project.dataset.tags.split(" ");
    const visible = tag === "all" || tags.includes(tag);
    project.hidden = !visible;
    if (visible) shown++;
  });

  // Tells screen reader users how many projects are showing
  count.textContent = `Showing ${shown} of ${projects.length} projects`;
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-pressed", "false");
    });
    button.classList.add("is-active");
    button.setAttribute("aria-pressed", "true");

    showProjects(button.dataset.filter);
  });
});

showProjects("all");


// ---------- 5. Copy email button ----------
const copyButton = document.querySelector("[data-copy]");
const copiedNote = document.querySelector(".contact__copied");

copyButton.addEventListener("click", async () => {
  const email = copyButton.dataset.copy;

  try {
    await navigator.clipboard.writeText(email);
    copiedNote.textContent = "Email copied";
  } catch {
    // Some browsers block the clipboard; fall back to showing the address
    copiedNote.textContent = "Couldn't copy. Select the address above instead.";
  }

  setTimeout(() => { copiedNote.textContent = ""; }, 3000);
});


// ---------- 6. Show initials if the photo is missing ----------
const photo = document.querySelector(".arch__img");
const arch = document.querySelector(".arch");

function useInitials() {
  arch.classList.add("no-photo");
}

// The photo may have already failed before this script ran
if (photo.complete && photo.naturalWidth === 0) {
  useInitials();
} else {
  photo.addEventListener("error", useInitials);
}


// ---------- 7. Current year in the footer ----------
document.getElementById("year").textContent = new Date().getFullYear();
