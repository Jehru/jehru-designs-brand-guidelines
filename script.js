const links = Array.from(document.querySelectorAll('.section-nav a'));
const sections = links
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter((node) => node instanceof HTMLElement);

const setActive = (id) => {
  links.forEach((link) => {
    const active = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', active);
  });
};

if (sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-30% 0px -55% 0px',
      threshold: 0.1,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

const toggle = document.getElementById('sidebar-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('sidebar-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close sections' : 'Open sections';
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('sidebar-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Open sections';
    });
  });
}
