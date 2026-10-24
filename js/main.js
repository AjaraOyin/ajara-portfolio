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


// ---------- 3. One page at a time ----------
// Each section with an id is a page. The address bar shows which one
// (#about, #projects...), so the back button and shared links work.
const navLinks = document.querySelectorAll(".nav__menu a");
const pages = document.querySelectorAll("main > section[id]");
const siteTitle = document.title;

function showPage(id, moveFocus) {
  const page = document.getElementById(id);

  pages.forEach((p) => p.classList.toggle("is-current", p === page));

  navLinks.forEach((link) => {
    const matches = link.getAttribute("href") === "#" + id;
    link.classList.toggle("is-current", matches);
    if (matches) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  // e.g. "Projects | Ajara Lawal"; the home page keeps the full title
  const heading = page.querySelector("h2");
  document.title = heading ? `${heading.textContent} | Ajara Lawal` : siteTitle;

  // Start each page at the top, and tell screen readers the page changed
  window.scrollTo({ top: 0, behavior: "instant" });
  if (moveFocus) {
    page.setAttribute("tabindex", "-1");
    page.focus({ preventScroll: true });
  }
}

function pageFromAddress() {
  const id = location.hash.slice(1);
  // Links like #top or #main aren't pages, so they don't switch page
  return [...pages].some((p) => p.id === id) ? id : null;
}

window.addEventListener("hashchange", () => {
  const id = pageFromAddress();
  if (id) showPage(id, true);
});

showPage(pageFromAddress() || "home", false);

// When a link like yoursite/#projects is opened, the browser jumps to that
// section after loading. Undo the jump so the page starts at the top.
window.addEventListener("load", () => {
  window.scrollTo({ top: 0, behavior: "instant" });
});


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


// ---------- 5. Contact form ----------
// Sends the message in the background so visitors stay on the page.
// Without JavaScript the form still posts to FormSubmit the normal way.
const form = document.querySelector(".contact__form");
const sendButton = form.querySelector('button[type="submit"]');
const formStatus = form.querySelector(".contact__status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  sendButton.disabled = true;
  sendButton.textContent = "Sending...";
  formStatus.textContent = "";

  try {
    const response = await fetch(form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form)
    });
    if (!response.ok) throw new Error(response.statusText);

    form.reset();
    formStatus.textContent = "Thanks! Your message is on its way.";
  } catch {
    formStatus.textContent = "Sorry, that didn't send. Please email me at lawalajara1@gmail.com.";
  }

  sendButton.disabled = false;
  sendButton.textContent = "Send";
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
