(() => {
  const modal = document.getElementById('sheet-modal');
  const title = document.getElementById('sheet-modal-title');
  const body = document.getElementById('sheet-modal-body');
  let opener = null;
  document.querySelectorAll('[data-sheet]').forEach(button => {
    button.addEventListener('click', () => {
      const template = document.getElementById(button.dataset.sheet);
      if (!template) return;
      opener = button;
      title.textContent = button.dataset.title;
      body.replaceChildren(template.content.cloneNode(true));
      modal.showModal();
      document.body.classList.add('sheet-open');
      modal.querySelector('.modal-close').focus();
    });
  });
  body.addEventListener('click', event => {
    const button = event.target.closest('.sheet-zoom');
    if (!button) return;
    const viewport = body.querySelector('.project-image-scroll');
    const zoomed = viewport.classList.toggle('is-zoomed');
    button.setAttribute('aria-pressed', String(zoomed));
    button.textContent = zoomed ? 'Fit to window' : 'Zoom in';
  });
  modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', event => {
    const bounds = modal.getBoundingClientRect();
    if (event.target === modal && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) modal.close();
  });
  modal.addEventListener('close', () => {
    document.body.classList.remove('sheet-open');
    if (opener) opener.focus();
  });
  const links = [...document.querySelectorAll('.menu a')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const updateCurrent = () => {
    let current = sections[0];
    for (const section of sections) if (section.getBoundingClientRect().top <= 150) current = section;
    links.forEach(link => {
      if (link.getAttribute('href') === '#' + current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(() => { updateCurrent(); scheduled = false; }); }
  }, { passive: true });
  updateCurrent();
})();
