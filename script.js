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

const copyText = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = value;
    area.setAttribute('readonly', '');
    area.style.position = 'absolute';
    area.style.left = '-9999px';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  }
};

const swatches = Array.from(document.querySelectorAll('.swatch'));
swatches.forEach((swatch) => {
  const hexElement = swatch.querySelector('.mono');
  if (!hexElement) return;

  const hex = hexElement.textContent.trim();
  const colorName = swatch.querySelector('h4')?.textContent?.trim() || hex;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'swatch-copy';
  button.textContent = 'Copy';
  swatch.setAttribute('role', 'button');
  swatch.setAttribute('tabindex', '0');
  swatch.setAttribute('aria-label', `Copy ${colorName} ${hex} to clipboard`);

  const triggerCopy = async () => {
    const ok = await copyText(hex);
    button.textContent = ok ? 'Copied' : 'Failed';
    swatch.classList.toggle('copied', ok);
    window.setTimeout(() => {
      button.textContent = 'Copy';
      swatch.classList.remove('copied');
    }, 1200);
  };

  swatch.addEventListener('click', triggerCopy);
  swatch.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      triggerCopy();
    }
  });

  swatch.appendChild(button);
});
